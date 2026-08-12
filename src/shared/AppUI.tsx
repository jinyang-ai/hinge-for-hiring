// ============================================================
// Real tal BOSS app surfaces, factored out so every reel shows the actual
// product rather than a mockup of it:
//   ActionBar — the floating ✕ / Request resume / Reply bar from the deck
//   TalChat   — the chat screen (header, Setup Meet / Resume requested chips,
//               big legible bubbles, composer) generalised over a message list
// Type sizes match the app screens exactly — they are large on purpose so the
// copy is readable at reel speed.
// ============================================================
import React from "react";
import { Img, staticFile, interpolate, Easing } from "remotion";
import * as Ic from "../hinge/icons2";
import { hero } from "../hinge/data";

const INK = "var(--surface-90)";
const SUB = "var(--surface-50)";
const REQ_BG = "#2b2b2b";
const REPLY_BG = "#f2ece1";
const YELLOW = "#f5b60a";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- the deck's floating action bar ----------
export const ActionBar: React.FC<{ xPress?: number; resumePress?: number; opacity?: number }> = ({
  xPress = 1,
  resumePress = 1,
  opacity = 1,
}) => (
  <div className="r245-actions" style={{ opacity, pointerEvents: "none" }}>
    <div className="r245-x" style={{ transform: `scale(${xPress})` }}>
      <Ic.Cross />
    </div>
    <div className="r245-pill">
      <div className="seg" style={{ transform: `scale(${resumePress})` }}>
        <Img src={staticFile("reel/icon-resume.png")} style={{ width: 23, height: 23 }} />
        <span>Request resume</span>
      </div>
      <div className="seg">
        <Ic.DM />
        <span>Reply</span>
      </div>
    </div>
  </div>
);

// ---------- the chat ----------
export type Msg = {
  side: "out" | "in";
  text?: string;
  at: number; // frame the bubble lands
  time?: string;
  typingUntil?: number; // if set, show a typing indicator from `at` until this
  resume?: boolean; // render the resume attachment card instead of text
  meet?: { when: string; accepted?: boolean }; // the Google Meet invite card
};

const Avatar: React.FC<{ size: number; src?: string }> = ({ size, src }) => (
  <div style={{ width: size, height: size, borderRadius: 999, overflow: "hidden", flex: "0 0 auto", background: "#e9edf3" }}>
    <Img src={src ?? hero.facePhoto} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", display: "block" }} />
  </div>
);

const rise = (lf: number, at: number, px = 18): React.CSSProperties => {
  const p = interpolate(lf, [at, at + 8], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  return { opacity: p, transform: `translateY(${(1 - p) * px}px)` };
};

const Typing: React.FC<{ lf: number }> = ({ lf }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, alignSelf: "flex-start" }}>
    <Avatar size={52} />
    <div style={{ background: REPLY_BG, borderRadius: "8px 26px 26px 26px", padding: "21px 24px", display: "flex", gap: 8 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#a7a29a",
            opacity: 0.7,
            transform: `translateY(${-4 * Math.abs(Math.sin(lf * 0.35 - i * 0.9))}px)`,
          }}
        />
      ))}
    </div>
  </div>
);

