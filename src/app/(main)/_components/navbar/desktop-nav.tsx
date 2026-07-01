"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navLinks } from "./nav-links";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
            isActive(pathname, link.href)
              ? "bg-muted text-foreground"
              : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
