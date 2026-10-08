import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import Porco from "@/components/mdx/Porco";

/** Gold marker highlight: <Highlight>important bit</Highlight> */
function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-gold/40 dark:bg-gold/25 text-text rounded-sm px-0.5">
      {children}
    </mark>
  );
}

/** How Markdown elements look inside any MDX page (about, projects). */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-6 text-2xl font-bold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-4 text-xl font-semibold" {...props} />,
  p: (props) => <p className="text-text/90" {...props} />,
  a: (props) => (
    <a
      className="text-primary decoration-gold font-medium underline decoration-2 underline-offset-4 hover:decoration-4"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="marker:text-primary list-disc space-y-2 pl-6" {...props} />
  ),
  ol: (props) => (
    <ol
      className="marker:text-primary list-decimal space-y-2 pl-6"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  code: (props) => (
    <code
      className="bg-surface rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  // Used for notes and credits, e.g. "built following X's course"
  blockquote: (props) => (
    <blockquote
      className="border-gold bg-surface text-muted [&_a]:text-primary rounded-r-lg border-l-4 px-5 py-4 text-base"
      {...props}
    />
  ),
  Highlight,
  Porco,
};
