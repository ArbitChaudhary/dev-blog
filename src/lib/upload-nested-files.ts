import { uploadData } from "aws-amplify/storage";

/**
 * Aggregated progress across every file discovered in a payload.
 */
export interface NestedUploadProgress {
  /** Bytes transferred so far across all files. */
  loaded: number;
  /** Total bytes to transfer across all files. */
  total: number;
  /** Completion percentage (0 - 100). */
  percent: number;
  /** Number of files that finished uploading. */
  completedFiles: number;
  /** Total number of files being uploaded. */
  totalFiles: number;
}

export interface UploadNestedFilesOptions {
  /**
   * Folder prefix placed after the identity segment, e.g. `"blogs"` resolves to
   * `blogs/{identityId}/...`. Matches the storage access rules.
   */
  folder: string;
  /** Optional sub-folder to group files by field name, resource id, etc. */
  subFolder?: string;
  /** Called whenever aggregate upload progress changes. */
  onProgress?: (progress: NestedUploadProgress) => void;
}

/**
 * Structural transform of `T` where every {@link File} (at any depth) is
 * replaced by the `string` storage key it resolves to after upload.
 */
export type UploadedResult<T> = T extends File
  ? string
  : T extends (infer U)[]
    ? UploadedResult<U>[]
    : T extends object
      ? { [K in keyof T]: UploadedResult<T[K]> }
      : T;

interface CollectedFile {
  file: File;
  assign: (value: string) => void;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively clones `value`, replacing every {@link File} with a placeholder
 * that is filled in once the file has been uploaded. Non-file leaves are copied
 * as-is; class instances (Date, etc.) are passed through untouched.
 */
function cloneAndCollect(
  value: unknown,
  assign: (value: unknown) => void,
  collected: CollectedFile[],
): void {
  if (value instanceof File) {
    collected.push({ file: value, assign: (key) => assign(key) });
    return;
  }

  if (Array.isArray(value)) {
    const next: unknown[] = new Array(value.length);
    assign(next);
    value.forEach((item, index) => {
      cloneAndCollect(
        item,
        (resolved) => {
          next[index] = resolved;
        },
        collected,
      );
    });
    return;
  }

  if (isPlainObject(value)) {
    const next: Record<string, unknown> = {};
    assign(next);
    for (const key of Object.keys(value)) {
      cloneAndCollect(
        value[key],
        (resolved) => {
          next[key] = resolved;
        },
        collected,
      );
    }
    return;
  }

  assign(value);
}

function sanitizeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot === -1 ? name : name.slice(0, dot))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const ext = dot === -1 ? "" : name.slice(dot).toLowerCase();
  return `${base || "file"}${ext}`;
}

function buildFileTail(subFolder: string | undefined, file: File) {
  const parts: string[] = [];
  if (subFolder) parts.push(subFolder);
  parts.push(`${crypto.randomUUID()}-${sanitizeFileName(file.name)}`);
  return parts.join("/");
}

/**
 * Walks an arbitrary (possibly deeply nested) payload, uploads every {@link File}
 * it contains to S3 via Amplify Storage, and returns a structurally identical
 * object where each file has been replaced by its uploaded storage key.
 *
 * Uploads run in parallel and report a single aggregated progress value.
 *
 * @example
 * const payload = { title, cover: File, gallery: [File, File], meta: { icon: File } };
 * const result = await uploadNestedFiles(payload, { folder: "blogs" });
 * // result.cover -> "blogs/<identityId>/<uuid>-cover.png"
 */
export async function uploadNestedFiles<T>(
  data: T,
  options: UploadNestedFilesOptions,
): Promise<UploadedResult<T>> {
  const { folder, subFolder, onProgress } = options;

  const holder: { root: unknown } = { root: undefined };
  const collected: CollectedFile[] = [];

  cloneAndCollect(
    data,
    (resolved) => {
      holder.root = resolved;
    },
    collected,
  );

  if (collected.length === 0) {
    return holder.root as UploadedResult<T>;
  }

  const totalBytes = collected.reduce((sum, item) => sum + item.file.size, 0);
  const transferred = new Array<number>(collected.length).fill(0);
  let completedFiles = 0;

  const emitProgress = () => {
    if (!onProgress) return;
    const loaded = transferred.reduce((sum, bytes) => sum + bytes, 0);
    onProgress({
      loaded,
      total: totalBytes,
      percent: totalBytes === 0 ? 100 : Math.round((loaded / totalBytes) * 100),
      completedFiles,
      totalFiles: collected.length,
    });
  };

  emitProgress();

  await Promise.all(
    collected.map(async ({ file, assign }, index) => {
      const { result } = uploadData({
        path: ({ identityId }) =>
          `${folder}/${identityId}/${buildFileTail(subFolder, file)}`,
        data: file,
        options: {
          contentType: file.type || "application/octet-stream",
          onProgress: ({ transferredBytes }) => {
            transferred[index] = transferredBytes;
            emitProgress();
          },
        },
      });

      const uploaded = await result;
      transferred[index] = file.size;
      completedFiles += 1;
      emitProgress();
      assign(uploaded.path);
    }),
  );

  return holder.root as UploadedResult<T>;
}
