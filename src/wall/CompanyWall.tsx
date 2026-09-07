import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { fontFamily } from "@remotion/google-fonts/Archivo";
import { Marquee } from "./Marquee";
import { COMPANIES, toLanes, type Company } from "./companies";
import { type Segment } from "./segments";

// palette (matches the static company-wall creative)
const INK = "#262220";
const CREAM = "#F5EFE7";
const PURPLE = "#8B4CD8";

const LANES = 6; // number of scrolling rows

export const EYEBROW = "Bosses already hiring on tal";
export const SUB = "Your next hire is being interviewed by one of them right now.";
export const CTA = "Download the app";

// Driven by an optional segment: with none it is the general wall, with one
// it becomes that peer group's cut (headline, company set, highlights, sub).
export const CompanyWall: React.FC<{ segment?: Segment }> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const u = width / 1080; // scale unit - template works at any width

  const eyebrow = segment
    ? `${segment.count.toLocaleString("en-IN")} ${segment.noun} in Bengaluru`
    : EYEBROW;
  const sub = segment ? segment.sub : SUB;
  const items: Company[] = segment
    ? segment.companies.map((name) => ({ name, hot: segment.highlight.includes(name) }))
    : COMPANIES;

  const lanes = toLanes(items, LANES);

  // gentle staggered entrance for the framing chrome
  const appear = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      durationInFrames: 22,
      config: { damping: 200 },
    });
    return { s, ty: (1 - s) * 18 * u };
  };

  const nameStyle = (hot?: boolean): React.CSSProperties => ({
    fontSize: 52 * u,
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    color: hot ? PURPLE : CREAM,
  });

  const dotStyle: React.CSSProperties = {
    fontSize: 52 * u,
    fontWeight: 400,
    lineHeight: 1,
    color: CREAM,
    opacity: 0.3,
    padding: `0 ${18 * u}px`,
  };

  const renderLane = (lane: Company[], idx: number) => (
    <div
      key={idx}
      style={{ height: 70 * u, display: "flex", alignItems: "center" }}
    >
      <Marquee
        speed={(0.9 + idx * 0.14) * u}
        direction={idx % 2 === 0 ? -1 : 1}
        startOffset={idx * 240 * u}
      >
        {lane.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <span style={nameStyle(c.hot)}>{c.name}</span>
            <span style={dotStyle}>·</span>
          </div>
        ))}
      </Marquee>
    </div>
  );

  const logo = appear(0);
  const eyebrowIn = appear(3);
  const subIn = appear(7);
  const cta = appear(11);

  const edgeMask =
    "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)";

  return (
    <AbsoluteFill
      style={{
        background: INK,
        fontFamily,
        color: CREAM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${74 * u}px 0 ${88 * u}px`,
      }}
    >
      {/* logo - tal BOSS lockup (cream, for the ink canvas) */}
      <Img
        src={staticFile("reel/tal-boss-wordmark-cream.png")}
        style={{
          height: 96 * u,
          width: "auto",
          display: "block",
          opacity: logo.s,
          transform: `translateY(${logo.ty}px)`,
        }}
      />

      {/* eyebrow */}
      <div
        style={{
          fontSize: 33 * u,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          marginTop: 46 * u,
          opacity: eyebrowIn.s * 0.6,
          transform: `translateY(${eyebrowIn.ty}px)`,
        }}
      >
        {eyebrow}
      </div>

      {/* the scrolling wall - fills the middle */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22 * u,
          WebkitMaskImage: edgeMask,
          maskImage: edgeMask,
        }}
      >
        {lanes.map(renderLane)}
      </div>

      {/* sub */}
      <div
        style={{
          fontSize: 37 * u,
          fontWeight: 400,
          letterSpacing: "-0.015em",
          lineHeight: 1.3,
          textAlign: "center",
          maxWidth: 760 * u,
          opacity: subIn.s * 0.82,
          transform: `translateY(${subIn.ty}px)`,
        }}
      >
        {sub}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 48 * u,
          background: CREAM,
          color: INK,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          borderRadius: 999,
          fontSize: 35 * u,
          padding: `${28 * u}px ${58 * u}px`,
          opacity: cta.s,
          transform: `translateY(${cta.ty}px)`,
        }}
      >
        {CTA}
      </div>
    </AbsoluteFill>
  );
};
