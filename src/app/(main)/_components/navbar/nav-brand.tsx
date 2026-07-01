import Link from "next/link";
import { PenLine } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavBrandProps {
  className?: string;
  onClick?: () => void;
}

export function NavBrand({ className, onClick }: NavBrandProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 font-heading text-lg font-semibold tracking-tight",
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <PenLine className="size-4" />
      </span>
      <span>DevBlog</span>
    </Link>
  );
}
