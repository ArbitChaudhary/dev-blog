import {
  Controller,
  FieldErrors,
  Path,
  PathValue,
  type Control,
  type FieldValues,
} from "react-hook-form";
import { Check, ChevronDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { SelectOption } from "./controlled-select";

type ControlledSelectMultipleProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  errors?: FieldErrors<T>;
};

function ControlledSelectMultiple<T extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = "Select options",
  className,
  disabled,
  defaultValue,
}: ControlledSelectMultipleProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState: { error } }) => {
        const selected: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        const toggle = (value: string) => {
          const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
          field.onChange(next);
        };

        const remove = (value: string) => {
          field.onChange(selected.filter((v) => v !== value));
        };

        const selectedOptions = options.filter((o) =>
          selected.includes(o.value),
        );

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium">
                {label}
              </label>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                id={name}
                disabled={disabled}
                aria-invalid={!!error}
                onBlur={field.onBlur}
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex flex-1 flex-wrap gap-1">
                  {selectedOptions.length === 0 ? (
                    <span className="text-muted-foreground">{placeholder}</span>
                  ) : (
                    selectedOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="gap-1"
                      >
                        {option.label}
                        <span
                          role="button"
                          tabIndex={-1}
                          aria-label={`Remove ${option.label}`}
                          className="hover:text-destructive cursor-pointer"
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            remove(option.value);
                          }}
                        >
                          <X className="size-3" />
                        </span>
                      </Badge>
                    ))
                  )}
                </div>
                <ChevronDown className="size-4 shrink-0 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-(--radix-dropdown-menu-trigger-width)"
              >
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      disabled={option.disabled}
                      onSelect={(e) => {
                        e.preventDefault();
                        toggle(option.value);
                      }}
                    >
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center",
                          !isSelected && "opacity-0",
                        )}
                      >
                        <Check className="size-4" />
                      </span>
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {error?.message && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export { ControlledSelectMultiple };
