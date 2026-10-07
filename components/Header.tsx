import Link from "next/link";
import Container from "@/components/Container";
import NavLinks from "@/components/NavLinks";
import { site } from "@/content/site";

export default function Header() {
  return (
    <header className="py-6">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-visible:outline-primary rounded-sm text-xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {site.shortName}
        </Link>

        <NavLinks />
      </Container>
    </header>
  );
}
