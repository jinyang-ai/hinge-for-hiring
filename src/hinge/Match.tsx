// ============================================================
// "It's a match!" — the Hinge payoff beat. After the boss requests the
// resume and Sanchit replies, the two avatars pop in from opposite sides,
// a spark bursts between them, confetti falls. Reframes hiring as MUTUAL:
// the candidate wants you too. On the reel's white canvas (purple only as
// accent — no off-brand fills). Full-frame overlay above the chat, under
// the outro (which cross-dissolves over it). Local clock from match.start.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile } from "remotion";
import { SCENES, FPS, f } from "./timing";
import { hero } from "./data";
import { OBVIOUSLY } from "./fonts";

const INK = "#1c1c1e";
const PURPLE = "#8B4CD8";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// deterministic confetti (no Math.random — every render worker must agree).
// Colours read on white: purple, ink, light-purple, amber.
const C = [PURPLE, "#262220", "#C9A3F0", "#F2A93B"];
const CONFETTI = [
  { x: 8, delay: 0, size: 16, c: 0, drift: 20 },
  { x: 18, delay: 3, size: 12, c: 2, drift: -14 },
  { x: 27, delay: 1, size: 18, c: 3, drift: 10 },
  { x: 38, delay: 5, size: 12, c: 0, drift: 24 },
  { x: 46, delay: 2, size: 16, c: 1, drift: -18 },
  { x: 55, delay: 6, size: 12, c: 2, drift: 14 },
  { x: 63, delay: 1, size: 18, c: 0, drift: -22 },
  { x: 72, delay: 4, size: 12, c: 3, drift: 18 },
  { x: 81, delay: 2, size: 16, c: 0, drift: -10 },
  { x: 90, delay: 5, size: 14, c: 2, drift: 22 },
  { x: 14, delay: 8, size: 12, c: 1, drift: -16 },
  { x: 33, delay: 9, size: 14, c: 3, drift: 12 },
  { x: 60, delay: 8, size: 12, c: 0, drift: -20 },
  { x: 86, delay: 10, size: 16, c: 1, drift: 16 },
];

const Avatar: React.FC<{ src: string; label: string; pos?: string; enter: number; from: number }> = ({ src, label, pos = "50% 30%", enter, from }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateX(${from * (1 - enter)}px)`, opacity: enter }}>
    <div style={{ width: 190, height: 190, borderRadius: 999, overflow: "hidden", border: `4px solid ${PURPLE}`, boxShadow: "0 14px 40px rgba(0,0,0,0.16)", background: "#fff" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>{label}</div>
  </div>
);

export const Match: React.FC<{ frame: number }> = ({ frame }) => {
  const start = SCENES.match.start;
  if (frame < start - f(120) || frame > SCENES.outro.start + f(200)) return null;
  const lf = frame - start;

  const bg = interpolate(lf, [-f(120), f(140)], [0, 1], clampE);
  const enterL = spring({ frame: Math.max(0, lf - f(40)), fps: FPS, config: { damping: 13, stiffness: 140, mass: 0.9 } });
  const enterR = spring({ frame: Math.max(0, lf - f(120)), fps: FPS, config: { damping: 13, stiffness: 140, mass: 0.9 } });
  const spark = spring({ frame: Math.max(0, lf - f(300)), fps: FPS, config: { damping: 10, stiffness: 180, mass: 0.7 } });
  const titleIn = spring({ frame: Math.max(0, lf - f(360)), fps: FPS, config: { damping: 14, stiffness: 130, mass: 0.9 } });
  const subIn = interpolate(lf, [f(500), f(760)], [0, 1], clampE);
  const firstName = hero.name.split(" ")[0];

  return (
    <AbsoluteFill style={{ zIndex: 850, overflow: "hidden", background: "#fff", opacity: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
      {/* confetti */}
      {CONFETTI.map((cf, i) => {
        const p = interpolate(lf, [f(240) + cf.delay * 6, f(240) + cf.delay * 6 + f(1400)], [0, 1], clampE);
        const y = -12 + p * 122; // % of height
        const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0], clampE);
        return <div key={i} style={{ position: "absolute", left: `${cf.x}%`, top: `${y}%`, width: cf.size, height: cf.size * 1.4, background: C[cf.c], borderRadius: 3, transform: `translateX(${cf.drift * p}px) rotate(${p * 320 + i * 40}deg)`, opacity: op }} />;
      })}

      {/* headline — ink with a purple accent on "match" */}
      <div style={{ fontFamily: `${OBVIOUSLY}, sans-serif`, fontSize: 92, fontWeight: 700, color: INK, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, textAlign: "center", transform: `scale(${0.7 + 0.3 * titleIn})`, opacity: titleIn, marginBottom: 54 }}>
        It&rsquo;s a <span style={{ color: PURPLE }}>match!</span>
      </div>

      {/* avatars + spark */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}>
        <Avatar src={staticFile("reel/boss-face.jpg")} label="You" pos="52% 20%" enter={enterL} from={-260} />
        <div style={{ width: 78, height: 78, margin: "0 -6px 40px", borderRadius: 999, background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spark})`, boxShadow: `0 0 36px 6px rgba(139,76,216,0.45)`, zIndex: 2 }}>
          <span style={{ fontSize: 38 }}>🤝</span>
        </div>
        <Avatar src={hero.facePhoto} label={firstName} pos="50% 30%" enter={enterR} from={260} />
      </div>

      {/* sub */}
      <div style={{ marginTop: 52, fontSize: 34, fontWeight: 500, color: "#6c6c70", opacity: subIn, textAlign: "center", letterSpacing: "-0.015em", maxWidth: 560, lineHeight: 1.3 }}>
        {firstName} wants to build with you too.
      </div>
    </AbsoluteFill>
  );
};
