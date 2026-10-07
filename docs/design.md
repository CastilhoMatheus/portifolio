# Design

## Three adjectives

1. Warm
2. Playful
3. _todo — pick your third_

## Moodboard

- **joshwcomeau.com**: springy motion everywhere, whimsy in small details (theme toggle, hovers),
  interactive explanations instead of static text. Borrow the _principles_, not the look.

## Identity: Palmeiras × Brazil × Ireland

Palmeiras green is the brand color. Brazil and Ireland add the accents. Use each color for one job,
so the palette stays rich without looking like a flag.

| Token        | Light     | Dark      | Origin                     | Job                                                     |
| ------------ | --------- | --------- | -------------------------- | ------------------------------------------------------- |
| `bg`         | `#FBF8F1` | `#0B1F16` | Irish white / deep verdão  | Page background                                         |
| `surface`    | `#F2EDE1` | `#12291E` |                            | Cards, code blocks                                      |
| `text`       | `#0E1A14` | `#F3EFE3` |                            | Body text                                               |
| `muted`      | `#4A5A51` | `#A8B5AD` |                            | Secondary text                                          |
| `primary`    | `#006437` | `#3CCB7F` | Palmeiras green            | Links, headings accents, buttons                        |
| `gold`       | `#FFDF00` | `#FFDF00` | Brazil yellow              | Highlights, marker underline, the found path            |
| `blue`       | `#002776` | `#7FA2FF` | Brazil blue                | Visited nodes in pathfinder, info states                |
| `orange`     | `#FF883E` | `#FF883E` | Irish orange               | Pathfinder target, small "pop" details                  |

Contrast rules (checked against `bg`):

- `primary` on light `bg` ≈ 6.9:1, so it's safe for text.
- `gold` and `orange` on light `bg` **fail** as text. Use them only as backgrounds, underlines,
  and graphics. On the dark theme, `gold` works as text.

Pathfinder mapping: walls (your name) = `primary`, visited = `blue` fading out, path = `gold`,
target = `orange`. The algorithm literally draws Brazil's colors across Palmeiras green.

## Fonts

| Role           | Font                                                    | Why                                                                                                                                                                 |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display + body | **Gabarito** (Google Fonts)                              | By Naipe Foundry (Rio de Janeiro). Made for a Brazilian exam-prep platform ("gabarito" = answer sheet), with math and logic symbols. Brazilian, and fits a DSA theme |
| Mono           | **JetBrains Mono** (Google Fonts)                       | Pathfinder stats, code snippets, small labels (`A* · 412 nodes · 3.1ms`)                                                                                             |
| Irish accent   | **Uncial Antiqua** (Google Fonts), optional and sparing | Gaelic uncial lettering for _one_ detail only (e.g. a greeting or a footer signature). Never for body text                                                          |

Paid upgrade later: Naipe also sells **Pacaembu**, named after the São Paulo stadium where Palmeiras
used to play.

## Tailwind v4 wiring (reference)

Put CSS variables on `:root` and `.dark`, then expose them to Tailwind with `@theme inline`:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #fbf8f1;
  --primary: #006437; /* …rest of the light column */
}
.dark {
  --bg: #0b1f16;
  --primary: #3ccb7f; /* …rest of the dark column */
}

@theme inline {
  --color-bg: var(--bg);
  --color-primary: var(--primary); /* → bg-bg, text-primary, etc. */
  --font-display: var(--font-gabarito);
  --font-mono: var(--font-jetbrains-mono);
}
```

## Concept

Home = hero with the pathfinder + a typographic index of work (No. · Title · Year · Stack).
Hover a row → cursor-following preview, with spring motion.
