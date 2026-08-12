// ============================================================
// "Not looking. But open." — passive-talent reel, boss-POV.
// premise → closed (grey + NOT LOOKING) → wall of no → ★ the flip →
// the wave → Pick a time / SWIPE TO INVITE → end slate.
// One global frame drives every scene; each beat reads its own local clock.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import "../hinge/hinge.css";
import { OBVIOUSLY } from "../hinge/fonts";
import { CandidateCard } from "../hinge/CandidateCard";
import { hero, dismissed, type Candidate } from "../hinge/data";
import { SCENES, TOTAL_FRAMES, FPS, f, REEL_W, REEL_H, CARD_SCALE, LOGO_END_TOP, LOGO_END_H } from "./timing";
import { FlipCard, Stamp } from "./FlipCard";
import { MeetSheet } from "./MeetSheet";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true });

const INK = "#141414";
const PURPLE = "#8B4CD8";
const LOGO = "reel/tal-boss-wordmark-dark.png";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// the same person, two faces
const CLOSED: Candidate = { ...hero, intent: "Not open to offers" };
const OPEN: Candidate = { ...hero, intent: "Open to meet · this week" };

// the wall of no — two more who will never apply
const REFUSERS: { c: Candidate; stamp: string }[] = [
  { c: { ...dismissed[0], intent: "Not on any job board" }, stamp: "No job board" },
  { c: { ...dismissed[2], intent: "Ignores recruiters" }, stamp: "Ignores recruiters" },
];

// beat 05 — twelve faces, flipping grey → open in a diagonal wave
const WAVE_FACES = [
  "reel/person1.jpg", "reel/person2.jpg", "reel/person3.jpg", "reel/sanchit-face.jpg",
  "reel/person3.jpg", "reel/sanchit-face.jpg", "reel/person1.jpg", "reel/person2.jpg",
  "reel/person2.jpg", "reel/person1.jpg", "reel/sanchit-face.jpg", "reel/person3.jpg",
];

