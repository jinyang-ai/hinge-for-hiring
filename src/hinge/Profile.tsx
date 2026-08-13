// ============================================================
// Scene 2 - a candidate as a rich, scrollable profile (BOSS-POV). Data-driven,
// so EVERY candidate (not just the hero) gets the full treatment: photo → sheet
// (name/role/stats/Top-1%) → work experience → top skills → "what am I working
// on" → coding stat. The reel scrolls through each one; the hero's scroll lands
// on the work segment (Reply → chat), the others browse then get dismissed.
// ============================================================
import React from "react";
import { CARD_W, CARD_H, PHOTO_H } from "./timing";
import { type Candidate, type Xp } from "./data";
import { PhotoInner, CandidateSheet } from "./CandidateCard";

const INK = "var(--surface-90)";
const SUB = "var(--surface-50)";

const Hairline: React.FC = () => <div style={{ height: 1, background: "var(--surface-25)", margin: "15px 0" }} />;
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 16, fontWeight: 700, color: INK, textAlign: "left" }}>{children}</div>
);

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

const Skills: React.FC<{ skills: string[] }> = ({ skills }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
    {skills.map((s) => (
      <span key={s} style={{ fontSize: 13, fontWeight: 600, color: "var(--surface-80)", background: "var(--surface-20)", border: "1px solid var(--surface-25)", borderRadius: 999, padding: "7px 14px" }}>{s}</span>
    ))}
  </div>
);

const CodeforcesBars: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
    <rect x="1" y="8" width="4.6" height="11" rx="1.4" fill="#ffbb00" />
    <rect x="7.7" y="3" width="4.6" height="16" rx="1.4" fill="#1f8acb" />
    <rect x="14.4" y="10" width="4.6" height="9" rx="1.4" fill="#d1444a" />
  </svg>
);
const GithubMark: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden><path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.5 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.1 6.8-9.6C22 6.6 17.5 2 12 2z" /></svg>
);

const CodeStat: React.FC<{ c: Candidate }> = ({ c }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
      {c.code.kind === "codeforces" ? <CodeforcesBars /> : <GithubMark />}
      <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{c.code.kind === "codeforces" ? "Codeforces" : "GitHub"}</span>
      <span style={{ marginLeft: "auto", fontSize: 11.5, color: SUB }}>{c.code.handle} ↗</span>
    </div>
    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12.5, color: "var(--surface-70)", textAlign: "left" }}>
      <span><b style={{ color: INK }}>{c.code.a}</b></span>
      <span>{c.code.b}</span>
    </div>
  </>
);

// the work-segment prompt - its Reply is the one the boss taps (hero only)
const WorkSegment: React.FC<{ c: Candidate; press: number }> = ({ c, press }) => (
  <div style={{ textAlign: "left" }}>
    <div style={{ fontSize: 30, lineHeight: 1 }}>📖</div>
    <div style={{ fontSize: 13, color: SUB, marginTop: 8 }}>{c.working.q}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: INK, marginTop: 8, lineHeight: 1.32 }}>{c.working.a}</div>
    <div style={{ marginTop: 16, background: "var(--surface-20)", borderRadius: 14, textAlign: "center", padding: "13px 0", fontSize: 15, fontWeight: 600, color: INK, transform: `scale(${press})` }}>Reply</div>
  </div>
);

export const Profile: React.FC<{ c: Candidate; scroll: number; replyPress?: number; radius?: number }> = ({ c, scroll, replyPress = 1, radius = 30 }) => (
  <div style={{ position: "relative", width: CARD_W, height: CARD_H, borderRadius: radius, overflow: "hidden", background: "#fff" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: CARD_W, transform: `translateY(${-scroll}px)` }}>
      <div style={{ position: "relative", width: CARD_W, height: PHOTO_H, overflow: "hidden", borderRadius: "30px 30px 0 0", background: "#e9edf3" }}>
        <PhotoInner c={c} />
      </div>
      <div style={{ position: "relative", marginTop: -22, background: "#fff", borderRadius: "30px 30px 0 0", padding: "18px 18px 0", zIndex: 2 }}>
        <CandidateSheet c={c} />
        <Hairline />
        <SectionLabel>{c.expHeader}</SectionLabel>
        {c.xps.map((xp) => <XpRow key={xp.title + xp.company} xp={xp} />)}
        {c.moreXp ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12.5, color: "var(--surface-60)" }}>
            <span style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "0 0 0 1px var(--surface-25)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>⌄</span>
            Show {c.moreXp} more experience{c.moreXp > 1 ? "s" : ""}
          </div>
        ) : null}
        <Hairline />
        <SectionLabel>Top skills</SectionLabel>
        <Skills skills={c.skills} />
        <Hairline />
        <WorkSegment c={c} press={replyPress} />
        <Hairline />
        <CodeStat c={c} />
        <div style={{ height: 40 }} />
      </div>
    </div>
  </div>
);
