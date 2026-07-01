import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonLoadingProps {
  label: string;
  isLoading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function ButtonLoading({
  className,
  label,
  isLoading = false,
  onClick,
  type = "button",
  disabled,
}: ButtonLoadingProps) {
  return (
    <Button
      className={cn(
        "bg-primary text-primary-foreground",
        isLoading && "cursor-not-allowed",
        className,
      )}
      onClick={onClick}
      type={type}
      disabled={isLoading || disabled}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {label}
    </Button>
  );
}

export { ButtonLoading };
