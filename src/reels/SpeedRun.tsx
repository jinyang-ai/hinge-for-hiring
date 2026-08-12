// ============================================================
// "Cold to calendar in 41 seconds." — the whole loop, end to end.
// Claim: you can start hiring someone in under a minute.
// A timer burns in the corner while the boss swipes → reads the work →
// requests the resume → picks a time → sends a Google Meet. The timer is
// the boss's elapsed in-app time (the reel is a compressed dramatisation
// of a real flow, not a real-time recording).
// ============================================================
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, Img, staticFile } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, clampE, INK, PURPLE, GREEN, MUTED } from "../shared/kit";
import { CandidateCard } from "../hinge/CandidateCard";
import { Profile } from "../hinge/Profile";
import { MeetSheet } from "../notlooking/MeetSheet";
import { hero, dismissed, type Candidate } from "../hinge/data";

const MS = { open: 1500, swipe: 1700, read: 2400, resume: 2300, meet: 3600, done: 1700, slate: 2100 };
const ORDER: (keyof typeof MS)[] = ["open", "swipe", "read", "resume", "meet", "done", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const HERO: Candidate = { ...hero, intent: "Open to meet · this week" };
const FIRST = dismissed[0];

// the timer runs from 0 to 41 across the action, freezing on the send
const TIMER_END = S.meet.end;

export const SpeedRun: React.FC = () => {
  const frame = useCurrentFrame();
  const secs = Math.min(41, Math.round(interpolate(frame, [fr(300), TIMER_END], [0, 41], clampE)));
  const mm = `0:${String(secs).padStart(2, "0")}`;
  const showTimer = frame < S.done.start + fr(900);
  const timerIn = lerp(frame, [fr(160), fr(460)], [0, 1]);
  const timerPop = spring({ frame: Math.max(0, frame - S.meet.end + fr(120)), fps: FPS, config: { damping: 11, stiffness: 200, mass: 0.7 } });

  // ---- open: the deck ----
  const ol = frame;
  const deckIn = spring({ frame: Math.max(0, ol - fr(120)), fps: FPS, config: { damping: 16, stiffness: 130, mass: 0.9 } });

  // ---- swipe: first card flicks away ----
  const wl = frame - S.swipe.start;
  const fly = lerp(wl, [fr(240), fr(760)], [0, 1]);

  // ---- read: profile scrolls to the work ----
  const rl = frame - S.read.start;
  const scroll = lerp(rl, [fr(120), fr(1500)], [0, 780]);
  const pressResume = frame >= S.resume.start - fr(200) && frame < S.resume.start + fr(200);

  // ---- resume: chat ----
  const ql = frame - S.resume.start;
  const askIn = spring({ frame: Math.max(0, ql - fr(180)), fps: FPS, config: { damping: 16, stiffness: 170, mass: 0.8 } });
  const gotIn = spring({ frame: Math.max(0, ql - fr(1150)), fps: FPS, config: { damping: 16, stiffness: 170, mass: 0.8 } });

  // ---- done ----
  const dl = frame - S.done.start;
  const dIn = spring({ frame: Math.max(0, dl), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  return (
    <Stage>
      {/* ---------- deck + swipe ---------- */}
      {frame < S.read.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {/* hero sits behind */}
          <div style={{ position: "absolute", transform: `scale(${1.22 * (0.95 + 0.05 * deckIn)}) translateY(${(1 - deckIn) * 70}px)`, opacity: deckIn }}>
            <CandidateCard c={HERO} />
          </div>
          {/* the first card flicks off */}
          {fly < 1 && (
            <div
              style={{
                position: "absolute",
                transform: `scale(1.22) translate(${-fly * 980}px, ${fly * 44}px) rotate(${-fly * 17}deg) translateY(${(1 - deckIn) * 70}px)`,
                opacity: deckIn * (1 - Math.max(0, (fly - 0.8) / 0.2)),
              }}
            >
              <CandidateCard c={FIRST} />
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- read the work ---------- */}
      {frame >= S.read.start && frame < S.resume.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ transform: "scale(1.83)", transformOrigin: "top center", marginTop: 0 }}>
            <Profile c={HERO} scroll={scroll} replyPress={pressResume ? 0.94 : 1} radius={0} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- resume arrives ---------- */}
      {frame >= S.resume.start && frame < S.meet.start && (
        <AbsoluteFill style={{ padding: "120px 44px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <Img src={staticFile("reel/sanchit-face.jpg")} style={{ width: 52, height: 52, borderRadius: 999, objectFit: "cover" }} />
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, color: INK }}>Sanchit Tripathi</div>
              <div style={{ fontSize: 15, color: MUTED }}>Software Engineer · Bengaluru</div>
            </div>
          </div>
          {/* the request */}
          <div style={{ alignSelf: "flex-end", maxWidth: "78%", marginLeft: "auto", background: "#262220", color: "#F5EFE7", borderRadius: "18px 18px 4px 18px", padding: "15px 18px", fontSize: 17, opacity: askIn, transform: `translateY(${(1 - askIn) * 16}px)` }}>
            📋 You requested Sanchit’s resume
          </div>
          {/* the resume */}
          <div style={{ maxWidth: "82%", marginTop: 18, background: "#F0EDE9", color: "#262220", borderRadius: "18px 18px 18px 4px", padding: "15px 18px", opacity: gotIn, transform: `translateY(${(1 - gotIn) * 16}px)` }}>
            <div style={{ fontSize: 17, marginBottom: 12 }}>Here’s my resume 🙌</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid #e6e2de" }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: "#e8443a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>PDF</div>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: INK }}>Sanchit_Resume.pdf</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- pick a time + send ---------- */}
      {frame >= S.meet.start && frame < S.done.start && (
        <AbsoluteFill>
          <MeetSheet local={frame - S.meet.start} f={fr} />
        </AbsoluteFill>
      )}

      {/* ---------- the claim ---------- */}
      {frame >= S.done.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: "0 54px" }}>
          <div style={{ ...disp(64), opacity: dIn, transform: `translateY(${(1 - dIn) * 18}px)` }}>
            Cold to calendar
          </div>
          <div style={{ ...disp(64, { color: PURPLE }), opacity: dIn }}>in 41 seconds.</div>
          <div style={{ fontSize: 26, fontWeight: 500, color: MUTED, opacity: lerp(dl, [fr(520), fr(880)], [0, 1]), textAlign: "center", marginTop: 6 }}>
            No recruiter. No job post. No inbox.
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the timer, over everything ---------- */}
      {showTimer && (
        <div
          style={{
            position: "absolute",
            top: 26,
            right: 26,
            zIndex: 990,
            background: secs >= 41 ? GREEN : "#1f1f22",
            color: "#fff",
            borderRadius: 999,
            padding: "10px 20px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontVariantNumeric: "tabular-nums",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.02em",
            opacity: timerIn,
            transform: `scale(${1 + 0.12 * Math.min(timerPop, 1)})`,
            boxShadow: "0 8px 22px -10px rgba(20,28,48,0.5)",
          }}
        >
          {mm}
        </div>
      )}

      {/* ---------- slate ---------- */}
      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
