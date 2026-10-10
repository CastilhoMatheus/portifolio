# castilho.dev

My personal portfolio: **[castilho.dev](https://castilho.dev)**

Built with Next.js 16, TypeScript and Tailwind CSS v4. The palette mixes Palmeiras green, Brazil's gold and blue, and Ireland's orange: from Santa Catarina to Dublin.

## Highlights

- **Lab: logic you can see** ([/lab](https://castilho.dev/lab)). An interactive pathfinding visualiser. My name is drawn as walls on a grid, and BFS or A\* finds the shortest path around it. Hover to preview, click to replay, draw your own walls. The algorithms are plain TypeScript with a test suite.
- **Contact form without a public email.** Server Action with Zod validation, sent through Resend from `contact@castilho.dev`. Spam protection: honeypot field, minimum fill time, and a rate limit of 2 messages per 30 minutes per visitor (Upstash Redis), plus a daily cap.
- **Content in MDX.** About page and project write-ups are MDX files; pages are statically generated.
- **Motion with restraint.** Animated theme toggle, "kit swap" logo, spring hover effects (Motion), CSS entrance animations that work before hydration, and `prefers-reduced-motion` respected throughout.
- **Generated images.** Link-preview card and favicons are rendered at build time with `next/og` in the site's own fonts.
- **Lighthouse (mobile):** Accessibility, Best Practices and SEO 100 on every page; Performance 92–98.

## Stack

| Area           | Tools                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, Cache Components), React 19, TypeScript              |
| Styling        | Tailwind CSS v4 with CSS-variable design tokens, `next-themes` for dark mode |
| Motion         | [Motion](https://motion.dev)                                                 |
| Content        | MDX via `next-mdx-remote`                                                    |
| Email & limits | Resend, React Email, Upstash Redis + `@upstash/ratelimit`, Zod               |
| Testing        | Vitest                                                                       |
| Hosting        | Vercel (Web Analytics, preview deployments), domain on Cloudflare            |
| Fonts          | Gabarito (Naipe Foundry, Rio de Janeiro), JetBrains Mono, Uncial Antiqua     |

## Getting started

Requires Node.js 22+.

```bash
npm install
cp .env.example .env.local   # optional: only needed for the contact form
npm run dev                  # http://localhost:3000
```

Everything except sending email works without environment variables. Without Upstash, the rate limit is simply off.

### Environment variables

| Variable                                             | Purpose                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`                                     | Resend API key with sending access                                                          |
| `CONTACT_TO_EMAIL`                                   | Inbox that receives contact messages                                                        |
| `CONTACT_FROM_EMAIL`                                 | Sender, e.g. `Name <contact@your-domain>` (defaults to Resend's test sender)                |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting (the Vercel Marketplace integration may name them `KV_REST_API_*`; both work) |

### Scripts

| Command                           | What it does                                |
| --------------------------------- | ------------------------------------------- |
| `npm run dev`                     | Development server                          |
| `npm run build` / `npm start`     | Production build / serve it                 |
| `npm run lint`                    | ESLint                                      |
| `npm run format`                  | Prettier (with Tailwind class sorting)      |
| `npm test` / `npm run test:watch` | Vitest: pathfinding algorithms and min-heap |

## Project structure

```
app/                   Routes: home, about, projects, lab, contact, 404,
                       plus generated OG image, icons, sitemap and robots
components/            UI: header, footer, logo, theme toggle, project index,
  pathfinder/          the Lab's canvas, controls and animation
  mdx/                 how Markdown renders, plus the <Porco> easter egg
content/
  site.ts              Name, tagline, nav, socials, SEO: edit text here
  about.mdx            About page
  projects/*.mdx       One file per project (frontmatter + write-up)
lib/
  pathfinding/         grid helpers, BFS, A*, min-heap, and their tests
  mdx.ts, projects.ts  MDX loading (cached by file modification time)
  rate-limit.ts        Contact form limits
emails/                React Email template for contact messages
assets/fonts/          TTF fonts for generated images (OFL licences included)
docs/                  Design notes and decisions
```

### Adding a project

Create `content/projects/<slug>.mdx`:

```mdx
---
title: "Project name"
summary: "One or two sentences."
year: 2026
stack: ["Next.js", "TypeScript"]
repo: "https://github.com/…"
live: "https://…" # optional
featured: true # true = own page + homepage index; false = "Also built" card
order: 5 # lower comes first
---

## What it does

…
```

## Notes

- **npm lockfile bug.** Installing a package can sometimes drop the platform-specific binaries Vitest needs from `package-lock.json` ([npm/cli#4828](https://github.com/npm/cli/issues/4828)). If `npm test` fails with _"Cannot find native binding"_, run `rm -rf node_modules package-lock.json && npm install`.
- **Credits.** The AI Journal project follows Scott Moss's _Build an AI-Powered Fullstack Next.js App_ course on Frontend Masters, and is credited on its project page.
