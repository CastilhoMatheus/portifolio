"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex flex-wrap gap-6">
      {site.nav.map((item) => {
        // "/projects/pathfinder" should still highlight "Projects"
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`focus-visible:outline-primary rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
              isActive ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
