import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  const socials = site.socials.filter((s) => s.href.startsWith("http"));

  return (
    <Container className="py-16 sm:py-24">
      <FadeIn className="flex flex-col items-start gap-4">
        <span className="bg-surface text-muted rounded-full px-3 py-1 font-mono text-sm">
          Contact
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Let&apos;s talk.
        </h1>
        <p className="text-muted max-w-2xl text-xl">
          Graduate roles, a project idea, or just to say olá. Send a message and
          I&apos;ll reply by email.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-14 md:grid-cols-[1fr_17rem]">
        <FadeIn delay={0.1} className="max-w-xl">
          <ContactForm />
        </FadeIn>

        <FadeIn delay={0.2}>
          <aside className="flex flex-col gap-6">
            <div>
              <h2 className="text-muted font-mono text-xs uppercase">
                Elsewhere
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary font-medium transition-colors"
                    >
                      {social.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-muted font-mono text-xs uppercase">
                Based in
              </h2>
              <p className="mt-3 font-medium">
                {site.location.split(" · ")[0]}
              </p>
            </div>
          </aside>
        </FadeIn>
      </div>
    </Container>
  );
}
