// ============================================================
// "Cold to calendar in 41 seconds." — the whole loop, end to end, in the
// real app UI: the deck with its ✕ / Request resume / Reply bar, the profile,
// the chat, the Pick a time sheet. A timer runs in the corner the whole way
// and then flies to the centre to become the headline number.
// The timer is the boss's elapsed in-app time — the reel is a compressed
// dramatisation of a real flow, not a real-time recording.
// ============================================================
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, clampE, PURPLE, GREEN, MUTED } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { CandidateCard } from "../hinge/CandidateCard";
import { Profile } from "../hinge/Profile";
import { MeetSheet } from "../notlooking/MeetSheet";
import { hero, dismissed, type Candidate } from "../hinge/data";

const MS = { open: 2000, swipe: 1900, read: 3100, resume: 4000, meet: 4600, done: 2900, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["open", "swipe", "read", "resume", "meet", "done", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const HERO: Candidate = { ...hero, intent: "Open to meet · this week" };
const FIRST = dismissed[0];
const CARD_SCALE = 1.24;

// timer geometry — fixed width so the corner→centre flight is deterministic
const CHIP_W = 138;
const CORNER_L = 720 - 26 - CHIP_W;
const END_SCALE = 2.1;
const CENTRE_L = (720 - CHIP_W * END_SCALE) / 2;

const CHAT: Msg[] = [
  { side: "out", at: fr(700), text: "📋 You requested Sanchit's resume", time: "11:36 PM" },
  { side: "in", at: fr(1700), typingUntil: fr(2500), resume: true, text: "Here's my resume 🙌", time: "11:46 PM" },
];

export const SpeedRun: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- the timer ----
  const secs = Math.min(41, Math.round(interpolate(frame, [fr(400), S.meet.end], [0, 41], clampE)));
  const timerIn = lerp(frame, [fr(200), fr(560)], [0, 1]);
  // flight to centre during the closing beat
  const fly = lerp(frame, [S.done.start + fr(150), S.done.start + fr(1050)], [0, 1]);
  const tLeft = interpolate(fly, [0, 1], [CORNER_L, CENTRE_L]);
  const tTop = interpolate(fly, [0, 1], [26, 418]);
  const tScale = interpolate(fly, [0, 1], [1, END_SCALE]);

  // ---- deck ----
  const deckIn = spring({ frame: Math.max(0, frame - fr(200)), fps: FPS, config: { damping: 16, stiffness: 120, mass: 1 } });
  const wl = frame - S.swipe.start;
  const xPress = wl > fr(260) && wl < fr(460) ? 0.9 : 1;
  const flyOff = lerp(wl, [fr(420), fr(1150)], [0, 1]);

  // ---- profile ----
  const rl = frame - S.read.start;
  const scroll = lerp(rl, [fr(250), fr(2100)], [0, 800]);
  const resumePress = rl > fr(2400) && rl < fr(2650) ? 0.93 : 1;
  const barFade = lerp(rl, [fr(2650), fr(2950)], [1, 0]);

  // ---- closing headline ----
  const dl = frame - S.done.start;
  const l1 = lerp(dl, [fr(900), fr(1300)], [0, 1]);
  const l2 = lerp(dl, [fr(1100), fr(1500)], [0, 1]);
  const sub = lerp(dl, [fr(1700), fr(2100)], [0, 1]);

  return (
    <Stage>
      {/* ---------- the deck, with the real action bar ---------- */}
      {frame < S.read.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", transform: `scale(${CARD_SCALE}) translateY(${(1 - deckIn) * 70}px)`, opacity: deckIn }}>
            <CandidateCard c={HERO} />
            <ActionBar />
          </div>
          {flyOff < 1 && (
            <div
              style={{
                position: "absolute",
                transform: `scale(${CARD_SCALE}) translate(${-flyOff * 940}px, ${flyOff * 44}px) rotate(${-flyOff * 16}deg) translateY(${(1 - deckIn) * 70}px)`,
                opacity: deckIn * (1 - Math.max(0, (flyOff - 0.82) / 0.18)),
              }}
            >
              <div style={{ position: "relative" }}>
                <CandidateCard c={FIRST} />
                <ActionBar xPress={xPress} />
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- the profile, scrolling to the work ---------- */}
      {frame >= S.read.start && frame < S.resume.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ position: "relative", transform: "scale(1.83)", transformOrigin: "top center" }}>
            <Profile c={HERO} scroll={scroll} radius={0} />
            <ActionBar resumePress={resumePress} opacity={barFade} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the chat: request → resume ---------- */}
      {frame >= S.resume.start && frame < S.meet.start && (
        <AbsoluteFill>
          <TalChat lf={frame - S.resume.start} msgs={CHAT} />
        </AbsoluteFill>
      )}

      {/* ---------- pick a time → send ---------- */}
      {frame >= S.meet.start && frame < S.done.start && (
        <AbsoluteFill>
          <MeetSheet local={frame - S.meet.start} f={fr} />
        </AbsoluteFill>
      )}

      {/* ---------- the headline forms around the timer ---------- */}
      {frame >= S.done.start && frame < S.slate.start && (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 288, left: 0, right: 0, opacity: l1 }}>
            <div style={disp(58)}>Cold to calendar</div>
          </div>
          <div style={{ position: "absolute", top: 568, left: 0, right: 0, opacity: l2 }}>
            <div style={disp(58, { color: PURPLE })}>seconds.</div>
          </div>
          <div style={{ position: "absolute", top: 674, left: 0, right: 0, textAlign: "center", fontSize: 26, fontWeight: 500, color: MUTED, opacity: sub, padding: "0 60px" }}>
            No recruiter. No job post. No inbox.
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the timer, over everything ---------- */}
      {frame < S.slate.start && (
        <div
          style={{
            position: "absolute",
            left: tLeft,
            top: tTop,
            width: CHIP_W,
            zIndex: 990,
            background: secs >= 41 ? GREEN : "#1f1f22",
            color: "#fff",
            borderRadius: 999,
            padding: "10px 0",
            textAlign: "center",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontVariantNumeric: "tabular-nums",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "0.02em",
            opacity: timerIn,
            transform: `scale(${tScale})`,
            transformOrigin: "top left",
            boxShadow: "0 10px 26px -12px rgba(20,28,48,0.5)",
          }}
        >
          0:{String(secs).padStart(2, "0")}
        </div>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
