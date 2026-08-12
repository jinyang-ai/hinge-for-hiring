// ============================================================
// "They replied because it was you." — the no-middleman loop, candidate side.
// Claim: founder-to-engineer gets answered; recruiter spam gets dismissed.
// Where AskTheWork is about what the message SAYS, this is about who SENT it.
// Three recruiter notifications rot and get dismissed; a tal BOSS one from an
// actual founder is opened in 40 seconds and answered in 11 minutes.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, Img, staticFile } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, INK, PURPLE, GREEN, MUTED } from "../shared/kit";

const MS = { ignored: 3200, arrives: 2200, opened: 2600, replied: 2300, line: 1600, slate: 2100 };
const ORDER: (keyof typeof MS)[] = ["ignored", "arrives", "opened", "replied", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const IGNORED = [
  { app: "LINKEDIN", from: "Talent Acquisition", txt: "Hi! Are you open to opportunities?", ago: "3w ago" },
  { app: "EMAIL", from: "Senior Recruiter", txt: "Exciting role with a market leader…", ago: "2w ago" },
  { app: "LINKEDIN", from: "Hiring Partner", txt: "Quick chat about your profile?", ago: "6d ago" },
];

export const BecauseItWasYou: React.FC = () => {
  const frame = useCurrentFrame();

  const il = frame - S.ignored.start;
  const headIn = lerp(il, [fr(100), fr(460)], [0, 1]);
  const ignoredOut = lerp(frame, [S.arrives.start + fr(200), S.arrives.start + fr(620)], [1, 0]);

  // the tal message must arrive WHILE the ignored pile is still on screen —
  // that overlap is the whole contrast — and only then do the others swipe off.
  const TAL_AT = fr(1900);
  const talIn = spring({ frame: Math.max(0, il - TAL_AT), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  const ol = frame - S.opened.start;
  const openIn = spring({ frame: Math.max(0, ol - fr(120)), fps: FPS, config: { damping: 15, stiffness: 150, mass: 0.9 } });
  const openStamp = spring({ frame: Math.max(0, ol - fr(1400)), fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.8 } });

  const rl = frame - S.replied.start;
  const repIn = spring({ frame: Math.max(0, rl - fr(200)), fps: FPS, config: { damping: 16, stiffness: 170, mass: 0.8 } });
  const repStamp = spring({ frame: Math.max(0, rl - fr(1250)), fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.8 } });

  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  // the tal BOSS notification — used in two scenes, so it lives here
  const TalNotif: React.FC<{ opened?: boolean }> = ({ opened }) => (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        border: `1.5px solid ${opened ? "rgba(19,191,105,0.45)" : "#eae6e1"}`,
        padding: "20px 22px",
        boxShadow: "0 18px 40px -18px rgba(20,28,48,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13 }}>
        <Img src={staticFile("reel/tal-boss-wordmark-dark.png")} style={{ height: 26, width: "auto", display: "block" }} />
        <span style={{ marginLeft: "auto", fontSize: 14, color: "#a9a29b" }}>now</span>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Img src={staticFile("reel/boss-face.jpg")} style={{ width: 54, height: 54, borderRadius: 999, objectFit: "cover", objectPosition: "52% 20%", flex: "0 0 auto" }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: INK }}>
            Arjun <span style={{ fontWeight: 500, color: MUTED }}>· Founder</span>
          </div>
          <div style={{ fontSize: 17.5, color: "#3a3a3f", marginTop: 5, lineHeight: 1.4 }}>
            I&rsquo;m the founder. 9 of us, building payments infra. Loved the 0→1 on CRED&rsquo;s rewards engine — 20 minutes this week?
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Stage>
      {/* ---------- the ignored pile ---------- */}
      {frame < S.opened.start && (
        <AbsoluteFill style={{ padding: "84px 40px 0" }}>
          <div style={{ ...disp(34, { textAlign: "left", color: MUTED }), opacity: headIn * ignoredOut, marginBottom: 26 }}>
            Their phone, this month
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: ignoredOut }}>
            {IGNORED.map((m, i) => {
              const s = spring({ frame: Math.max(0, il - fr(520) - i * fr(430)), fps: FPS, config: { damping: 17, stiffness: 180, mass: 0.8 } });
              if (s <= 0.001) return null;
              const swipedOff = lerp(il, [fr(2750) + i * fr(160), fr(3150) + i * fr(160)], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    background: "#f6f6f7",
                    border: "1px solid #ececef",
                    borderRadius: 20,
                    padding: "16px 19px",
                    opacity: s * (1 - swipedOff),
                    transform: `translate(${swipedOff * 560}px, ${(1 - s) * 18}px)`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#b6b6bd", letterSpacing: "0.1em" }}>{m.app}</span>
                    <span style={{ marginLeft: "auto", fontSize: 13, color: "#c2c2c9" }}>{m.ago}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#a4a4ac", marginTop: 7 }}>{m.from}</div>
                  <div style={{ fontSize: 16, color: "#b8b8c0", marginTop: 3 }}>{m.txt}</div>
                </div>
              );
            })}
          </div>

          {/* the one that is different — absolutely placed, so it settles into
              the middle of the frame once the ignored pile has swiped away */}
          {il >= TAL_AT && (
            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: lerp(il, [TAL_AT, TAL_AT + fr(1400)], [566, 330]),
                opacity: talIn,
                transform: `translateY(${(1 - talIn) * 40}px) scale(${0.96 + 0.04 * talIn})`,
              }}
            >
              <TalNotif />
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- opened ---------- */}
      {frame >= S.opened.start && frame < S.replied.start && (
        <AbsoluteFill style={{ padding: "150px 40px 0" }}>
          <div style={{ opacity: openIn, transform: `scale(${0.97 + 0.03 * openIn})` }}>
            <TalNotif opened />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 46, opacity: openStamp, transform: `scale(${0.86 + 0.14 * openStamp})` }}>
            <div style={disp(42, { color: GREEN })}>Opened in 40 seconds</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- replied ---------- */}
      {frame >= S.replied.start && frame < S.line.start && (
        <AbsoluteFill style={{ padding: "150px 40px 0" }}>
          <div style={{ opacity: 0.42 }}>
            <TalNotif opened />
          </div>
          <div
            style={{
              maxWidth: "82%",
              marginTop: 26,
              background: "#262220",
              color: "#F5EFE7",
              borderRadius: "20px 20px 20px 5px",
              padding: "17px 20px",
              fontSize: 19,
              lineHeight: 1.4,
              opacity: repIn,
              transform: `translateY(${(1 - repIn) * 18}px)`,
            }}
          >
            Not looking, but that sounds interesting. Friday evening?
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 44, opacity: repStamp, transform: `scale(${0.86 + 0.14 * repStamp})` }}>
            <div style={disp(42, { color: PURPLE })}>Replied in 11 minutes</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, padding: "0 52px" }}>
          <div style={{ ...disp(60), opacity: lIn, transform: `translateY(${(1 - lIn) * 18}px)` }}>They replied because</div>
          <div style={{ ...disp(60, { color: PURPLE }), opacity: lIn }}>it was you asking.</div>
        </AbsoluteFill>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
