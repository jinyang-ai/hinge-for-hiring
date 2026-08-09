// ============================================================
// Scene 2 payoff (4:5, BOSS-POV) — the chat. The boss already tapped
// "Request resume" on the profile, so the chat opens with the request
// (dark, right) in place; the chip reads "Resume requested". A beat later
// Sanchit replies with his resume (beige, left — mini page preview + PDF).
// Sized up ~30% vs the first pass so it fills the 720-wide frame.
// ============================================================
import React from "react";
import { Easing, interpolate, staticFile } from "remotion";
import { f, CAND_REPLY_FRAME, M2_FRAME, INVITE_FRAME } from "./timing";
import { hero, chat } from "./data";

const INK = "var(--surface-90)";
const SUB = "var(--surface-50)";
const REQ_BG = "#2b2b2b"; // dark request bubble (boss, right)
const REPLY_BG = "#f2ece1"; // beige reply bubble (candidate, left)
const YELLOW = "#f5b60a";

const Chevron: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Dots: React.FC = () => (
  <svg width={31} height={31} viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
);
const Video: React.FC = () => (
  <svg width={25} height={25} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="2.5" y="6" width="13" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M15.5 10l5-3v10l-5-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
);
const Mic: React.FC = () => (
  <svg width={31} height={31} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M6 11a6 6 0 0012 0M12 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
const Plus: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
);

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: 999, overflow: "hidden", flex: "0 0 auto", background: "#e9edf3" }}>
    <img src={hero.facePhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: hero.heroPos ?? "50% 30%", display: "block" }} />
  </div>
);

const appear = (lf: number, at: number, rise = 18): React.CSSProperties => {
  const p = interpolate(lf, [at, at + f(240)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return { opacity: p, transform: `translateY(${(1 - p) * rise}px)` };
};

// candidate's resume reply — mini resume page preview + PDF attachment
const ResumeReply: React.FC<{ lf: number; at: number }> = ({ lf, at }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, alignSelf: "flex-start", maxWidth: 470, ...appear(lf, at, 24) }}>
    <Avatar size={52} />
    <div style={{ width: 335, background: REPLY_BG, borderRadius: "8px 26px 26px 26px", padding: 12 }}>
      {/* mini resume page */}
      <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", padding: "17px 20px 11px", overflow: "hidden", height: 136 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, letterSpacing: 0.8, textAlign: "center", color: "#1c1c1e" }}>SANCHIT TRIPATHI</div>
        <div style={{ fontSize: 9, color: "#6c6c70", textAlign: "center", marginTop: 3 }}>+91 98450 12345 · sanchit@mail.com · linkedin.com/in/sanchit</div>
        {["Summary", "Technical Skills", "Experience"].map((h) => (
          <div key={h}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#2456a8", marginTop: 9 }}>{h}</div>
            <div style={{ height: 4, background: "#e8e8e8", borderRadius: 2, marginTop: 4 }} />
            <div style={{ height: 4, background: "#e8e8e8", borderRadius: 2, marginTop: 3, width: "82%" }} />
          </div>
        ))}
      </div>
      {/* attachment band */}
      <div style={{ background: "#e7ddcb", borderRadius: "0 0 16px 16px", padding: "11px 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>{chat.resume.file}</div>
        <div style={{ fontSize: 13.5, color: "var(--surface-60)" }}>{chat.resume.kind}</div>
      </div>
      <div style={{ fontSize: 19, color: INK, padding: "12px 6px 3px" }}>{chat.resume.text}</div>
      <div style={{ fontSize: 15, color: SUB, textAlign: "right", paddingRight: 6 }}>{chat.resume.time}</div>
    </div>
  </div>
);

// three-dot typing indicator (candidate, left)
const Typing: React.FC<{ lf: number; from: number; until: number }> = ({ lf, from, until }) => {
  if (lf < from || lf >= until) return null;
  const out = interpolate(lf, [until - 3, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, alignSelf: "flex-start", opacity: out }}>
      <Avatar size={52} />
      <div style={{ background: REPLY_BG, borderRadius: "8px 26px 26px 26px", padding: "21px 24px", display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: 999, background: "#a7a29a", opacity: 0.7, transform: `translateY(${-4 * Math.abs(Math.sin(lf * 0.35 - i * 0.9))}px)` }} />
        ))}
      </div>
    </div>
  );
};

export const ChatScreen: React.FC<{ lf: number }> = ({ lf }) => {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#ffffff", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "40px 28px 18px", borderBottom: "1px solid #efefef" }}>
        <span style={{ color: INK, display: "flex" }}><Chevron /></span>
        <Avatar size={70} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>{hero.name}</div>
          <div style={{ fontSize: 18, color: SUB, marginTop: 2 }}>{hero.chatSubtitle}</div>
        </div>
        <span style={{ color: "#9a9a9a", display: "flex" }}><Dots /></span>
      </div>

      {/* action chip row */}
      <div style={{ display: "flex", gap: 13, padding: "15px 28px", borderBottom: "1px solid #f3f3f3" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, border: "1.5px solid var(--surface-25)", borderRadius: 999, padding: "10px 21px", fontSize: 18, fontWeight: 600, color: INK }}>
          <span style={{ color: YELLOW, display: "flex" }}><Video /></span> Setup Meet
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, border: "1.5px solid var(--surface-25)", borderRadius: 999, padding: "10px 21px", fontSize: 18, fontWeight: 600, color: SUB }}>
          <img src={staticFile("reel/icon-resume.png")} style={{ width: 23, height: 23, opacity: 0.55 }} alt="" /> Resume requested
        </div>
      </div>

      {/* thread — bottom anchored */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 18, padding: "20px 28px 16px", overflow: "hidden" }}>
        <div style={{ alignSelf: "center", fontSize: 22, fontWeight: 700, color: INK }}>Today</div>

        {/* boss's resume request (dark, right) — already in place when chat opens */}
        {lf >= CAND_REPLY_FRAME && (
          <div style={{ alignSelf: "flex-end", maxWidth: 570, background: REQ_BG, borderRadius: "26px 26px 10px 26px", padding: "19px 25px 14px", ...appear(lf, CAND_REPLY_FRAME) }}>
            <div style={{ fontSize: 28, color: "#fff", lineHeight: 1.4 }}>
              <span style={{ marginRight: 8 }}>{chat.requestEmoji}</span>{chat.requestPre}
              <b>{chat.requestNameBold}</b>{chat.requestPost}
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", textAlign: "right", marginTop: 8 }}>{chat.requestTime}</div>
          </div>
        )}

        {/* Sanchit typing, then his resume */}
        <Typing lf={lf} from={M2_FRAME} until={INVITE_FRAME} />
        {lf >= INVITE_FRAME && <ResumeReply lf={lf} at={INVITE_FRAME} />}
      </div>

      {/* composer */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "15px 28px 38px" }}>
        <div style={{ width: 68, height: 68, borderRadius: 999, background: "#f2f0ec", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a6a6a", flex: "0 0 auto" }}>
          <Plus />
        </div>
        <div style={{ flex: 1, height: 72, borderRadius: 999, border: "2px solid #e6e6e6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          <span style={{ fontSize: 28, color: SUB }}>Message</span>
          <span style={{ color: "#7a7a7a", display: "flex" }}><Mic /></span>
        </div>
      </div>
    </div>
  );
};
