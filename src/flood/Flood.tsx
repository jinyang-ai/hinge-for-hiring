// ============================================================
// "400 applications. Or 3 people." — job-board pain, boss-POV.
// flood: you post one role → a torrent of faceless applications buries the
// frame while a counter spins to 412.  gut: it freezes — "0 you'd actually
// hire."  sweep: the pile drops away.  reveal: three verified humans fan in.
// payoff: tal CTA slate. One global frame drives every scene.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import "../hinge/hinge.css";
import { OBVIOUSLY } from "../hinge/fonts";
import { CandidateCard } from "../hinge/CandidateCard";
import { hero, dismissed } from "../hinge/data";
import {
  SCENES, TOTAL_FRAMES, FPS, f, REEL_W, REEL_H,
  ROWS, COUNT_TO, ROW_STEP, FALL_FROM, SPAWN_CURVE,
} from "./timing";
import { JunkRow, buildJunk } from "./JunkRow";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true });

const INK = "#141414";
const PURPLE = "#8B4CD8";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const JUNK = buildJunk(ROWS);
// the three humans on the other side of the pile
const THREE = [dismissed[0], hero, dismissed[2]];

export const Flood: React.FC = () => {
  const frame = useCurrentFrame();

  const floodDur = SCENES.flood.dur;
  const sweepStart = SCENES.sweep.start;
  const revealStart = SCENES.reveal.start;
  const payoffStart = SCENES.payoff.start;

  // ---- the pile ----
  const sweep = interpolate(frame, [sweepStart, sweepStart + f(420)], [0, 1], { ...clampE, easing: Easing.in(Easing.cubic) });

  // ---- counter ----
  const countP = interpolate(frame, [0, floodDur], [0, 1], clampE);
  const count = Math.round(COUNT_TO * Math.pow(countP, 1 / SPAWN_CURVE));
  const counterIn = interpolate(frame, [f(240), f(560)], [0, 1], clampE);
  const counterOut = interpolate(frame, [sweepStart, sweepStart + f(260)], [1, 0], clampE);

  // opening line
  const lineIn = interpolate(frame, [f(60), f(420)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const lineOut = interpolate(frame, [f(1500), f(1900)], [1, 0], clampE);

  // the gut punch
  const gutIn = spring({ frame: Math.max(0, frame - SCENES.gut.start - f(120)), fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.8 } });
  const gutOut = interpolate(frame, [sweepStart, sweepStart + f(240)], [1, 0], clampE);

  // ---- reveal: three cards fan in ----
  const revealed = frame >= revealStart - f(200);
  const cardSpring = (i: number) =>
    spring({ frame: Math.max(0, frame - revealStart - f(90) * i), fps: FPS, config: { damping: 14, stiffness: 130, mass: 0.9 } });
  const revealLine = interpolate(frame, [revealStart + f(900), revealStart + f(1400)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });

  // ---- payoff CTA slate ----
  // starts exactly at payoffStart (never earlier) so the three-card reveal and
  // its "Or 3 people." line get a clean, unwashed read first.
  const ctaIn = interpolate(frame, [payoffStart, payoffStart + f(320)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const ctaPop = spring({ frame: Math.max(0, frame - payoffStart), fps: FPS, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const tagIn = interpolate(frame, [payoffStart + f(220), payoffStart + f(560)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const badgeIn = interpolate(frame, [payoffStart + f(380), payoffStart + f(760)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const endFade = interpolate(frame, [TOTAL_FRAMES - f(360), TOTAL_FRAMES - f(80)], [1, 0], clampE);

  return (
    <AbsoluteFill className="r245-stage" style={{ fontFamily: inter.fontFamily, ["--font-anton" as string]: OBVIOUSLY, background: "#fff", overflow: "hidden" }}>
      {/* ---------- the avalanche ---------- */}
      {frame < sweepStart + f(520) && (
        <AbsoluteFill>
          {JUNK.map((j, i) => {
            // avalanche curve: slow drips → torrent
            const spawn = floodDur * Math.pow((i + j.delayJit) / ROWS, SPAWN_CURVE);
            const fall = interpolate(frame, [spawn, spawn + f(430)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
            if (fall <= 0) return null;
            // pile builds upward from the bottom of the frame
            const restY = REEL_H - 96 - i * ROW_STEP;
            const y = FALL_FROM + (restY - FALL_FROM) * fall + sweep * (REEL_H + 420);
            const rot = j.rot * fall + sweep * j.rot * 2.2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: `translate(calc(-50% + ${j.x}px), ${y}px) rotate(${rot}deg)`,
                  opacity: Math.min(1, fall * 2.2) * (1 - sweep),
                  zIndex: 10 + i,
                }}
              >
                <JunkRow j={j} />
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* ---------- opening line ---------- */}
      <div
        style={{
          position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", zIndex: 300,
          opacity: lineIn * lineOut,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600, color: "#6c6c70", letterSpacing: "-0.02em" }}>You posted one job.</div>
      </div>

      {/* ---------- counter ---------- */}
      {frame < sweepStart + f(300) && (
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: REEL_H,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 320, opacity: counterIn * counterOut, pointerEvents: "none",
          }}
        >
          <div style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.97) 60%, rgba(255,255,255,0) 100%)", padding: "60px 90px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: `${OBVIOUSLY}, sans-serif`, fontSize: 168, fontWeight: 700, color: INK, lineHeight: 0.9, letterSpacing: "-0.01em" }}>
              {count}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#8e8e97", marginTop: 10, letterSpacing: "-0.01em" }}>applications</div>

            {/* the gut punch */}
            <div style={{ marginTop: 26, opacity: gutIn * gutOut, transform: `scale(${0.8 + 0.2 * gutIn})` }}>
              <div style={{ fontFamily: `${OBVIOUSLY}, sans-serif`, fontSize: 54, fontWeight: 700, color: PURPLE, lineHeight: 1, textTransform: "uppercase" }}>
                0 you&rsquo;d hire
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- three humans ---------- */}
      {revealed && frame < payoffStart + f(300) && (
        <AbsoluteFill style={{ zIndex: 400, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ position: "relative", width: REEL_W, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {THREE.map((c, i) => {
              const s = cardSpring(i);
              const spread = [-186, 0, 186][i];
              const tilt = [-9, 0, 9][i];
              const lift = [16, -12, 16][i];
              return (
                <div
                  key={c.id}
                  style={{
                    position: "absolute",
                    transform: `translate(${spread * s}px, ${lift * s + (1 - s) * 120}px) rotate(${tilt * s}deg) scale(${0.66 * (0.86 + 0.14 * s)})`,
                    opacity: s,
                    zIndex: i === 1 ? 20 : 10,
                    filter: "drop-shadow(0 18px 38px rgba(20,28,48,0.20))",
                  }}
                >
                  <CandidateCard c={c} />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 44, textAlign: "center", opacity: revealLine, padding: "0 70px" }}>
            <div style={{ fontFamily: `${OBVIOUSLY}, sans-serif`, fontSize: 62, fontWeight: 700, color: INK, lineHeight: 1, textTransform: "uppercase" }}>
              Or <span style={{ color: PURPLE }}>3 people.</span>
            </div>
            <div style={{ fontSize: 27, fontWeight: 500, color: "#6c6c70", marginTop: 16, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
              Verified, in Bengaluru, and actually want to build with you.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- CTA slate ---------- */}
      {frame >= payoffStart && (
        <AbsoluteFill style={{ background: "#fff", opacity: ctaIn, zIndex: 900, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <Img src={staticFile("reel/tal-logo.png")} style={{ width: 300, height: "auto", display: "block", opacity: endFade, transform: `scale(${0.9 + 0.1 * Math.min(ctaPop, 1.05)})`, marginBottom: 26 }} />
          <div style={{ fontSize: 22, fontWeight: 500, color: "#8a8a8a", letterSpacing: "0.01em", opacity: tagIn * endFade, marginBottom: 48 }}>
            where Bangalore founders hire directly
          </div>
          <Img src={staticFile("reel/badges-stores.png")} style={{ width: 560, height: "auto", display: "block", opacity: badgeIn * endFade, transform: `translateY(${(1 - badgeIn) * 16}px)` }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
