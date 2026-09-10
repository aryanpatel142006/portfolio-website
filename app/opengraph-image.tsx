import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/content";

/* Social share card — the hero, typeset for a 1200×630 frame: kicker,
   the brushstroke-A name with its electric period, tagline, URL. Generated
   once at build (no request-time APIs), served as /opengraph-image. */

export const alt = `${profile.name} — ${profile.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f4f1e9";
const INK = "#1c1a15";
const GRAPHITE = "#67634f";
const SOFT_GRAPHITE = "#57544a";
const ACCENT = "#2b3ee8";

export default async function Image() {
  const [font, glyph] = await Promise.all([
    readFile(join(process.cwd(), "assets-src/fonts/Fraunces-SemiBold.woff")),
    readFile(join(process.cwd(), "public/a-symbol.png")),
  ]);
  const glyphSrc = `data:image/png;base64,${glyph.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 96px 56px",
          background: PAPER,
          color: INK,
          fontFamily: "Fraunces",
          position: "relative",
        }}
      >
        {/* page rails, like the site's column */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 60,
            width: 1,
            background: "rgba(28, 26, 21, 0.16)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 60,
            width: 1,
            background: "rgba(28, 26, 21, 0.16)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 5,
            color: GRAPHITE,
            textTransform: "uppercase",
          }}
        >
          portfolio · {profile.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontSize: 176,
              lineHeight: 0.92,
              letterSpacing: -6,
            }}
          >
            {/* the hand-drawn glyph stands in for the first A */}
            <img
              alt=""
              src={glyphSrc}
              width={152}
              height={131}
              style={{ marginRight: -10, marginBottom: 6 }}
            />
            <span>ryan</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 176,
              lineHeight: 0.92,
              letterSpacing: -6,
            }}
          >
            Patel<span style={{ color: ACCENT }}>.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: 720,
              fontSize: 26,
              lineHeight: 1.35,
              color: SOFT_GRAPHITE,
            }}
          >
            {profile.tagline}
          </div>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              fontSize: 20,
              letterSpacing: 3,
              color: GRAPHITE,
            }}
          >
            aryan.is-a.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: font, style: "normal", weight: 600 }],
    },
  );
}
