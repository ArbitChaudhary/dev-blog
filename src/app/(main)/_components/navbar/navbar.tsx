"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { NavBrand } from "./nav-brand";
import { DesktopNav } from "./desktop-nav";
import { ModeToggle } from "./mode-toggle";
import { AuthMenu } from "./auth-menu";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <NavBrand />
        <DesktopNav />
        <div className="flex items-center gap-1">
          <ModeToggle />
          <div className="hidden md:block">
            <AuthMenu />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
