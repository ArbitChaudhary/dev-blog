export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
