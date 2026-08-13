// ============================================================
// Outro - CTA slate. Cross-dissolves in from the chat: the "tal" logo pops,
// a tagline fades up, then the App Store / Google Play badges. Content fades
// back to white at the very end so the reel loops cleanly into the intro.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile } from "remotion";
import { SCENES, TOTAL_FRAMES, FPS, f } from "./timing";

const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Outro: React.FC<{ frame: number }> = ({ frame }) => {
  const start = SCENES.outro.start;
  if (frame < start - f(300)) return null;
  const lf = frame - start;

  // cross-dissolve in over the tail of the chat
  const fadeIn = interpolate(frame, [start - f(300), start + f(120)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  // fade the content back to white at the end → clean loop into the intro
  const contentOut = interpolate(frame, [TOTAL_FRAMES - f(420), TOTAL_FRAMES - f(80)], [1, 0], clampE);

  const pop = spring({ frame: Math.max(0, lf), fps: FPS, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const tShow = interpolate(lf, [f(220), f(560)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const bShow = interpolate(lf, [f(360), f(760)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: "#ffffff", opacity: fadeIn, alignItems: "center", justifyContent: "center", flexDirection: "column", zIndex: 900 }}>
      <Img
        src={staticFile("reel/tal-boss-wordmark-dark.png")}
        style={{ height: 190, width: "auto", display: "block", opacity: contentOut, transform: `scale(${0.9 + 0.1 * Math.min(pop, 1.05)})`, marginBottom: 30 }}
      />
      <div style={{ fontSize: 22, fontWeight: 500, color: "#8a8a8a", letterSpacing: "0.01em", opacity: tShow * contentOut, marginBottom: 48 }}>
        where Bangalore founders hire directly
      </div>
      <Img
        src={staticFile("reel/badges-stores.png")}
        style={{ width: 560, height: "auto", display: "block", opacity: bShow * contentOut, transform: `translateY(${(1 - bShow) * 16}px)` }}
      />
    </AbsoluteFill>
  );
};
