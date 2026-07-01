"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { LogOut, Menu, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthUser } from "@/hooks/use-auth-user";
import { navLinks } from "./nav-links";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuthUser();

  const close = () => setOpen(false);

  const handleSignOut = async () => {
    close();
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch {
      // no-op: Hub listener keeps UI in sync on success
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActive(pathname, link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          {isLoading ? (
            <div className="h-9 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <>
              <Button variant="outline" size="lg" asChild>
                <Link href="/profile" onClick={close}>
                  <User className="size-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="destructive" size="lg" onClick={handleSignOut}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-in" onClick={close}>
                  Sign in
                </Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/sign-up" onClick={close}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
