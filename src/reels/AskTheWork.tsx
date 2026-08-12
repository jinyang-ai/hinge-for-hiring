// ============================================================
// "Ask about the work. They answer." — the Talk loop.
// Claim: on tal BOSS the first message is already a real conversation, which
// is exactly why it gets answered.
// Opens straight on the product — the candidate's own "what am I working on"
// prompt — rather than on a screen of recruiter spam. The contrast with
// "are you open to opportunities?" is carried by one line at the end, which
// lands harder than three grey boxes and keeps the reel inside the app.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, PURPLE, MUTED } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { Profile } from "../hinge/Profile";
import { hero, type Candidate } from "../hinge/data";

const MS = { prompt: 4800, chat: 6200, stamp: 1900, line: 2800, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["prompt", "chat", "stamp", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const HERO: Candidate = { ...hero, intent: "Open to meet · this week" };

const CHAT: Msg[] = [
  { side: "out", at: fr(600), text: "How did you get payouts under 100ms on UPI rails? We're at 400 with 9 people.", time: "9:12 PM" },
  { side: "in", at: fr(2200), typingUntil: fr(3400), text: "Sharded the ledger and moved settlement async — the payout path never touches the DB.", time: "9:23 PM" },
];

export const AskTheWork: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- the profile's own prompt ----
  const pl = frame;
  const scroll = lerp(pl, [fr(400), fr(2700)], [0, 800]);
  const replyPress = pl > fr(3100) && pl < fr(3400) ? 0.93 : 1;
  const barFade = lerp(pl, [fr(3400), fr(3700)], [1, 0]);

  const kl = frame - S.stamp.start;
  const stampIn = spring({ frame: Math.max(0, kl - fr(150)), fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.85 } });

  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });
  const lIn2 = spring({ frame: Math.max(0, ll - fr(300)), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });
  const subIn = lerp(ll, [fr(1050), fr(1450)], [0, 1]);

  return (
    <Stage>
      {/* ---------- the candidate's own prompt, in the app ---------- */}
      {frame < S.chat.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ position: "relative", transform: "scale(1.83)", transformOrigin: "top center" }}>
            <Profile c={HERO} scroll={scroll} replyPress={replyPress} radius={0} />
            <ActionBar opacity={barFade} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the conversation ---------- */}
      {frame >= S.chat.start && frame < S.line.start && (
        <AbsoluteFill>
          <TalChat lf={frame - S.chat.start} msgs={CHAT} />
          {frame >= S.stamp.start && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center", opacity: stampIn, transform: `scale(${0.86 + 0.14 * stampIn})` }}>
              <div style={{ background: "#fff", borderRadius: 999, padding: "13px 28px", boxShadow: "0 10px 26px -12px rgba(20,28,48,0.4)", border: "1px solid #eee" }}>
                <div style={disp(34, { color: PURPLE })}>Answered in 11 minutes</div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 54px" }}>
          <div style={{ ...disp(64), opacity: lIn, transform: `translateY(${(1 - lIn) * 18}px)` }}>Ask about the work.</div>
          <div style={{ ...disp(64, { color: PURPLE }), marginTop: 16, opacity: lIn2, transform: `translateY(${(1 - lIn2) * 18}px)` }}>They answer.</div>
          <div style={{ marginTop: 34, fontSize: 25, fontWeight: 500, color: MUTED, textAlign: "center", opacity: subIn, letterSpacing: "-0.015em", lineHeight: 1.35 }}>
            Not &ldquo;Hi, are you open to opportunities?&rdquo;
          </div>
        </AbsoluteFill>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
