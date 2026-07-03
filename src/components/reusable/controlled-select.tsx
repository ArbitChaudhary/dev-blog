import {
  Controller,
  FieldErrors,
  Path,
  PathValue,
  type Control,
  type FieldValues,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type ControlledSelectProps<T extends FieldValues> = {
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

function ControlledSelect<T extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = "Select an option",
  className,
  disabled,
  defaultValue,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-1.5", className)}>
          {label && (
            <label htmlFor={name} className="text-sm font-medium">
              {label}
            </label>
          )}
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!error}
              className="w-full"
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error?.message && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export { ControlledSelect };
