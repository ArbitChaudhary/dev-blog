import {
  Controller,
  Path,
  PathValue,
  type Control,
  type FieldValues,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ControlledSwitchProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof Switch>,
  "name" | "defaultValue" | "checked" | "onCheckedChange"
> & {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined;
};

function ControlledSwitch<T extends FieldValues>({
  name,
  control,
  label,
  description,
  className,
  defaultValue,
  disabled,
  ...props
}: ControlledSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-1.5 shadow-md p-5", className)}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              {label && (
                <label htmlFor={name} className="text-sm font-medium">
                  {label}
                </label>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Switch
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              disabled={disabled}
              aria-invalid={!!error}
              className="h-7 w-12 [&_[data-slot=switch-thumb]]:size-6"
              {...props}
            />
          </div>
          {error?.message && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export { ControlledSwitch };
