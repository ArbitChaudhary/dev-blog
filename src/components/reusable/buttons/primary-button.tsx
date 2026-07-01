import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  label: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function PrimaryButton({
  className,
  label,
  onClick,
  type = "button",
  disabled,
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn("bg-primary text-primary-foreground", className)}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

export { PrimaryButton };
