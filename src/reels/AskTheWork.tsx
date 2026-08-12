// ============================================================
// "Ask about the work. They answer." — the Talk loop.
// Claim: the first message is already a real conversation, which is exactly
// why it gets answered. Recruiter templates rot unread; a founder replying to
// the candidate's own "what am I working on" prompt gets an answer in minutes.
// Shot in the real app UI — the profile's work segment and the tal BOSS chat.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, PURPLE, MUTED } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { Profile } from "../hinge/Profile";
import { hero, type Candidate } from "../hinge/data";

const MS = { spam: 3200, prompt: 4400, chat: 6000, stamp: 1900, line: 2200, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["spam", "prompt", "chat", "stamp", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const HERO: Candidate = { ...hero, intent: "Open to meet · this week" };

const SPAM = [
  { from: "Talent Acquisition", txt: "Hi, are you open to opportunities?", ago: "3 weeks ago" },
  { from: "Senior Recruiter", txt: "Exciting role with a market leader!", ago: "2 weeks ago" },
  { from: "Hiring Partner", txt: "Quick chat about your profile?", ago: "6 days ago" },
];

const CHAT: Msg[] = [
  { side: "out", at: fr(500), text: "How did you get payouts under 100ms on UPI rails? We're at 400 with 9 people.", time: "9:12 PM" },
  { side: "in", at: fr(2000), typingUntil: fr(3100), text: "Sharded the ledger and moved settlement async — the payout path never touches the DB.", time: "9:23 PM" },
];

export const AskTheWork: React.FC = () => {
  const frame = useCurrentFrame();

  const sl = frame;
  const headIn = lerp(sl, [fr(150), fr(560)], [0, 1]);
  const spamOut = lerp(frame, [S.spam.end - fr(400), S.spam.end], [1, 0]);

  const pl = frame - S.prompt.start;
  const scroll = lerp(pl, [fr(300), fr(2400)], [0, 800]);
  const replyPress = pl > fr(2800) && pl < fr(3100) ? 0.93 : 1;
  const barFade = lerp(pl, [fr(3100), fr(3400)], [1, 0]);

  const kl = frame - S.stamp.start;
  const stampIn = spring({ frame: Math.max(0, kl - fr(150)), fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.85 } });

  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });
  const lIn2 = spring({ frame: Math.max(0, ll - fr(260)), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  return (
    <Stage>
      {/* ---------- what everyone else sends ---------- */}
      {frame < S.prompt.start && (
        <AbsoluteFill style={{ padding: "104px 46px 0", opacity: spamOut }}>
          <div style={{ ...disp(40, { textAlign: "left", color: MUTED }), opacity: headIn, marginBottom: 34 }}>
            What everyone else sends
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SPAM.map((m, i) => {
              const s = spring({ frame: Math.max(0, sl - fr(450) - i * fr(620)), fps: FPS, config: { damping: 17, stiffness: 170, mass: 0.85 } });
              if (s <= 0.001) return null;
              return (
                <div key={i} style={{ border: "1px solid #ececef", borderRadius: 18, padding: "22px 24px", background: "#fafafa", opacity: s * 0.94, transform: `translateY(${(1 - s) * 20}px)` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 21, fontWeight: 700, color: "#9b9ba3" }}>{m.from}</span>
                    <span style={{ marginLeft: "auto", fontSize: 15, color: "#c2c2c9" }}>{m.ago}</span>
                  </div>
                  <div style={{ fontSize: 21, color: "#b4b4bb", marginTop: 9 }}>{m.txt}</div>
                  <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: "#c2c2c9", letterSpacing: "0.1em" }}>UNREAD</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the profile's own prompt, in the app ---------- */}
      {frame >= S.prompt.start && frame < S.chat.start && (
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
          <TalChat lf={frame - S.chat.start} msgs={CHAT} chips={["Setup Meet", "Resume requested"]} />
          {frame >= S.stamp.start && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center", opacity: stampIn, transform: `scale(${0.86 + 0.14 * stampIn})` }}>
              <div style={{ background: "#fff", borderRadius: 999, padding: "12px 26px", boxShadow: "0 10px 26px -12px rgba(20,28,48,0.4)", border: "1px solid #eee" }}>
                <div style={disp(34, { color: PURPLE })}>Answered in 11 minutes</div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18, padding: "0 54px" }}>
          <div style={{ ...disp(64), opacity: lIn, transform: `translateY(${(1 - lIn) * 18}px)` }}>Ask about the work.</div>
          <div style={{ ...disp(64, { color: PURPLE }), opacity: lIn2, transform: `translateY(${(1 - lIn2) * 18}px)` }}>They answer.</div>
        </AbsoluteFill>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
