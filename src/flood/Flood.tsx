// ============================================================
// "412 applications. Or 3 people." — job-board pain, boss-POV.
// post: you post ONE role on a job board.  flood: a torrent of faceless
// applications buries the frame while a counter spins to 412.  gut: it
// freezes — "ZERO you'd hire."  sweep: the pile drops away.  reveal: three
// verified humans fan in under the tal BOSS lockup.  payoff: that SAME
// lockup flies up into the end slate. One global frame drives every scene.
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
  LOGO_REVEAL_TOP, LOGO_REVEAL_H, LOGO_CTA_TOP, LOGO_CTA_H,
} from "./timing";
import { JunkRow, buildJunk } from "./JunkRow";
import { JobPost } from "./JobPost";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true });

const INK = "#141414";
const PURPLE = "#8B4CD8";
const LOGO = "reel/tal-boss-wordmark-dark.png";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const JUNK = buildJunk(ROWS);
// the three humans on the other side of the pile
const THREE = [dismissed[0], hero, dismissed[2]];

export const Flood: React.FC = () => {
  const frame = useCurrentFrame();

  const postStart = SCENES.post.start;
  const floodStart = SCENES.flood.start;
  const floodDur = SCENES.flood.dur;
  const sweepStart = SCENES.sweep.start;
  const revealStart = SCENES.reveal.start;
  const payoffStart = SCENES.payoff.start;
  const ff = frame - floodStart; // local clock for the avalanche

  // ---- the pile ----
  const sweep = interpolate(frame, [sweepStart, sweepStart + f(420)], [0, 1], { ...clampE, easing: Easing.in(Easing.cubic) });

  // ---- counter ----
  const countP = interpolate(ff, [0, floodDur], [0, 1], clampE);
  const count = Math.round(COUNT_TO * Math.pow(countP, 1 / SPAWN_CURVE));
  const counterIn = interpolate(ff, [f(300), f(700)], [0, 1], clampE);
  const counterOut = interpolate(frame, [sweepStart, sweepStart + f(320)], [1, 0], clampE);

  // opening line
  const lineIn = interpolate(ff, [f(60), f(460)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const lineOut = interpolate(ff, [f(2100), f(2600)], [1, 0], clampE);

  // the gut punch
  const gutIn = spring({ frame: Math.max(0, frame - SCENES.gut.start - f(220)), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });
  const gutOut = interpolate(frame, [sweepStart, sweepStart + f(300)], [1, 0], clampE);

  // ---- reveal: three cards fan in ----
  const revealed = frame >= revealStart - f(200);
  const cardSpring = (i: number) =>
    spring({ frame: Math.max(0, frame - revealStart - f(150) * i), fps: FPS, config: { damping: 15, stiffness: 110, mass: 1 } });
  const revealLine = interpolate(frame, [revealStart + f(1250), revealStart + f(1850)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const revealSub = interpolate(frame, [revealStart + f(1900), revealStart + f(2400)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  // reveal content clears out just before the lockup begins its flight
  const revealOut = interpolate(frame, [payoffStart - f(360), payoffStart - f(60)], [1, 0], { ...clampE, easing: Easing.in(Easing.cubic) });

  // ---- the travelling tal BOSS lockup ----
  // appears under the reveal line, then flies up + scales into the end slate.
  // Everything is on white, so this needs no cross-dissolve at all.
  const logoIn = interpolate(frame, [revealStart + f(1600), revealStart + f(2150)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const travel = interpolate(frame, [payoffStart - f(300), payoffStart + f(420)], [0, 1], { ...clampE, easing: Easing.inOut(Easing.cubic) });
  const logoTop = interpolate(travel, [0, 1], [LOGO_REVEAL_TOP, LOGO_CTA_TOP]);
  const logoH = interpolate(travel, [0, 1], [LOGO_REVEAL_H, LOGO_CTA_H]);

  // ---- end slate copy ----
  const tagIn = interpolate(frame, [payoffStart + f(560), payoffStart + f(980)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const badgeIn = interpolate(frame, [payoffStart + f(800), payoffStart + f(1260)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const endFade = interpolate(frame, [TOTAL_FRAMES - f(420), TOTAL_FRAMES - f(90)], [1, 0], clampE);

  return (
    <AbsoluteFill className="r245-stage" style={{ fontFamily: inter.fontFamily, ["--font-anton" as string]: OBVIOUSLY, background: "#fff", overflow: "hidden" }}>
      {/* ---------- scene 0 — posting the job ---------- */}
      {frame < SCENES.post.end && <JobPost local={frame - postStart} dur={SCENES.post.dur} />}

      {/* ---------- the avalanche ---------- */}
      {ff >= -f(200) && frame < sweepStart + f(520) && (
        <AbsoluteFill>
          {JUNK.map((j, i) => {
            // avalanche curve: slow drips → torrent
            const spawn = floodDur * Math.pow((i + j.delayJit) / ROWS, SPAWN_CURVE);
            const fall = interpolate(ff, [spawn, spawn + f(540)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
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

      {/* ---------- "You posted one job." ---------- */}
      {ff >= 0 && (
        <div style={{ position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", zIndex: 300, opacity: lineIn * lineOut }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#6c6c70", letterSpacing: "-0.02em" }}>You posted one job.</div>
        </div>
      )}

      {/* ---------- counter ---------- */}
      {ff >= 0 && frame < sweepStart + f(300) && (
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
                Zero you&rsquo;d hire
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- three humans + the line ---------- */}
      {revealed && frame < payoffStart && (
        <AbsoluteFill style={{ zIndex: 400, opacity: revealOut }}>
          <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <div style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center", opacity: revealLine }}>
            <div style={{ fontFamily: `${OBVIOUSLY}, sans-serif`, fontSize: 62, fontWeight: 700, color: INK, lineHeight: 1, textTransform: "uppercase" }}>
              Or <span style={{ color: PURPLE }}>3 people</span> on
            </div>
          </div>
          <div style={{ position: "absolute", top: 715, left: 0, right: 0, textAlign: "center", padding: "0 70px", opacity: revealSub }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: "#6c6c70", letterSpacing: "-0.015em", lineHeight: 1.3 }}>
              Verified, in Bengaluru, and actually want to build with you.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the travelling tal BOSS lockup ---------- */}
      {frame >= revealStart + f(1500) && (
        <div style={{ position: "absolute", top: logoTop, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 950, opacity: logoIn * endFade }}>
          <Img src={staticFile(LOGO)} style={{ height: logoH, width: "auto", display: "block" }} />
        </div>
      )}

      {/* ---------- end slate copy ---------- */}
      {frame >= payoffStart && (
        <AbsoluteFill style={{ zIndex: 900 }}>
          <div style={{ position: "absolute", top: 535, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 500, color: "#8a8a8a", letterSpacing: "0.01em", opacity: tagIn * endFade }}>
            where Bangalore founders hire directly
          </div>
          <div style={{ position: "absolute", top: 605, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: badgeIn * endFade, transform: `translateY(${(1 - badgeIn) * 16}px)` }}>
            <Img src={staticFile("reel/badges-stores.png")} style={{ width: 560, height: "auto", display: "block" }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
