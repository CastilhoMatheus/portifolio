import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { loadOgFonts, OG_COLORS as c } from "@/lib/og";

// The preview card shown when castilho.dev is shared (LinkedIn, WhatsApp, Slack, X…).
// Child pages inherit it unless they define their own.
export const alt = `${site.shortName} ${site.lastName}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DOT_GAP = 40;
const PATH_CELLS = 9;

// Loaded once at module level (not per request), so the image is built at build time
const fonts = await loadOgFonts();

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: c.bg,
        fontFamily: "Gabarito",
        color: c.text,
      }}
    >
      {/* Faint dot grid, like the Lab */}
      <div
        style={{
          position: "absolute",
          // Satori (the image renderer) ignores `inset`, so size it explicitly
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          display: "flex",
          flexWrap: "wrap",
          padding: DOT_GAP / 2,
        }}
      >
        {Array.from({
          length: Math.floor(1200 / DOT_GAP) * Math.floor(630 / DOT_GAP),
        }).map((_, i) => (
          <div
            key={i}
            style={{
              width: DOT_GAP,
              height: DOT_GAP,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: 3,
                backgroundColor: c.muted,
                opacity: 0.25,
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          gap: 28,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 12,
            backgroundColor: c.surface,
            borderRadius: 999,
            padding: "10px 22px",
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: c.muted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              backgroundColor: c.primary,
            }}
          />
          castilho.dev
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          {site.shortName}&nbsp;
          <span style={{ color: c.primary }}>{site.lastName}</span>
        </div>

        <div style={{ display: "flex", fontSize: 40, color: c.muted }}>
          {site.tagline}
        </div>

        {/* Pathfinder motif: start ring → gold path → orange goal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 30,
              border: `5px solid ${c.primary}`,
            }}
          />
          {Array.from({ length: PATH_CELLS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: c.gold,
                opacity: 0.35 + (0.65 * (i + 1)) / PATH_CELLS,
              }}
            />
          ))}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 30,
              backgroundColor: c.orange,
            }}
          />
        </div>
      </div>

      {/* Irish tricolour along the bottom, like the footer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 12,
          display: "flex",
        }}
      >
        <div style={{ flex: 1, backgroundColor: c.primary }} />
        <div style={{ flex: 1, backgroundColor: "#ffffff" }} />
        <div style={{ flex: 1, backgroundColor: c.orange }} />
      </div>
    </div>,
    { ...size, fonts: [...fonts] },
  );
}
