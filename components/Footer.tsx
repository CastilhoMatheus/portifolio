import { cacheLife } from "next/cache";
import Container from "@/components/Container";
import { site } from "@/content/site";

// cacheComponents forbids new Date() in the static shell; caching it makes the
// year static too, refreshed daily so it rolls over on Jan 1 without a redeploy.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

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
          {site.socials.map((social) => {
            // mailto: opens the mail app, so a new tab makes no sense there
            const isExternal = social.href.startsWith("http");

            return (
              <a
                key={social.href}
                href={social.href}
                {...(isExternal && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="hover:text-primary focus-visible:outline-primary rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {social.label}
              </a>
            );
          })}
        </nav>
      </Container>
    </footer>
  );
}