export const NotLooking: React.FC = () => {
  const frame = useCurrentFrame();

  const S = SCENES;
  const disp = (size: number): React.CSSProperties => ({
    fontFamily: `${OBVIOUSLY}, sans-serif`,
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: size,
    lineHeight: 0.98,
    letterSpacing: "-0.01em",
    color: INK,
    textAlign: "center",
  });

  // ---------- 01 premise ----------
  const l1 = spring({ frame: Math.max(0, frame - f(120)), fps: FPS, config: { damping: 15, stiffness: 170, mass: 0.8 } });
  const l2 = spring({ frame: Math.max(0, frame - f(360)), fps: FPS, config: { damping: 15, stiffness: 170, mass: 0.8 } });
  const premiseOut = interpolate(frame, [S.premise.end - f(260), S.premise.end], [1, 0], clampE);

  // ---------- 02 closed ----------
  const cl = frame - S.closed.start;
  const cardRise = spring({ frame: Math.max(0, cl), fps: FPS, config: { damping: 16, stiffness: 120, mass: 1 } });
  const stampIn = spring({ frame: Math.max(0, cl - f(900)), fps: FPS, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  const capIn = interpolate(cl, [f(1250), f(1650)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });

  // ---------- 03 wall ----------
  const wl = frame - S.wall.start;
  const refuser = (i: number) => {
    const at = f(120) + i * f(680);
    const s = spring({ frame: Math.max(0, wl - at), fps: FPS, config: { damping: 15, stiffness: 160, mass: 0.8 } });
    const out = interpolate(wl, [at + f(560), at + f(760)], [0, 1], clampE);
    return { s, out };
  };

  // ---------- 04 the flip ----------
  const fl = frame - S.flip.start;
  // stamp tears away just before the turn
  const stampDrop = interpolate(fl, [f(280), f(620)], [0, 620], { ...clampE, easing: Easing.in(Easing.cubic) });
  const stampGone = interpolate(fl, [f(280), f(560)], [1, 0], clampE);
  const turn = interpolate(fl, [f(520), f(1240)], [0, 180], { ...clampE, easing: Easing.inOut(Easing.cubic) });
  const openLine = interpolate(fl, [f(1280), f(1620)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const flipOut = interpolate(frame, [S.flip.end - f(240), S.flip.end], [1, 0], clampE);

  // ---------- 05 the wave ----------
  const vl = frame - S.wave.start;
  const waveIn = spring({ frame: Math.max(0, vl), fps: FPS, config: { damping: 16, stiffness: 120, mass: 1 } });
  const waveLine = interpolate(vl, [f(1050), f(1450)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const waveOut = interpolate(frame, [S.wave.end - f(240), S.wave.end], [1, 0], clampE);

  // ---------- 07 end ----------
  const el = frame - S.end.start;
  const endLine = spring({ frame: Math.max(0, el - f(60)), fps: FPS, config: { damping: 15, stiffness: 150, mass: 0.9 } });
  const endLineOut = interpolate(el, [f(760), f(1000)], [1, 0], clampE);
  const logoIn = interpolate(el, [f(860), f(1180)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  const tagIn = interpolate(el, [f(1250), f(1520)], [0, 1], clampE);
  const endFade = interpolate(frame, [TOTAL_FRAMES - f(300), TOTAL_FRAMES - f(60)], [1, 0], clampE);

  const centred: React.CSSProperties = { alignItems: "center", justifyContent: "center" };

  return (
    <AbsoluteFill className="r245-stage" style={{ fontFamily: inter.fontFamily, ["--font-anton" as string]: OBVIOUSLY, background: "#fff", overflow: "hidden" }}>

      {/* ---------- 01 premise ---------- */}
      {frame < S.premise.end && (
        <AbsoluteFill style={{ ...centred, flexDirection: "column", gap: 6, opacity: premiseOut, padding: "0 56px" }}>
          <div style={{ ...disp(72), opacity: l1, transform: `translateY(${(1 - l1) * 26}px)` }}>Your best hire</div>
          <div style={{ ...disp(72), opacity: l2, transform: `translateY(${(1 - l2) * 26}px)` }}>
            will <span style={{ color: PURPLE }}>never apply.</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- 02 closed ---------- */}
      {frame >= S.closed.start && frame < S.wall.start && (
        <AbsoluteFill style={{ ...centred, flexDirection: "column" }}>
          <div style={{ transform: `scale(${CARD_SCALE}) translateY(${(1 - cardRise) * 90}px)`, opacity: cardRise, position: "relative" }}>
            <div style={{ filter: "grayscale(1) contrast(0.9) brightness(1.06)" }}>
              <CandidateCard c={CLOSED} />
            </div>
            {stampIn > 0.01 && <Stamp text="Not looking" scale={Math.min(stampIn, 1.06)} opacity={Math.min(1, stampIn * 1.6)} />}
          </div>
          <div style={{ position: "absolute", bottom: 78, left: 0, right: 0, textAlign: "center", opacity: capIn, fontSize: 25, fontWeight: 500, color: "#6c6c70", letterSpacing: "-0.015em" }}>
            Last opened a job board in 2021.
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- 03 wall of no ---------- */}
      {frame >= S.wall.start && frame < S.flip.start && (
        <AbsoluteFill style={centred}>
          {REFUSERS.map((r, i) => {
            const { s, out } = refuser(i);
            if (s <= 0.001 || out >= 1) return null;
            return (
              <div
                key={r.c.id}
                style={{
                  position: "absolute",
                  transform: `scale(${CARD_SCALE * (0.92 + 0.08 * s)}) translateX(${(1 - s) * 260 - out * 900}px) rotate(${(1 - s) * 8 + out * 16}deg)`,
                  opacity: s * (1 - out),
                }}
              >
                <div style={{ filter: "grayscale(1) contrast(0.9) brightness(1.06)" }}>
                  <CandidateCard c={r.c} />
                </div>
                <Stamp text={r.stamp} scale={0.82} rot={i % 2 ? 10 : -11} opacity={Math.min(1, s * 1.7)} />
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* ---------- 04 THE FLIP ---------- */}
      {frame >= S.flip.start && frame < S.wave.start && (
        <AbsoluteFill style={{ ...centred, flexDirection: "column", opacity: flipOut }}>
          <div style={{ transform: `scale(${CARD_SCALE})` }}>
            <FlipCard closed={CLOSED} open={OPEN} turn={turn} stampText="Not looking" stampOpacity={stampGone} stampDrop={stampDrop} />
          </div>
          <div style={{ position: "absolute", bottom: 72, left: 0, right: 0, opacity: openLine, transform: `translateY(${(1 - openLine) * 16}px)` }}>
            <div style={disp(76)}>
              But <span style={{ color: PURPLE }}>open.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- 05 the wave ---------- */}
      {frame >= S.wave.start && frame < S.meet.start && (
        <AbsoluteFill style={{ ...centred, flexDirection: "column", opacity: waveOut, padding: "0 54px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, width: "100%", opacity: waveIn, transform: `scale(${0.94 + 0.06 * waveIn})` }}>
            {WAVE_FACES.map((src, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const at = f(240) + (col + row) * f(95); // diagonal stagger
              const t = interpolate(vl, [at, at + f(420)], [0, 180], { ...clampE, easing: Easing.inOut(Easing.cubic) });
              const open = t > 90;
              return (
                <div key={i} style={{ perspective: 700 }}>
                  <div style={{ position: "relative", aspectRatio: "3 / 4", transformStyle: "preserve-3d", transform: `rotateY(${t}deg)` }}>
                    {/* closed */}
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 12, overflow: "hidden", border: "1px solid #e6e2de", background: "#fff" }}>
                      <Img src={staticFile(src)} style={{ width: "100%", height: "72%", objectFit: "cover", display: "block", filter: "grayscale(1) brightness(1.08)" }} />
                      <div style={{ padding: "7px 8px" }}>
                        <div style={{ height: 7, borderRadius: 99, background: "#d8d3ce" }} />
                        <div style={{ height: 5, borderRadius: 99, background: "#e6e2de", marginTop: 5, width: "70%" }} />
                      </div>
                    </div>
                    {/* open */}
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 12, overflow: "hidden", border: `1px solid rgba(19,191,105,0.4)`, background: "#fff", boxShadow: open ? "0 8px 20px -10px rgba(19,191,105,0.55)" : "none" }}>
                      <Img src={staticFile(src)} style={{ width: "100%", height: "72%", objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "7px 8px", display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: 99, background: "#13bf69", flex: "0 0 auto" }} />
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#0f9d58" }}>Open to meet</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 40, opacity: waveLine }}>
            <div style={disp(54)}>
              Not looking. <span style={{ color: PURPLE }}>All open.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- 06 pick a time → swipe to invite ---------- */}
      {frame >= S.meet.start && frame < S.end.start && (
        <AbsoluteFill>
          <MeetSheet local={frame - S.meet.start} f={f} />
        </AbsoluteFill>
      )}

      {/* ---------- 07 end ---------- */}
      {frame >= S.end.start && (
        <AbsoluteFill style={{ background: "#fff" }}>
          <div style={{ position: "absolute", top: 330, left: 0, right: 0, padding: "0 56px", opacity: endLine * endLineOut, transform: `translateY(${(1 - endLine) * 20}px)` }}>
            <div style={disp(58)}>They were never going to apply.</div>
            <div style={{ ...disp(58), marginTop: 16 }}>
              So <span style={{ color: PURPLE }}>stop waiting.</span>
            </div>
          </div>
          <div style={{ position: "absolute", top: LOGO_END_TOP, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logoIn * endFade }}>
            <Img src={staticFile(LOGO)} style={{ height: LOGO_END_H, width: "auto", display: "block" }} />
          </div>
          <div style={{ position: "absolute", top: 545, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 500, color: "#8a8a8a", opacity: tagIn * endFade }}>
            where Bangalore founders hire directly
          </div>
          <div style={{ position: "absolute", top: 615, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: tagIn * endFade }}>
            <Img src={staticFile("reel/badges-stores.png")} style={{ width: 560, height: "auto", display: "block" }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
