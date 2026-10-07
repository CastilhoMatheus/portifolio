import Container from "@/components/Container";
import LogoLink from "@/components/LogoLink";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="py-6">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <LogoLink />

        <div className="flex items-center gap-6">
          <NavLinks />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
