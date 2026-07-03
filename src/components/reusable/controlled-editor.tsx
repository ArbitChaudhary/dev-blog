"use client";

import { useEffect, useId, useRef } from "react";
import {
  Controller,
  Path,
  PathValue,
  type Control,
  type FieldValues,
} from "react-hook-form";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import { cn } from "@/lib/utils";

const DEFAULT_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

type ControlledEditorProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  readOnly?: boolean;
  defaultValue?: PathValue<T, Path<T>> | undefined | "";
  toolbar?: unknown[];
};

function ControlledEditor<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  editorClassName,
  readOnly = false,
  defaultValue,
  toolbar = DEFAULT_TOOLBAR,
}: ControlledEditorProps<T>) {
  const generatedId = useId();
  const editorId = `${name}-${generatedId}`;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState: { error } }) => (
        <QuillField
          id={editorId}
          label={label}
          placeholder={placeholder}
          className={className}
          editorClassName={editorClassName}
          readOnly={readOnly}
          toolbar={toolbar}
          value={(field.value as string) ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          hasError={!!error}
          errorMessage={error?.message}
        />
      )}
    />
  );
}

type QuillFieldProps = {
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  readOnly: boolean;
  toolbar: unknown[];
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  hasError: boolean;
  errorMessage?: string;
};

function QuillField({
  id,
  label,
  placeholder,
  className,
  editorClassName,
  readOnly,
  toolbar,
  value,
  onChange,
  onBlur,
  hasError,
  errorMessage,
}: QuillFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);

  useEffect(() => {
    onChangeRef.current = onChange;
    onBlurRef.current = onBlur;
  }, [onChange, onBlur]);

  // Initialize Quill once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const quill = new Quill(editorContainer, {
      theme: "snow",
      placeholder,
      readOnly,
      modules: { toolbar },
    });

    quillRef.current = quill;

    quill.on(Quill.events.TEXT_CHANGE, () => {
      const html = quill.getSemanticHTML();
      const isEmpty = quill.getText().trim().length === 0;
      onChangeRef.current(isEmpty ? "" : html);
    });

    quill.root.addEventListener("blur", () => onBlurRef.current());

    return () => {
      quillRef.current = null;
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value into the editor (e.g. reset, async defaults).
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    if (value === quill.getSemanticHTML()) return;

    const selection = quill.getSelection();
    const delta = quill.clipboard.convert({ html: value ?? "" });
    quill.setContents(delta, Quill.sources.SILENT);
    if (selection) {
      quill.setSelection(selection, Quill.sources.SILENT);
    }
  }, [value]);

  // Keep read-only state in sync.
  useEffect(() => {
    quillRef.current?.enable(!readOnly);
  }, [readOnly]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <div
        id={id}
        aria-invalid={hasError}
        className={cn(
          "rounded-md border border-input bg-transparent [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md [&_.ql-editor]:min-h-40",
          hasError && "border-destructive",
          editorClassName,
        )}
      >
        <div ref={containerRef} />
      </div>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

export { ControlledEditor };
