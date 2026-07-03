import { useCallback, useEffect, useRef, useState } from "react";
import {
  Controller,
  Path,
  PathValue,
  type Control,
  type FieldValues,
} from "react-hook-form";
import { ImageIcon, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_ACCEPTED_FORMATS = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type ControlledFileUploadProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  /** Allow selecting more than one image. */
  multiple?: boolean;
  /** Accepted MIME types, e.g. ["image/png", "image/jpeg"]. */
  acceptedFormats?: string[];
  /** Maximum file size in megabytes. */
  maxSizeMB?: number;
  /** Recommended image dimensions shown as a hint, e.g. "1200 x 630 px". */
  recommendedDimensions?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined;
};

function formatAcceptLabel(formats: string[]) {
  return formats
    .map((format) => format.split("/")[1]?.toUpperCase())
    .filter(Boolean)
    .join(", ");
}

function ControlledFileUpload<T extends FieldValues>({
  name,
  control,
  label,
  description,
  className,
  disabled,
  multiple = false,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  maxSizeMB = 5,
  recommendedDimensions,
  defaultValue,
}: ControlledFileUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const acceptLabel = formatAcceptLabel(acceptedFormats);

  // Revoke object URLs on unmount to avoid memory leaks.
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `"${file.name}" is not a supported format. Allowed: ${acceptLabel}.`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `"${file.name}" exceeds the ${maxSizeMB}MB size limit.`;
      }
      return null;
    },
    [acceptedFormats, acceptLabel, maxSizeMB],
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState: { error } }) => {
        const commitFiles = (updated: UploadedImage[]) => {
          setPreviews(updated);
          const files = updated.map((item) => item.file);
          field.onChange(multiple ? files : (files[0] ?? null));
        };

        const handleFiles = (fileList: FileList | null) => {
          if (!fileList || fileList.length === 0) return;
          setLocalError(null);

          const incoming = Array.from(fileList);
          const validItems: UploadedImage[] = [];

          for (const file of incoming) {
            const validationError = validateFile(file);
            if (validationError) {
              setLocalError(validationError);
              continue;
            }
            validItems.push({
              id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
              file,
              previewUrl: URL.createObjectURL(file),
            });
          }

          if (validItems.length === 0) return;

          const next = multiple
            ? [...previews, ...validItems]
            : validItems.slice(0, 1);

          if (!multiple) {
            previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
          }

          commitFiles(next);
        };

        const handleRemove = (id: string) => {
          const target = previews.find((p) => p.id === id);
          if (target) URL.revokeObjectURL(target.previewUrl);
          const next = previews.filter((p) => p.id !== id);
          commitFiles(next);
          if (inputRef.current) inputRef.current.value = "";
        };

        return (
          <div className={cn("flex flex-col gap-2", className)}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium">
                {label}
              </label>
            )}

            <div
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              aria-invalid={!!error}
              onClick={() => !disabled && inputRef.current?.click()}
              onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (!disabled) handleFiles(event.dataTransfer.files);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 text-center transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary/60",
                error && "border-destructive",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Upload className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptLabel} &middot; up to {maxSizeMB}MB
              </p>
              {recommendedDimensions && (
                <p className="text-xs text-muted-foreground">
                  Recommended dimensions: {recommendedDimensions}
                </p>
              )}

              <input
                ref={inputRef}
                id={name}
                type="file"
                className="hidden"
                accept={acceptedFormats.join(",")}
                multiple={multiple}
                disabled={disabled}
                onBlur={field.onBlur}
                onChange={(event) => handleFiles(event.target.files)}
              />
            </div>

            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((preview) => (
                  <div
                    key={preview.id}
                    className="group relative overflow-hidden rounded-lg border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.previewUrl}
                      alt={preview.file.name}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(preview.id)}
                      aria-label={`Remove ${preview.file.name}`}
                      className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                      <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs text-muted-foreground">
                        {preview.file.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(error?.message || localError) && (
              <p className="text-sm text-destructive">
                {error?.message ?? localError}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

export { ControlledFileUpload };
export type { ControlledFileUploadProps };
