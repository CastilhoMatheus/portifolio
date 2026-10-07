# Decisions

| Date       | Decision                                                | Why                                                                                                        |
| ---------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-10-07 | Next.js 16 (App Router) + TS + Tailwind v4              | Known stack; server actions cover the contact form without a separate API                                  |
| 2026-10-07 | No database in MVP                                      | Only dynamic feature is contact; email (Resend) is the store. Revisit for guestbook/admin (Neon + Drizzle) |
| 2026-10-07 | Resend + react-email for contact                        | Free tier, simple SDK, sends from own domain, `replyTo` = visitor                                          |
| 2026-10-07 | Projects as MDX in repo (gray-matter + next-mdx-remote) | Content versioned with code, fully static pages                                                            |
| 2026-10-07 | Vercel hosting                                          | Push-to-deploy, preview per PR, free tier                                                                  |
