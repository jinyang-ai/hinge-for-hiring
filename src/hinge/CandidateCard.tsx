// ============================================================
// Scene 2 — the candidate card face (BOSS-POV). Native 393-wide. Photo
// (~54%) + white sheet: name → role → Last seen · CTC · Location →
// "Top 1%" badge (hero only) → a "📖 what I'm working on" teaser.
// Photo + sheet are exported so the hero reuses them inside a scrollable
// profile (HeroProfile). Anatomy mirrors the HM-side TalReel candidate card.
// ============================================================
import React from "react";
import { staticFile } from "remotion";
import { CARD_W, CARD_H, PHOTO_H, SHEET_TOP } from "./timing";
import { type Candidate } from "./data";
import * as Ic from "./icons2";

const SEAL_GREY = "#a2a2a8";
const GREEN = "#13bf69";

const Hairline: React.FC<{ m?: string }> = ({ m = "9px 0" }) => (
  <div style={{ height: 1, background: "var(--surface-25)", margin: m }} />
);

// photo image (no wrapper — parent positions/clips it)
export const PhotoInner: React.FC<{ c: Candidate }> = ({ c }) => (
  <img
    src={c.heroPhoto}
    alt=""
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: c.heroPos ?? "50% 26%",
      transform: `scale(${c.heroZoom ?? 1})`,
      transformOrigin: c.heroPos ?? "50% 26%",
      display: "block",
    }}
  />
);

// Last seen · CTC · Location — 3-up, bordered top & bottom.
const StatsRow: React.FC<{ c: Candidate }> = ({ c }) => (
  <div style={{ display: "flex", marginTop: 9, borderTop: "1px solid var(--surface-25)", borderBottom: "1px solid var(--surface-25)" }}>
    {[
      { v: c.lastSeen, l: "Last seen", today: c.lastSeen === "Today" },
      { v: c.ctc, l: "CTC" },
      { v: c.location, l: "Location" },
    ].map((st, i) => (
      <div key={st.l} style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderLeft: i ? "1px solid var(--surface-25)" : "none" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: st.today ? GREEN : "var(--surface-90)" }}>{st.today ? "● Today" : st.v}</div>
        <div style={{ fontSize: 10.5, color: "var(--surface-50)", marginTop: 1 }}>{st.l}</div>
      </div>
    ))}
  </div>
);

// shared sheet top: name → role → stats → Top-1% badge
export const CandidateSheet: React.FC<{ c: Candidate }> = ({ c }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--surface-90)" }}>{c.name}</span>
      {c.verified && <span style={{ color: SEAL_GREY, display: "flex" }}><Ic.Verified size={16} /></span>}
    </div>
    <div style={{ textAlign: "center", fontSize: 14, fontWeight: 500, color: "var(--surface-60)", marginTop: 3 }}>{c.role}</div>
    <StatsRow c={c} />
    {c.topMatch && (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <img src={staticFile("reel/top-match-tight.png")} alt="Top 1% of all candidates for you" style={{ width: "72%", height: "auto", display: "block" }} />
      </div>
    )}
  </>
);

// card face = photo + sheet + a "what I'm working on" teaser
export const CandidateCard: React.FC<{ c: Candidate }> = ({ c }) => (
  <div style={{ position: "relative", width: CARD_W, height: CARD_H, borderRadius: 30, overflow: "hidden", background: "#fff" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: CARD_W, height: PHOTO_H, borderRadius: "30px 30px 0 0", overflow: "hidden", background: "#e9edf3" }}>
      <PhotoInner c={c} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: SHEET_TOP, bottom: 0, background: "#fff", borderRadius: "30px 30px 0 0", padding: "13px 16px 0" }}>
      <CandidateSheet c={c} />
      <Hairline />
      <div style={{ fontSize: 12.5, color: "var(--surface-50)" }}>📖 What I&rsquo;m currently working on</div>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--surface-90)", marginTop: 4, lineHeight: 1.38, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {c.working.a}
      </div>
    </div>
  </div>
);
