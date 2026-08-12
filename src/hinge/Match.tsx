// ============================================================
// "It's a match!" — the Hinge payoff beat. After the boss requests the
// resume and Sanchit replies, the two avatars pop in from opposite sides,
// a spark bursts between them, confetti falls. Reframes hiring as MUTUAL:
// the candidate wants you too. Full-frame overlay above the chat, under
// the outro (which cross-dissolves over it). Local clock from match.start.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, Easing } from "remotion";
import { SCENES, FPS, f } from "./timing";
import { hero } from "./data";
import { OBVIOUSLY } from "./fonts";

const CREAM = "#F5EFE7";
const PURPLE = "#8B4CD8";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// deterministic confetti (no Math.random — every render worker must agree)
const CONFETTI = [
  { x: 8, delay: 0, size: 16, color: CREAM, drift: 20 },
  { x: 18, delay: 3, size: 12, color: "#C9A3F0", drift: -14 },
  { x: 27, delay: 1, size: 20, color: "#ffffff", drift: 10 },
  { x: 38, delay: 5, size: 12, color: PURPLE, drift: 24 },
  { x: 46, delay: 2, size: 16, color: CREAM, drift: -18 },
  { x: 55, delay: 6, size: 12, color: "#C9A3F0", drift: 14 },
  { x: 63, delay: 1, size: 18, color: "#ffffff", drift: -22 },
  { x: 72, delay: 4, size: 12, color: CREAM, drift: 18 },
  { x: 81, delay: 2, size: 16, color: PURPLE, drift: -10 },
  { x: 90, delay: 5, size: 14, color: "#C9A3F0", drift: 22 },
  { x: 14, delay: 8, size: 12, color: "#ffffff", drift: -16 },
  { x: 33, delay: 9, size: 14, color: CREAM, drift: 12 },
  { x: 60, delay: 8, size: 12, color: PURPLE, drift: -20 },
  { x: 86, delay: 10, size: 16, color: "#ffffff", drift: 16 },
];

const Avatar: React.FC<{ src?: string; label: string; emoji?: string; enter: number; from: number }> = ({ src, label, emoji, enter, from }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateX(${from * (1 - enter)}px)`, opacity: enter }}>
    <div style={{ width: 190, height: 190, borderRadius: 999, overflow: "hidden", border: `5px solid ${CREAM}`, boxShadow: "0 12px 40px rgba(0,0,0,0.28)", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {src ? <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 92 }}>{emoji}</span>}
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: CREAM, letterSpacing: "-0.01em" }}>{label}</div>
  </div>
);

export const Match: React.FC<{ frame: number }> = ({ frame }) => {
  const start = SCENES.match.start;
  if (frame < start - f(120) || frame > SCENES.outro.start + f(200)) return null;
  const lf = frame - start;

  const bg = interpolate(lf, [-f(120), f(160)], [0, 1], clampE);
  const enterL = spring({ frame: Math.max(0, lf - f(60)), fps: FPS, config: { damping: 13, stiffness: 140, mass: 0.9 } });
  const enterR = spring({ frame: Math.max(0, lf - f(160)), fps: FPS, config: { damping: 13, stiffness: 140, mass: 0.9 } });
  const spark = spring({ frame: Math.max(0, lf - f(360)), fps: FPS, config: { damping: 10, stiffness: 180, mass: 0.7 } });
  const titleIn = spring({ frame: Math.max(0, lf - f(420)), fps: FPS, config: { damping: 14, stiffness: 130, mass: 0.9 } });
  const subIn = interpolate(lf, [f(560), f(820)], [0, 1], clampE);
  const firstName = hero.name.split(" ")[0];

  return (
    <AbsoluteFill style={{ zIndex: 850, overflow: "hidden", background: `radial-gradient(120% 90% at 50% 18%, ${PURPLE} 0%, #5C2E93 55%, #2C1147 100%)`, opacity: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
      {/* confetti */}
      {CONFETTI.map((c, i) => {
        const p = interpolate(lf, [f(300) + c.delay * 6, f(300) + c.delay * 6 + f(1400)], [0, 1], clampE);
        const y = -12 + p * 122; // % of height
        const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0], clampE);
        return <div key={i} style={{ position: "absolute", left: `${c.x}%`, top: `${y}%`, width: c.size, height: c.size * 1.4, background: c.color, borderRadius: 3, transform: `translateX(${c.drift * p}px) rotate(${p * 320 + i * 40}deg)`, opacity: op }} />;
      })}

      {/* headline */}
      <div style={{ fontFamily: `${OBVIOUSLY}, sans-serif`, fontSize: 92, fontWeight: 700, color: CREAM, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, textAlign: "center", transform: `scale(${0.7 + 0.3 * titleIn})`, opacity: titleIn, marginBottom: 54 }}>
        It&rsquo;s a match!
      </div>

      {/* avatars + spark */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}>
        <Avatar emoji="🧑🏽‍💼" label="You" enter={enterL} from={-260} />
        <div style={{ width: 78, height: 78, margin: "0 -6px 40px", borderRadius: 999, background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spark})`, boxShadow: `0 0 40px 8px rgba(139,76,216,0.6)`, zIndex: 2 }}>
          <span style={{ fontSize: 40 }}>🤝</span>
        </div>
        <Avatar src={hero.facePhoto} label={firstName} enter={enterR} from={260} />
      </div>

      {/* sub */}
      <div style={{ marginTop: 52, fontSize: 34, fontWeight: 500, color: CREAM, opacity: subIn * 0.92, textAlign: "center", letterSpacing: "-0.015em", maxWidth: 560, lineHeight: 1.3 }}>
        {firstName} wants to build with you too.
      </div>
    </AbsoluteFill>
  );
};
