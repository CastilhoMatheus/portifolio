import { cacheLife } from "next/cache";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/content/site";

// cacheComponents forbids new Date() in the static shell; caching it makes the
// year static too, refreshed daily so it rolls over on Jan 1 without a redeploy.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const linkClass =
  "hover:text-primary focus-visible:outline-primary rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4";

export default function Footer() {
  return (
    <footer className="pb-10">
      {/* Irish tricolour: green, white, orange. The white is explicit so it still
          shows on the dark background (on the light one it blends into the cream) */}
      <div
        aria-hidden="true"
        className="mb-10 h-1 bg-[linear-gradient(to_right,var(--primary)_33.3%,white_33.3%_66.6%,var(--orange)_66.6%)]"
      />

      <Container className="text-muted flex flex-col gap-6 text-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p
            lang="ga"
            className="font-irish text-primary mb-2 text-2xl leading-none"
          >
            Go raibh maith agat
          </p>
          <p className="mb-3 font-mono text-xs">
            &ldquo;thank you&rdquo;, in Irish, for stopping by
          </p>
          <p>
            © <CurrentYear /> {site.name}
          </p>
          <p className="font-mono text-xs">{site.location}</p>
        </div>

        <nav aria-label="Social" className="flex flex-wrap gap-6">
          {site.socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {social.label}
            </a>
          ))}
          {/* No public email address: messages go through the rate-limited form */}
          <Link href="/contact" className={linkClass}>
            Contact
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
