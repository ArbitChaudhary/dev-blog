import { useState } from "react";
import {
  Controller,
  FieldErrors,
  Path,
  PathValue,
  type Control,
  type FieldValues,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ControlledInputProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined | "";
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  errors?: FieldErrors<T>;
};

function ControlledInput<T extends FieldValues>({
  name,
  control,
  label,
  className,
  type = "text",
  placeholder,
  defaultValue,
  errors,
}: ControlledInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

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
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={inputType}
              aria-invalid={!!error}
              placeholder={placeholder}
              className={cn(isPasswordField && "pr-10")}
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            )}
          </div>
          {error?.message && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export { ControlledInput };
