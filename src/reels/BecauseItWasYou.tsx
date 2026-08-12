// ============================================================
// "They replied because it was you asking." — the no-middleman loop,
// candidate side. Where AskTheWork is about what the message SAYS, this is
// about who SENT it. On the candidate's lock screen the recruiter pings are
// interchangeable frosted glass; the founder's lands as a solid white card
// with a real face, opens in the tal BOSS chat, and gets answered.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, staticFile } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, PURPLE, GREEN } from "../shared/kit";
import { TalChat, type Msg } from "../shared/AppUI";
import { LockScreen, GlassPing, TalPing, type Ping } from "./LockScreen";

const MS = { lock: 5200, opened: 3800, replied: 4200, line: 2400, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["lock", "opened", "replied", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const PINGS: Ping[] = [
  { app: "LINKEDIN", from: "Talent Acquisition", txt: "Hi! Are you open to opportunities?", ago: "3w ago" },
  { app: "MAIL", from: "Senior Recruiter", txt: "Exciting role with a market leader…", ago: "2w ago" },
  { app: "LINKEDIN", from: "Hiring Partner", txt: "Quick chat about your profile?", ago: "6d ago" },
];

const FOUNDER_MSG = "I'm the founder — 9 of us, building payments infra. Loved the 0→1 you did on CRED's rewards engine. 20 minutes this week?";

const CHAT: Msg[] = [{ side: "in", at: fr(400), text: FOUNDER_MSG, time: "8:31 PM" }];
const CHAT_REPLIED: Msg[] = [
  { side: "in", at: 0, text: FOUNDER_MSG, time: "8:31 PM" },
  { side: "out", at: fr(700), typingUntil: fr(1700), text: "Not looking, honestly. But that sounds interesting — Friday evening?", time: "8:42 PM" },
];

export const BecauseItWasYou: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- lock screen ----
  const il = frame;
  const TAL_AT = fr(2700);
  const talIn = spring({ frame: Math.max(0, il - TAL_AT), fps: FPS, config: { damping: 15, stiffness: 130, mass: 0.95 } });
  // the glass pings recede as the real one lands
  const recede = lerp(il, [TAL_AT, TAL_AT + fr(700)], [0, 1]);
  const lockOut = lerp(frame, [S.lock.end - fr(360), S.lock.end], [1, 0]);

  const ol = frame - S.opened.start;
  const openStamp = spring({ frame: Math.max(0, ol - fr(2000)), fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.85 } });

  const rl = frame - S.replied.start;
  const repStamp = spring({ frame: Math.max(0, rl - fr(2400)), fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.85 } });

  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });
  const lIn2 = spring({ frame: Math.max(0, ll - fr(300)), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  const Stamp: React.FC<{ s: number; text: string; colour: string }> = ({ s, text, colour }) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.86 + 0.14 * s})` }}>
      <div style={{ background: "#fff", borderRadius: 999, padding: "13px 28px", boxShadow: "0 10px 26px -12px rgba(20,28,48,0.4)", border: "1px solid #eee" }}>
        <div style={disp(34, { color: colour })}>{text}</div>
      </div>
    </div>
  );

  return (
    <Stage>
      {/* ---------- the lock screen ---------- */}
      {frame < S.opened.start && (
        <AbsoluteFill style={{ opacity: lockOut }}>
          <LockScreen dim={recede}>
            <div style={{ position: "absolute", left: 34, right: 34, top: 300, display: "flex", flexDirection: "column", gap: 14 }}>
              {PINGS.map((p, i) => {
                const s = spring({ frame: Math.max(0, il - fr(500) - i * fr(620)), fps: FPS, config: { damping: 17, stiffness: 170, mass: 0.85 } });
                if (s <= 0.001) return null;
                return (
                  <GlassPing
                    key={i}
                    p={p}
                    style={{
                      opacity: s * (1 - recede * 0.72),
                      transform: `translateY(${(1 - s) * 22 - recede * 26}px) scale(${1 - recede * 0.04})`,
                    }}
                  />
                );
              })}
            </div>

            {/* the one that is not glass */}
            {il >= TAL_AT && (
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  right: 34,
                  top: lerp(il, [TAL_AT, TAL_AT + fr(1300)], [700, 516]),
                  opacity: talIn,
                  transform: `translateY(${(1 - talIn) * 44}px) scale(${0.95 + 0.05 * talIn})`,
                }}
              >
                <TalPing msg={FOUNDER_MSG} />
              </div>
            )}
          </LockScreen>
        </AbsoluteFill>
      )}

      {/* ---------- opened, in the real chat ---------- */}
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
