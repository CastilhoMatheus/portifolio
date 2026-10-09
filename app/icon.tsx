import { ImageResponse } from "next/og";
import { loadOgFonts, OG_COLORS as c } from "@/lib/og";

// Browser tab icon: an "M." in Gabarito on Palmeiras green, with a Brazil-gold dot
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Loaded once at module level (not per request), so the image is built at build time
const fonts = await loadOgFonts();

export default async function Icon() {
  return new ImageResponse(<Mark size={size.width} />, {
    ...size,
    fonts: [...fonts],
  });
}

export function Mark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: c.primaryDeep,
        borderRadius: size * 0.22,
        fontFamily: "Gabarito",
        fontWeight: 800,
        fontSize: size * 0.68,
        color: c.cream,
        letterSpacing: -size * 0.02,
      }}
    >
      M
      <div
        style={{
          width: size * 0.13,
          height: size * 0.13,
          borderRadius: size,
          backgroundColor: c.gold,
          marginTop: size * 0.32,
          marginLeft: size * 0.02,
        }}
      />
    </div>
  );
}
