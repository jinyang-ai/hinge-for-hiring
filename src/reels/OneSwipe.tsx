// ============================================================
// "Six emails, or one swipe." - the Meet loop.
// Claim: booking the interview is one gesture, not four days of email.
// thread: a Gmail scheduling thread stacks up while a day counter climbs →
// swipe: the tal BOSS sheet, picked and sent → payoff: 9 seconds → slate.
// ============================================================
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, clampE, PURPLE, MUTED } from "../shared/kit";
import { MeetSheet } from "../notlooking/MeetSheet";
import { GmailThread } from "./GmailThread";

const MS = { thread: 6400, swipe: 4600, payoff: 2400, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["thread", "swipe", "payoff", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

export const OneSwipe: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- thread ----
  const tl = frame - S.thread.start;
  const mailAt = (i: number) => fr(520) + i * fr(830);
  const days = Math.min(4, Math.floor(interpolate(tl, [fr(520), fr(5200)], [0, 4.99], clampE)));
  const counterIn = lerp(tl, [fr(1200), fr(1650)], [0, 1]);
  const threadOut = lerp(frame, [S.thread.end - fr(320), S.thread.end], [1, 0]);

  // ---- payoff ----
  const pl = frame - S.payoff.start;
  const pIn = spring({ frame: Math.max(0, pl), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  return (
    <Stage>
      {/* ---------- the Gmail thread ---------- */}
      {frame < S.swipe.start && (
        <AbsoluteFill style={{ opacity: threadOut }}>
          <GmailThread local={tl} at={mailAt} />
          {/* days elapsed - overlaid on the thread */}
          <div
            style={{
              position: "absolute",
              right: 46,
              bottom: 128,
              textAlign: "right",
              opacity: counterIn,
              transform: `translateY(${(1 - counterIn) * 12}px)`,
            }}
          >
            <div style={{ ...disp(104, { color: PURPLE, textAlign: "right" }), fontVariantNumeric: "tabular-nums" }}>{days}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: MUTED, marginTop: 2, letterSpacing: "-0.01em" }}>days. still no call.</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the tal BOSS sheet ---------- */}
      {frame >= S.swipe.start && frame < S.payoff.start && (
        <AbsoluteFill>
          <MeetSheet local={frame - S.swipe.start} f={fr} />
        </AbsoluteFill>
      )}

      {/* ---------- payoff ---------- */}
      {frame >= S.payoff.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: "0 56px" }}>
          <div style={{ ...disp(116, { color: PURPLE }), opacity: pIn, transform: `scale(${0.82 + 0.18 * pIn})` }}>9 seconds</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: MUTED, opacity: lerp(pl, [fr(440), fr(800)], [0, 1]), textAlign: "center", letterSpacing: "-0.015em" }}>
            Same call. One swipe.
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- slate ---------- */}
      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
