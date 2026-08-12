// ============================================================
// One anonymous inbound application — the stuff that actually lands in a
// founder's inbox when they post a role on a job board. Deliberately
// faceless: grey avatar, redacted name bar, and ONE disqualifying tag
// (wrong stack, wrong city, 90-day notice, ₹90L ask, 47 jobs today).
// Rendered small and repeated ~34× to bury the frame.
// ============================================================
import React from "react";
import { ROW_W } from "./timing";

const GREY = "#c9c9cf";
const GREY_D = "#b3b3bb";
const PAPER = "#f4f4f7";

export type Junk = { role: string; tag: string; barW: number; barW2: number };

// deterministic pool — no Math.random anywhere (render workers must agree)
const ROLES = [
  "SAP Consultant · 12 yrs",
  "Manual Tester · 8 yrs",
  "Wordpress Developer",
  "Data Entry Operator",
  "Salesforce Admin",
  "IT Support Engineer",
  "Mainframe Developer",
  "Business Analyst · 14 yrs",
  "Digital Marketer",
  "Oracle DBA · 11 yrs",
  "Fresher · 0 yrs exp",
  "Network Engineer",
];
const TAGS = [
  "Not in Bengaluru",
  "90-day notice",
  "Expects ₹90 LPA",
  "Applied to 47 jobs today",
  "0 yrs relevant",
  "No response in 3 wks",
  "Wrong stack",
  "Resume: 9 pages",
];

export const JunkRow: React.FC<{ j: Junk }> = ({ j }) => (
  <div
    style={{
      width: ROW_W,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: PAPER,
      border: `1px solid ${GREY}`,
      borderRadius: 14,
      padding: "12px 14px",
      boxShadow: "0 6px 18px rgba(20,28,48,0.10)",
      boxSizing: "border-box",
    }}
  >
    {/* faceless avatar */}
    <div style={{ width: 38, height: 38, borderRadius: 999, background: GREY, flex: "0 0 auto" }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* redacted name */}
      <div style={{ width: j.barW, height: 11, borderRadius: 999, background: GREY_D }} />
      <div style={{ fontSize: 12.5, color: "#8e8e97", marginTop: 7, whiteSpace: "nowrap", overflow: "hidden" }}>{j.role}</div>
    </div>
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color: "#9a9aa2",
        background: "#e9e9ef",
        border: `1px solid ${GREY}`,
        borderRadius: 999,
        padding: "4px 9px",
        whiteSpace: "nowrap",
        flex: "0 0 auto",
      }}
    >
      {j.tag}
    </div>
  </div>
);

// Seeded LCG → the pile is chaotic-looking but identical on every worker.
export function buildJunk(n: number): (Junk & { x: number; rot: number; delayJit: number })[] {
  let s = 20260812;
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647;
  return Array.from({ length: n }, () => ({
    role: ROLES[Math.floor(rnd() * ROLES.length)],
    tag: TAGS[Math.floor(rnd() * TAGS.length)],
    barW: 66 + Math.floor(rnd() * 74),
    barW2: 0,
    x: (rnd() - 0.5) * 118, // horizontal jitter
    rot: (rnd() - 0.5) * 9, // tilt
    delayJit: rnd(), // per-row spawn jitter
  }));
}
