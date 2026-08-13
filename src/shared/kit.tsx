// ============================================================
// Shared furniture for the tal BOSS reel set. Every reel is 720×900 @30fps
// on white, uses the Obviously display face for headlines, and closes on the
// same tal BOSS slate - so it all lives here rather than in five copies.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import "../hinge/hinge.css";
import { OBVIOUSLY } from "../hinge/fonts";

export const FPS = 30;
export const REEL_W = 720;
export const REEL_H = 900;
export const fr = (ms: number) => Math.round((ms * FPS) / 1000);

export const INK = "#141414";
export const PURPLE = "#8B4CD8";
export const GREEN = "#13bf69";
export const MUTED = "#6c6c70";
export const FAINT = "#a9a29b";
export const LOGO_SRC = "reel/tal-boss-wordmark-dark.png";

export const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lerp = (frame: number, i: number[], o: number[], easing = Easing.out(Easing.cubic)) =>
  interpolate(frame, i, o, { ...clampE, easing });

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true });

// display type - the reel headline face
export const disp = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: `${OBVIOUSLY}, sans-serif`,
  fontWeight: 700,
  textTransform: "uppercase",
  fontSize: size,
  lineHeight: 0.98,
  letterSpacing: "-0.01em",
  color: INK,
  textAlign: "center",
  ...extra,
});

// the white stage every reel sits on
export const Stage: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#fff" }) => (
  <AbsoluteFill
    className="r245-stage"
    style={{ fontFamily: inter.fontFamily, ["--font-anton" as string]: OBVIOUSLY, background: bg, overflow: "hidden" }}
  >
    {children}
  </AbsoluteFill>
);

// ---- the closing tal BOSS slate ----
// `local` is frames since the slate began. Logo pops, tagline and badges follow.
export const Slate: React.FC<{ local: number; total: number; frame: number; line?: string }> = ({
  local,
  total,
  frame,
  line,
}) => {
  const pop = spring({ frame: Math.max(0, local), fps: FPS, config: { damping: 13, stiffness: 130, mass: 0.9 } });
  const tag = lerp(local, [fr(340), fr(720)], [0, 1]);
  const badge = lerp(local, [fr(560), fr(980)], [0, 1]);
  const out = interpolate(frame, [total - fr(360), total - fr(70)], [1, 0], clampE);

  return (
    <AbsoluteFill style={{ background: "#fff", zIndex: 900 }}>
      {line && (
        <div style={{ position: "absolute", top: 168, left: 0, right: 0, padding: "0 56px", opacity: Math.min(1, pop * 1.4) * out }}>
          <div style={disp(46, { color: MUTED })}>{line}</div>
        </div>
      )}
      <div style={{ position: "absolute", top: line ? 340 : 300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
        <Img
          src={staticFile(LOGO_SRC)}
          style={{ height: 196, width: "auto", display: "block", transform: `scale(${0.9 + 0.1 * Math.min(pop, 1.05)})` }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: line ? 592 : 545,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 22,
          fontWeight: 500,
          color: "#8a8a8a",
          opacity: tag * out,
        }}
      >
        where Bangalore founders hire directly
      </div>
      <div
        style={{
          position: "absolute",
          top: line ? 660 : 615,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: badge * out,
          transform: `translateY(${(1 - badge) * 14}px)`,
        }}
      >
        <Img src={staticFile("reel/badges-stores.png")} style={{ width: 520, height: "auto", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---- compact closing slate ----
// Same furniture as Slate (lockup → tagline → store badges) but on a tight
// clock, for the short loop reels. The badges are the call to action - never
// ship a cut without them.
export const CompactSlate: React.FC<{ local: number }> = ({ local }) => {
  const pop = spring({ frame: Math.max(0, local), fps: FPS, config: { damping: 13, stiffness: 150, mass: 0.85 } });
  const tag = lerp(local, [fr(220), fr(520)], [0, 1]);
  const badge = lerp(local, [fr(400), fr(760)], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
      <Img
        src={staticFile(LOGO_SRC)}
        style={{ height: 172, width: "auto", display: "block", transform: `scale(${0.88 + 0.12 * Math.min(pop, 1.04)})` }}
      />
      <div style={{ fontSize: 21, fontWeight: 500, color: "#8a8a8a", marginTop: 24, opacity: tag }}>
        where Bangalore founders hire directly
      </div>
      <Img
        src={staticFile("reel/badges-stores.png")}
        style={{ width: 520, height: "auto", display: "block", marginTop: 34, opacity: badge, transform: `translateY(${(1 - badge) * 14}px)` }}
      />
    </AbsoluteFill>
  );
};

// ---- a generic scene-timeline builder ----
export type Span = { start: number; end: number; dur: number };
export function timeline<T extends string>(ms: Record<T, number>, order: T[]) {
  const scenes = {} as Record<T, Span>;
  let t = 0;
  for (const k of order) {
    const dur = fr(ms[k]);
    scenes[k] = { start: t, end: t + dur, dur };
    t += dur;
  }
  return { scenes, total: t };
}