const ResumeCard: React.FC = () => (
  <div style={{ width: 335 }}>
    <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", padding: "17px 20px 11px", overflow: "hidden", height: 136 }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, letterSpacing: 0.8, textAlign: "center", color: "#1c1c1e" }}>
        SANCHIT TRIPATHI
      </div>
      <div style={{ fontSize: 9, color: "#6c6c70", textAlign: "center", marginTop: 3 }}>
        +91 98450 12345 · sanchit@mail.com · linkedin.com/in/sanchit
      </div>
      {["Summary", "Technical Skills", "Experience"].map((h) => (
        <div key={h}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#2456a8", marginTop: 9 }}>{h}</div>
          <div style={{ height: 4, background: "#e8e8e8", borderRadius: 2, marginTop: 4 }} />
          <div style={{ height: 4, background: "#e8e8e8", borderRadius: 2, marginTop: 3, width: "82%" }} />
        </div>
      ))}
    </div>
    <div style={{ background: "#e7ddcb", borderRadius: "0 0 16px 16px", padding: "11px 16px" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>Sanchit_Resume.pdf</div>
      <div style={{ fontSize: 13.5, color: "var(--surface-60)" }}>PDF</div>
    </div>
  </div>
);

// the Google Meet invite as it sits in the thread — and the moment it is accepted
const MeetCard: React.FC<{ when: string; accepted?: boolean }> = ({ when, accepted }) => (
  <div style={{ width: 350, background: "#fff", borderRadius: 16, border: "1px solid #e6e2de", padding: "16px 18px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden style={{ flex: "0 0 auto" }}>
        <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 16.5v-9z" fill="#00832D" />
        <path d="M15 9.6l4.3-3.1c.7-.5 1.7 0 1.7.9v9.2c0 .9-1 1.4-1.7.9L15 14.4V9.6z" fill="#00AC47" />
        <path d="M15 9.6V7a1 1 0 0 0-1-1h-3.2l4.2 3.6z" fill="#FFBA00" />
        <path d="M10.8 18H14a1 1 0 0 0 1-1v-2.6L10.8 18z" fill="#0066DA" />
      </svg>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: INK }}>Google Meet</div>
        <div style={{ fontSize: 16, color: "var(--surface-60)", marginTop: 1 }}>{when}</div>
      </div>
    </div>
    {accepted && (
      <div style={{ marginTop: 14, paddingTop: 13, borderTop: "1px solid #f0ece7", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: "#13bf69", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>✓</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#0f9d58" }}>Sanchit accepted</span>
      </div>
    )}
  </div>
);

export const TalChat: React.FC<{
  lf: number;
  msgs: Msg[];
  name?: string;
  subtitle?: string;
  face?: string;
  chips?: [string, string];
}> = ({ lf, msgs, name = hero.name, subtitle = hero.chatSubtitle, face, chips = ["Setup Meet", "Resume requested"] }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", flexDirection: "column" }}>
    {/* header */}
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "40px 28px 18px", borderBottom: "1px solid #efefef" }}>
      <span style={{ color: INK, display: "flex" }}>
        <svg width={34} height={34} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <Avatar size={70} src={face} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>{name}</div>
        <div style={{ fontSize: 18, color: SUB, marginTop: 2 }}>{subtitle}</div>
      </div>
      <span style={{ color: "#9a9a9a", display: "flex" }}>
        <svg width={31} height={31} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
      </span>
    </div>

    {/* chips */}
    <div style={{ display: "flex", gap: 13, padding: "15px 28px", borderBottom: "1px solid #f3f3f3" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, border: "1.5px solid var(--surface-25)", borderRadius: 999, padding: "10px 21px", fontSize: 18, fontWeight: 600, color: INK }}>
        <span style={{ color: YELLOW, display: "flex" }}>
          <svg width={25} height={25} viewBox="0 0 24 24" fill="none"><rect x="2.5" y="6" width="13" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M15.5 10l5-3v10l-5-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </span>
        {chips[0]}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, border: "1.5px solid var(--surface-25)", borderRadius: 999, padding: "10px 21px", fontSize: 18, fontWeight: 600, color: SUB }}>
        <Img src={staticFile("reel/icon-resume.png")} style={{ width: 23, height: 23, opacity: 0.55 }} />
        {chips[1]}
      </div>
    </div>

    {/* thread */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 18, padding: "20px 28px 16px", overflow: "hidden" }}>
      <div style={{ alignSelf: "center", fontSize: 22, fontWeight: 700, color: INK }}>Today</div>
      {msgs.map((m, i) => {
        if (lf < m.at) return null;
        if (m.typingUntil && lf < m.typingUntil) return <Typing key={i} lf={lf} />;
        if (m.typingUntil && lf >= m.typingUntil && !m.text && !m.resume) return null;
        const out = m.side === "out";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              alignSelf: out ? "flex-end" : "flex-start",
              maxWidth: 600,
              ...rise(lf, m.typingUntil ?? m.at, 22),
            }}
          >
            {!out && <Avatar size={52} src={face} />}
            <div
              style={{
                background: out ? REQ_BG : REPLY_BG,
                borderRadius: out ? "26px 26px 10px 26px" : "8px 26px 26px 26px",
                padding: m.resume ? 12 : "19px 25px 14px",
              }}
            >
              {m.meet ? (
                <MeetCard when={m.meet.when} accepted={m.meet.accepted} />
              ) : m.resume ? (
                <>
                  <ResumeCard />
                  {m.text && <div style={{ fontSize: 19, color: INK, padding: "12px 6px 3px" }}>{m.text}</div>}
                </>
              ) : (
                <div style={{ fontSize: 27, color: out ? "#fff" : INK, lineHeight: 1.4 }}>{m.text}</div>
              )}
              {m.time && (
                <div style={{ fontSize: 15, color: out ? "rgba(255,255,255,0.45)" : SUB, textAlign: "right", marginTop: 8 }}>{m.time}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* composer */}
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "15px 28px 38px" }}>
      <div style={{ width: 68, height: 68, borderRadius: 999, background: "#f2f0ec", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a6a6a", flex: "0 0 auto" }}>
        <svg width={34} height={34} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
      </div>
      <div style={{ flex: 1, height: 72, borderRadius: 999, border: "2px solid #e6e6e6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        <span style={{ fontSize: 28, color: SUB }}>Message</span>
        <svg width={31} height={31} viewBox="0 0 24 24" fill="none" style={{ color: "#7a7a7a" }}><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M6 11a6 6 0 0012 0M12 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </div>
    </div>
  </div>
);
