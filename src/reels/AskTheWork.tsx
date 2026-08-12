// ============================================================
// "Ask about the work." — the Talk loop.
// Claim: the first message is already a real conversation, which is exactly
// why it gets answered. A recruiter's template rots unread for three weeks;
// a founder replying to "what am I working on" gets an answer in 11 minutes.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, Img, staticFile } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, INK, PURPLE, MUTED, FAINT } from "../shared/kit";
import { hero } from "../hinge/data";

const MS = { spam: 3000, prompt: 2600, ask: 2600, answer: 2900, line: 1500, slate: 2100 };
const ORDER: (keyof typeof MS)[] = ["spam", "prompt", "ask", "answer", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const SPAM = [
  { from: "Talent Acquisition", txt: "Hi, are you open to opportunities?", ago: "3 weeks ago" },
  { from: "Senior Recruiter", txt: "Exciting role with a market leader!", ago: "2 weeks ago" },
  { from: "Hiring Partner", txt: "Quick chat about your profile?", ago: "6 days ago" },
];

export const AskTheWork: React.FC = () => {
  const frame = useCurrentFrame();

  const sl = frame - S.spam.start;
  const spamOut = lerp(frame, [S.spam.end - fr(300), S.spam.end], [1, 0]);
  const headIn = lerp(sl, [fr(120), fr(480)], [0, 1]);

  const pl = frame - S.prompt.start;
  const promptIn = spring({ frame: Math.max(0, pl - fr(100)), fps: FPS, config: { damping: 16, stiffness: 140, mass: 0.9 } });
  const replyPress = pl > fr(1700) && pl < fr(1900);

  const al = frame - S.ask.start;
  const askIn = spring({ frame: Math.max(0, al - fr(200)), fps: FPS, config: { damping: 16, stiffness: 170, mass: 0.8 } });
  const typingIn = lerp(al, [fr(1300), fr(1600)], [0, 1]);

  const nl = frame - S.answer.start;
  const ansIn = spring({ frame: Math.max(0, nl - fr(220)), fps: FPS, config: { damping: 16, stiffness: 170, mass: 0.8 } });
  const stampIn = spring({ frame: Math.max(0, nl - fr(1500)), fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.8 } });

  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  const Head: React.FC = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 26 }}>
      <Img src={staticFile("reel/sanchit-face.jpg")} style={{ width: 50, height: 50, borderRadius: 999, objectFit: "cover" }} />
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: INK }}>Sanchit Tripathi</div>
        <div style={{ fontSize: 14.5, color: MUTED }}>Software Engineer · CRED</div>
      </div>
    </div>
  );

  return (
    <Stage>
      {/* ---------- the recruiter graveyard ---------- */}
      {frame < S.prompt.start && (
        <AbsoluteFill style={{ padding: "92px 46px 0", opacity: spamOut }}>
          <div style={{ ...disp(38, { textAlign: "left", color: MUTED }), opacity: headIn, marginBottom: 30 }}>What everyone else sends</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {SPAM.map((m, i) => {
              const s = spring({ frame: Math.max(0, sl - fr(520) - i * fr(420)), fps: FPS, config: { damping: 17, stiffness: 180, mass: 0.8 } });
              if (s <= 0.001) return null;
              return (
                <div key={i} style={{ border: "1px solid #ececef", borderRadius: 16, padding: "18px 20px", background: "#fafafa", opacity: s * 0.92, transform: `translateY(${(1 - s) * 18}px)` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 16.5, fontWeight: 700, color: "#9b9ba3" }}>{m.from}</span>
                    <span style={{ marginLeft: "auto", fontSize: 13, color: "#c2c2c9" }}>{m.ago}</span>
                  </div>
                  <div style={{ fontSize: 17, color: "#b4b4bb", marginTop: 6 }}>{m.txt}</div>
                  <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#c2c2c9", letterSpacing: "0.08em" }}>UNREAD</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the prompt on the profile ---------- */}
      {frame >= S.prompt.start && frame < S.ask.start && (
        <AbsoluteFill style={{ padding: "0 50px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", opacity: promptIn, transform: `translateY(${(1 - promptIn) * 26}px)` }}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>📖</div>
            <div style={{ fontSize: 20, color: MUTED, marginTop: 14 }}>{hero.working.q}</div>
            <div style={{ fontSize: 33, fontWeight: 700, color: INK, marginTop: 12, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
              {hero.working.a}
            </div>
            <div
              style={{
                marginTop: 30,
                background: replyPress ? "#e8e8ed" : "#f2f2f5",
                borderRadius: 18,
                textAlign: "center",
                padding: "20px 0",
                fontSize: 21,
                fontWeight: 600,
                color: INK,
                transform: `scale(${replyPress ? 0.97 : 1})`,
              }}
            >
              Reply
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the boss asks about the work ---------- */}
      {frame >= S.ask.start && frame < S.answer.start && (
        <AbsoluteFill style={{ padding: "108px 44px 0" }}>
          <Head />
          <div style={{ maxWidth: "84%", marginLeft: "auto", background: "#262220", color: "#F5EFE7", borderRadius: "18px 18px 4px 18px", padding: "16px 19px", fontSize: 18.5, lineHeight: 1.4, opacity: askIn, transform: `translateY(${(1 - askIn) * 16}px)` }}>
            How did you get payouts under 100ms on UPI rails? We’re hitting 400 at 9 people.
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 4, opacity: typingIn }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: 99, background: "#c9c4be", display: "block" }} />
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the answer ---------- */}
      {frame >= S.answer.start && frame < S.line.start && (
        <AbsoluteFill style={{ padding: "108px 44px 0" }}>
          <Head />
          <div style={{ maxWidth: "84%", marginLeft: "auto", background: "#262220", color: "#F5EFE7", borderRadius: "18px 18px 4px 18px", padding: "16px 19px", fontSize: 18.5, lineHeight: 1.4, opacity: 0.5 }}>
            How did you get payouts under 100ms on UPI rails?
          </div>
          <div style={{ maxWidth: "88%", marginTop: 18, background: "#F0EDE9", color: "#262220", borderRadius: "18px 18px 18px 4px", padding: "16px 19px", fontSize: 18.5, lineHeight: 1.42, opacity: ansIn, transform: `translateY(${(1 - ansIn) * 16}px)` }}>
            Sharded the ledger and moved settlement async — the payout path never touches the DB. Happy to walk you through it.
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 34, opacity: stampIn, transform: `scale(${0.85 + 0.15 * stampIn})` }}>
            <div style={{ ...disp(40, { color: PURPLE }) }}>Answered in 11 minutes</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: "0 54px" }}>
          <div style={{ ...disp(66), opacity: lIn, transform: `translateY(${(1 - lIn) * 18}px)` }}>Ask about the work.</div>
          <div style={{ ...disp(66, { color: PURPLE }), opacity: lIn }}>They answer.</div>
        </AbsoluteFill>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
