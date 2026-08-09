// ============================================================
// Scene 2 — the hero candidate (Sanchit) as a scrollable profile (BOSS-POV).
// Photo + sheet (name/role/stats/Top-1%), then work experience, the
// "what am I working on" segment (the Reply the boss taps), and Codeforces.
// The reel scrolls down to the work segment, then Reply → chat.
// ============================================================
import React from "react";
import { CARD_W, CARD_H, PHOTO_H } from "./timing";
import { hero, codeforces, type Xp } from "./data";
import { PhotoInner, CandidateSheet } from "./CandidateCard";

const INK = "var(--surface-90)";
const SUB = "var(--surface-50)";

const Hairline: React.FC = () => <div style={{ height: 1, background: "var(--surface-25)", margin: "16px 0" }} />;

const XpDates: React.FC<{ dates: string }> = ({ dates }) => {
  const [from, dur, to] = dates.split(" · ");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 11.5, color: SUB }}>
      <span>{from}</span>
      {dur && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--surface-20)", borderRadius: 999, padding: "2px 9px", fontSize: 10.5, fontWeight: 600, color: "var(--surface-70)" }}>
          <span style={{ fontSize: 11 }}>←</span>{dur}<span style={{ fontSize: 11 }}>→</span>
        </span>
      )}
      {to && <span>{to}</span>}
    </div>
  );
};

const XpRow: React.FC<{ xp: Xp }> = ({ xp }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 12, textAlign: "left" }}>
    {xp.logo ? (
      <img src={xp.logo} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "contain", background: "#fff", padding: 2, boxSizing: "border-box", flex: "0 0 auto", boxShadow: "0 0 0 1px var(--surface-25)" }} />
    ) : (
      <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-25)", color: "var(--surface-60)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, flex: "0 0 auto" }}>{xp.company[0]}</span>
    )}
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{xp.title}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--surface-70)", marginTop: 1 }}>{xp.company}</div>
      <XpDates dates={xp.dates} />
      {xp.loc && <div style={{ fontSize: 11.5, color: SUB, marginTop: 3 }}>{xp.loc}</div>}
    </div>
    <span style={{ color: "var(--surface-40)", fontSize: 13, marginTop: 4 }}>⌄</span>
  </div>
);

const CodeforcesBars: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
    <rect x="1" y="8" width="4.6" height="11" rx="1.4" fill="#ffbb00" />
    <rect x="7.7" y="3" width="4.6" height="16" rx="1.4" fill="#1f8acb" />
    <rect x="14.4" y="10" width="4.6" height="9" rx="1.4" fill="#d1444a" />
  </svg>
);

// the work-segment prompt — its Reply is the one the boss taps
const WorkSegment: React.FC<{ press: number }> = ({ press }) => (
  <div style={{ textAlign: "left" }}>
    <div style={{ fontSize: 30, lineHeight: 1 }}>📖</div>
    <div style={{ fontSize: 13, color: SUB, marginTop: 8 }}>{hero.working.q}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: INK, marginTop: 8, lineHeight: 1.32 }}>{hero.working.a}</div>
    <div style={{ marginTop: 16, background: "var(--surface-20)", borderRadius: 14, textAlign: "center", padding: "13px 0", fontSize: 15, fontWeight: 600, color: INK, transform: `scale(${press})` }}>Reply</div>
  </div>
);

export const HeroProfile: React.FC<{ scroll: number; replyPress: number; radius?: number }> = ({ scroll, replyPress, radius = 30 }) => (
  <div style={{ position: "relative", width: CARD_W, height: CARD_H, borderRadius: radius, overflow: "hidden", background: "#fff" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: CARD_W, transform: `translateY(${-scroll}px)` }}>
      <div style={{ position: "relative", width: CARD_W, height: PHOTO_H, overflow: "hidden", borderRadius: "30px 30px 0 0", background: "#e9edf3" }}>
        <PhotoInner c={hero} />
      </div>
      <div style={{ position: "relative", marginTop: -22, background: "#fff", borderRadius: "30px 30px 0 0", padding: "18px 18px 0", zIndex: 2 }}>
        <CandidateSheet c={hero} />
        <Hairline />
        <div style={{ fontSize: 16, fontWeight: 700, color: INK, textAlign: "left" }}>{hero.expHeader}</div>
        {hero.xps.map((xp) => <XpRow key={xp.title} xp={xp} />)}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12.5, color: "var(--surface-60)" }}>
          <span style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "0 0 0 1px var(--surface-25)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>⌄</span>
          Show 2 more experiences
        </div>
        <Hairline />
        <WorkSegment press={replyPress} />
        <Hairline />
        <div style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
          <CodeforcesBars />
          <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Codeforces</span>
          <span style={{ marginLeft: "auto", fontSize: 11.5, color: SUB }}>{codeforces.handle} ↗</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: "var(--surface-70)", textAlign: "left" }}>
          <span>Rating: <b style={{ color: INK }}>{codeforces.rating}</b></span>
          <span>Max <b style={{ color: INK }}>{codeforces.max}</b></span>
        </div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  </div>
);
