import { ImageResponse } from "next/og";
import { Mark } from "@/app/icon";
import { loadOgFonts } from "@/lib/og";

// Home-screen icon on iPhone/iPad (same mark as the favicon, bigger)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Loaded once at module level (not per request), so the image is built at build time
const fonts = await loadOgFonts();

export default async function AppleIcon() {
  return new ImageResponse(<Mark size={size.width} />, {
    ...size,
    fonts: [...fonts],
  });
}
