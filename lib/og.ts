import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Shared by the generated images (link preview, favicons). ImageResponse can't
 * use CSS variables or next/font, so the palette and font files are passed in here.
 * Fonts are static TTFs in assets/fonts (OFL licensed, see the .txt files there).
 */
export const OG_COLORS = {
  bg: "#0b1f16",
  surface: "#12291e",
  text: "#f3efe3",
  muted: "#a8b5ad",
  primary: "#3ccb7f",
  primaryDeep: "#006437",
  cream: "#fbf8f1",
  gold: "#ffdf00",
  orange: "#ff883e",
} as const;

const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");

export async function loadOgFonts() {
  const [bold, regular, mono] = await Promise.all([
    readFile(path.join(FONTS_DIR, "Gabarito-ExtraBold.ttf")),
    readFile(path.join(FONTS_DIR, "Gabarito-Regular.ttf")),
    readFile(path.join(FONTS_DIR, "JetBrainsMono-Regular.ttf")),
  ]);

  return [
    { name: "Gabarito", data: bold, weight: 800, style: "normal" },
    { name: "Gabarito", data: regular, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
  ] as const;
}
