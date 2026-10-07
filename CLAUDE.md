@AGENTS.md

# Project conventions

- Next.js 16 App Router + TypeScript + Tailwind v4. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.
- Content lives in `content/projects/*.mdx` (frontmatter: title, year, stack, links, cover). No database in the MVP.
- Contact form = server action in `app/contact/actions.ts` → zod → Resend. Secrets only via env (see `.env.example`).
- Design tokens are CSS variables in `app/globals.css`; don't hardcode colors.
- Matheus writes first passes; prefer explaining and reviewing over rewriting his code.
- Record notable choices in `docs/decisions.md`.
