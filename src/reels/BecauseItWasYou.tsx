// ============================================================
// "They replied because it was you asking." — the no-middleman loop,
// candidate side. Where AskTheWork is about what the message SAYS, this is
// about who SENT it. Recruiter pings rot and get dismissed; the founder's
// message opens in the real tal BOSS chat and gets answered in minutes.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, Img, staticFile } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, INK, PURPLE, GREEN, MUTED } from "../shared/kit";
import { TalChat, type Msg } from "../shared/AppUI";

const MS = { ignored: 4400, opened: 3800, replied: 4000, line: 2200, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["ignored", "opened", "replied", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const IGNORED = [
  { app: "LINKEDIN", from: "Talent Acquisition", txt: "Hi! Are you open to opportunities?", ago: "3w ago" },
  { app: "EMAIL", from: "Senior Recruiter", txt: "Exciting role with a market leader…", ago: "2w ago" },
  { app: "LINKEDIN", from: "Hiring Partner", txt: "Quick chat about your profile?", ago: "6d ago" },
];

// the founder's message, in the boss's own voice
const FOUNDER_MSG = "I'm the founder — 9 of us, building payments infra. Loved the 0→1 you did on CRED's rewards engine. 20 minutes this week?";

const CHAT: Msg[] = [
  { side: "in", at: fr(400), text: FOUNDER_MSG, time: "8:31 PM" },
];
const CHAT_REPLIED: Msg[] = [
  { side: "in", at: 0, text: FOUNDER_MSG, time: "8:31 PM" },
  { side: "out", at: fr(600), typingUntil: fr(1500), text: "Not looking, honestly. But that sounds interesting — Friday evening?", time: "8:42 PM" },
];

export const BecauseItWasYou: React.FC = () => {
  const frame = useCurrentFrame();

  const il = frame;
  const headIn = lerp(il, [fr(150), fr(560)], [0, 1]);
  const TAL_AT = fr(2300);
  const talIn = spring({ frame: Math.max(0, il - TAL_AT), fps: FPS, config: { damping: 14, stiffness: 140, mass: 0.95 } });
  const ignoredOut = lerp(frame, [S.ignored.end - fr(400), S.ignored.end], [1, 0]);

  const ol = frame - S.opened.start;
  const openStamp = spring({ frame: Math.max(0, ol - fr(1900)), fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.85 } });

  const rl = frame - S.replied.start;
  const repStamp = spring({ frame: Math.max(0, rl - fr(2100)), fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.85 } });

  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });
  const lIn2 = spring({ frame: Math.max(0, ll - fr(260)), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  const Stamp: React.FC<{ s: number; text: string; colour: string }> = ({ s, text, colour }) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.86 + 0.14 * s})` }}>
      <div style={{ background: "#fff", borderRadius: 999, padding: "13px 28px", boxShadow: "0 10px 26px -12px rgba(20,28,48,0.4)", border: "1px solid #eee" }}>
        <div style={disp(34, { color: colour })}>{text}</div>
      </div>
    </div>
  );

  return (
    <Stage>
      {/* ---------- their phone: three pings that die ---------- */}
      {frame < S.opened.start && (
        <AbsoluteFill style={{ padding: "92px 40px 0", opacity: ignoredOut }}>
          <div style={{ ...disp(38, { textAlign: "left", color: MUTED }), opacity: headIn, marginBottom: 30 }}>Their phone, this month</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {IGNORED.map((m, i) => {
              const s = spring({ frame: Math.max(0, il - fr(400) - i * fr(560)), fps: FPS, config: { damping: 17, stiffness: 170, mass: 0.85 } });
              if (s <= 0.001) return null;
              const swipedOff = lerp(il, [fr(3300) + i * fr(170), fr(3800) + i * fr(170)], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    background: "#f6f6f7",
                    border: "1px solid #ececef",
                    borderRadius: 22,
                    padding: "20px 22px",
                    opacity: s * (1 - swipedOff),
                    transform: `translate(${swipedOff * 620}px, ${(1 - s) * 20}px)`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#b6b6bd", letterSpacing: "0.11em" }}>{m.app}</span>
                    <span style={{ marginLeft: "auto", fontSize: 15, color: "#c2c2c9" }}>{m.ago}</span>
                  </div>
                  <div style={{ fontSize: 21, fontWeight: 700, color: "#a4a4ac", marginTop: 9 }}>{m.from}</div>
                  <div style={{ fontSize: 19.5, color: "#b8b8c0", marginTop: 5 }}>{m.txt}</div>
                </div>
              );
            })}
          </div>

          {/* the one that is different — lands while the dead ones are still up */}
          {il >= TAL_AT && (
            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: lerp(il, [TAL_AT, TAL_AT + fr(1300)], [600, 372]),
                opacity: talIn,
                transform: `translateY(${(1 - talIn) * 42}px) scale(${0.96 + 0.04 * talIn})`,
              }}
            >
              <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #eae6e1", padding: "22px 24px", boxShadow: "0 20px 46px -18px rgba(20,28,48,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 15 }}>
                  <Img src={staticFile("reel/tal-boss-wordmark-dark.png")} style={{ height: 30, width: "auto", display: "block" }} />
                  <span style={{ marginLeft: "auto", fontSize: 16, color: "#a9a29b" }}>now</span>
                </div>
                <div style={{ display: "flex", gap: 15, alignItems: "flex-start" }}>
                  <Img src={staticFile("reel/boss-face.jpg")} style={{ width: 60, height: 60, borderRadius: 999, objectFit: "cover", objectPosition: "52% 20%", flex: "0 0 auto" }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>
                      Arjun <span style={{ fontWeight: 500, color: MUTED }}>· Founder</span>
                    </div>
                    <div style={{ fontSize: 20, color: "#3a3a3f", marginTop: 6, lineHeight: 1.42 }}>{FOUNDER_MSG}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- opened, in the tal BOSS chat ---------- */}
      {frame >= S.opened.start && frame < S.replied.start && (
        <AbsoluteFill>
          <TalChat
            lf={ol}
            msgs={CHAT}
            name="Arjun Mehta"
            subtitle="Founder · 9-person team · Bengaluru"
            face={staticFile("reel/boss-face.jpg")}
            chips={["Setup Meet", "View profile"]}
          />
          <Stamp s={openStamp} text="Opened in 40 seconds" colour={GREEN} />
        </AbsoluteFill>
      )}

      {/* ---------- replied ---------- */}
      {frame >= S.replied.start && frame < S.line.start && (
        <AbsoluteFill>
          <TalChat
            lf={rl}
            msgs={CHAT_REPLIED}
            name="Arjun Mehta"
            subtitle="Founder · 9-person team · Bengaluru"
            face={staticFile("reel/boss-face.jpg")}
            chips={["Setup Meet", "View profile"]}
          />
          <Stamp s={repStamp} text="Replied in 11 minutes" colour={PURPLE} />
        </AbsoluteFill>
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: "0 52px" }}>
          <div style={{ ...disp(58), opacity: lIn, transform: `translateY(${(1 - lIn) * 18}px)` }}>They replied because</div>
          <div style={{ ...disp(58, { color: PURPLE }), opacity: lIn2, transform: `translateY(${(1 - lIn2) * 18}px)` }}>it was you asking.</div>
        </AbsoluteFill>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
