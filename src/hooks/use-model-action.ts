"use client";

import { useCallback, useMemo, useState } from "react";

import { client } from "@/redux/api/client";
import {
  uploadNestedFiles,
  type NestedUploadProgress,
} from "@/lib/upload-nested-files";
import type { Schema } from "../../amplify/data/resource";

/** Any model exposed by the generated Amplify Data client. */
export type ModelName = keyof (typeof client)["models"] & keyof Schema;

/** The record type returned for a given model. */
export type ModelType<Name extends ModelName> = Schema[Name] extends {
  type: infer T;
}
  ? T
  : never;

/** Phase of the current action, useful for granular UI feedback. */
export type ActionPhase = "idle" | "uploading" | "saving" | "done" | "error";

export interface ActionState {
  phase: ActionPhase;
  isSubmitting: boolean;
  isUploading: boolean;
  progress: NestedUploadProgress | null;
  error: Error | null;
}

const INITIAL_STATE: ActionState = {
  phase: "idle",
  isSubmitting: false,
  isUploading: false,
  progress: null,
  error: null,
};

export interface UseModelActionOptions {
  /**
   * S3 folder prefix used when the payload contains files, e.g. `"blogs"`
   * resolves to `blogs/{identityId}/...`. Omit to skip file uploads entirely.
   */
  uploadFolder?: string;
  /** Optional sub-folder grouping for uploaded files. */
  uploadSubFolder?: string;
  /**
   * Convert empty/whitespace strings to `null` before persisting.
   * @default true
   */
  nullifyEmpty?: boolean;
}

type MutationResult<T> = Promise<{ data: T | null; errors?: unknown }>;

/** Minimal shape we rely on from a generated model, cast per model name. */
interface ModelOperations<T> {
  create: (input: Record<string, unknown>) => MutationResult<T>;
  update: (input: Record<string, unknown>) => MutationResult<T>;
  delete: (input: { id: string }) => MutationResult<T>;
}

/** Recursively strips empty strings so they are stored as `null`. */
function nullifyEmptyStrings<T>(value: T): T {
  if (typeof value === "string") {
    return (value.trim() === "" ? null : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map(nullifyEmptyStrings) as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = nullifyEmptyStrings(val);
    }
    return out as T;
  }
  return value;
}

function toError(cause: unknown): Error {
  if (cause instanceof Error) return cause;
  if (Array.isArray(cause) && cause[0]?.message) {
    return new Error(String(cause[0].message));
  }
  return new Error(typeof cause === "string" ? cause : "Something went wrong");
}

/**
 * Generic, dynamic hook for Amplify Data mutations.
 *
 * Works against **any** model in the schema. It transparently uploads any
 * {@link File} found anywhere in a (possibly deeply nested) payload to S3,
 * swaps each file for its storage key, optionally nullifies empty strings, and
 * then persists the record via the model's `create` / `update` / `delete`.
 *
 * @example
 * const post = useModelAction("BlogPost", { uploadFolder: "blogs" });
 * await post.create({ title, content, coverImage: file, authorId });
 *
 * @example
 * const category = useModelAction("UserProfile");
 * await category.update({ id, profilePicture: file });
 */
export function useModelAction<Name extends ModelName>(
  modelName: Name,
  options: UseModelActionOptions = {},
) {
  const { uploadFolder, uploadSubFolder, nullifyEmpty = true } = options;

  const [state, setState] = useState<ActionState>(INITIAL_STATE);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const model = useMemo(
    () =>
      client.models[modelName] as unknown as ModelOperations<ModelType<Name>>,
    [modelName],
  );

  /**
   * Uploads nested files (when configured), prepares the payload, then runs the
   * provided persistence callback. Centralises phase/progress/error handling.
   */
  const run = useCallback(
    async (
      input: Record<string, unknown>,
      persist: (
        prepared: Record<string, unknown>,
      ) => MutationResult<ModelType<Name>>,
    ): Promise<ModelType<Name> | null> => {
      setState({
        phase: uploadFolder ? "uploading" : "saving",
        isSubmitting: true,
        isUploading: Boolean(uploadFolder),
        progress: null,
        error: null,
      });

      try {
        const uploaded = uploadFolder
          ? await uploadNestedFiles(input, {
              folder: uploadFolder,
              subFolder: uploadSubFolder,
              onProgress: (progress) =>
                setState((prev) => ({ ...prev, progress })),
            })
          : input;

        const prepared = nullifyEmpty
          ? nullifyEmptyStrings(uploaded)
          : uploaded;

        setState((prev) => ({ ...prev, phase: "saving", isUploading: false }));

        const { data, errors } = await persist(
          prepared as Record<string, unknown>,
        );
        if (errors) throw errors;

        setState((prev) => ({
          ...prev,
          phase: "done",
          isSubmitting: false,
          isUploading: false,
        }));

        return data;
      } catch (cause) {
        const error = toError(cause);
        setState((prev) => ({
          ...prev,
          phase: "error",
          isSubmitting: false,
          isUploading: false,
          error,
        }));
        throw error;
      }
    },
    [uploadFolder, uploadSubFolder, nullifyEmpty],
  );

  const create = useCallback(
    (input: Record<string, unknown>) =>
      run(input, (prepared) => model.create(prepared)),
    [run, model],
  );

  const update = useCallback(
    (input: Record<string, unknown> & { id: string }) =>
      run(input, (prepared) => model.update(prepared)),
    [run, model],
  );

  const remove = useCallback((id: string) => model.delete({ id }), [model]);

  return useMemo(
    () => ({ ...state, create, update, remove, reset }),
    [state, create, update, remove, reset],
  );
}
