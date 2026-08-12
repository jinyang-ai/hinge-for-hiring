// ============================================================
// Cold-open hook — the first ~1.1s. Before the tagline, a killer candidate
// card snaps in, gets a LIKE stamp, and swipes off to the right — teasing the
// value (and the abundance: this is just one of many) — then hands straight
// into the "Hinge, but for hiring" title slam. Lead with the money shot;
// explain after. Local clock = frame (hook is the first scene, start 0).
// ============================================================
import React from "react";
import { AbsoluteFill, interpolate, spring, Easing, useVideoConfig } from "remotion";
import { SCENES, FPS, f, REEL_W, REEL_H } from "./timing";
import { dismissed } from "./data";
import { CandidateCard } from "./CandidateCard";

const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREEN = "#13bf69";

// the flex: Rohan — ex-Zerodha, ₹42 LPA, shipped 0→1 solo
const pick = dismissed.find((c) => c.id === "d3") ?? dismissed[dismissed.length - 1];

export const Hook: React.FC<{ frame: number }> = ({ frame }) => {
  const { width } = useVideoConfig();
  if (frame > SCENES.title.start + f(160)) return null;

  const inS = spring({ frame, fps: FPS, config: { damping: 15, stiffness: 150, mass: 0.8 } });
  // hold, then swipe off to the right (a "like")
  const swipe = interpolate(frame, [f(620), f(1000)], [0, 1], { ...clampE, easing: Easing.in(Easing.cubic) });
  const stamp = spring({ frame: Math.max(0, frame - f(540)), fps: FPS, config: { damping: 11, stiffness: 190, mass: 0.7 } });

  const x = swipe * (width + 500);
  const rot = -3 * (1 - inS) + swipe * 22;
  const scale = (0.9 + 0.1 * inS) * 1.44;
  const y = (1 - inS) * 150;
  const fade = interpolate(frame, [f(880), f(1040)], [1, 0], clampE);

  return (
    <AbsoluteFill style={{ background: "#fff", zIndex: 700, display: "flex", alignItems: "center", justifyContent: "center", opacity: fade }}>
      <div style={{ position: "relative", width: REEL_W, height: REEL_H, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`, transformOrigin: "center" }}>
          <CandidateCard c={pick} />
          {/* LIKE stamp — pops just before the swipe */}
          <div style={{ position: "absolute", top: 26, left: 22, transform: `rotate(-16deg) scale(${stamp})`, opacity: Math.min(1, stamp), border: `4px solid ${GREEN}`, color: GREEN, borderRadius: 12, padding: "4px 14px", fontSize: 30, fontWeight: 900, letterSpacing: "0.04em", background: "rgba(255,255,255,0.7)" }}>
            LIKE
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
