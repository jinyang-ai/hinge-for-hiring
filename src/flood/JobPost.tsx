// ============================================================
// Scene 0 - the cause. A founder posts one role on a generic professional
// job board: title types in, location fills, cursor hits "Post job".
// Deliberately NOT LinkedIn's actual mark/wordmark - a competitor ad that
// reproduces a real platform's branding is a trademark problem, so this is a
// recognisable-but-generic composer (corporate blue, same anatomy).
// ============================================================
import React from "react";
import { interpolate, spring, Easing } from "remotion";
import { FPS, f } from "./timing";

const BLUE = "#2563EB";
const INK = "#1c1c1e";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TITLE = "Senior Backend Engineer";
const LOC = "Bengaluru, India";

const Field: React.FC<{ label: string; value: string; caret?: boolean }> = ({ label, value, caret }) => (
  <div style={{ marginTop: 18 }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#8e8e97", marginBottom: 7 }}>{label}</div>
    <div
      style={{
        border: "1.5px solid #d7d7de",
        borderRadius: 10,
        padding: "13px 14px",
        fontSize: 17,
        fontWeight: 600,
        color: INK,
        background: "#fff",
        minHeight: 50,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
      }}
    >
      {value}
      {caret && <span style={{ display: "inline-block", width: 2, height: 20, background: BLUE, marginLeft: 2 }} />}
    </div>
  </div>
);

// simple arrow cursor
const Cursor: React.FC = () => (
  <svg width="26" height="30" viewBox="0 0 26 30" style={{ display: "block", filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.3))" }}>
    <path d="M2 1 L2 22 L8 17 L12 27 L16 25 L12 15 L20 15 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const JobPost: React.FC<{ local: number; dur: number }> = ({ local, dur }) => {
  const rise = spring({ frame: Math.max(0, local), fps: FPS, config: { damping: 15, stiffness: 120, mass: 0.9 } });

  // title types in, then location
  const typeP = interpolate(local, [f(420), f(1150)], [0, 1], clampE);
  const typed = TITLE.slice(0, Math.round(TITLE.length * typeP));
  const locP = interpolate(local, [f(1200), f(1450)], [0, 1], clampE);
  const locTyped = LOC.slice(0, Math.round(LOC.length * locP));

  // cursor travels to the button and presses it
  const move = interpolate(local, [f(1480), f(1780)], [0, 1], { ...clampE, easing: Easing.inOut(Easing.cubic) });
  // starts over the location field, lands on the "Post job" button (≈y 340)
  const cx = interpolate(move, [0, 1], [356, 252]);
  const cy = interpolate(move, [0, 1], [262, 338]);
  const pressT = local - f(1820);
  const press = pressT >= 0 && pressT <= 6 ? 1 - 0.07 * Math.sin((pressT / 6) * Math.PI) : 1;
  const posted = interpolate(local, [f(1860), f(1980)], [0, 1], clampE);

  // the whole composer recedes as the applications start landing
  const out = interpolate(local, [dur - f(360), dur], [0, 1], { ...clampE, easing: Easing.in(Easing.cubic) });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: (1 - out) * Math.min(1, rise * 1.4),
        transform: `translateY(${(1 - rise) * 90 - out * 60}px) scale(${1 - out * 0.06})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 520,
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #e4e4ea",
          boxShadow: "0 24px 60px rgba(20,28,48,0.20)",
          padding: "22px 26px 26px",
          boxSizing: "border-box",
        }}
      >
        {/* board chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid #eeeef3" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M10 3h4a2 2 0 0 1 2 2v2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2zm0 4h4V5h-4v2z" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>Jobs</div>
          <div style={{ marginLeft: "auto", fontSize: 12.5, color: "#a0a0a8" }}>Post a job</div>
        </div>

        <div style={{ fontSize: 25, fontWeight: 700, color: INK, letterSpacing: "-0.02em", marginTop: 18 }}>Post a job</div>

        <Field label="Job title" value={typed} caret={typeP > 0 && typeP < 1} />
        <Field label="Location" value={locTyped} />

        {/* post button */}
        <div
          style={{
            marginTop: 24,
            background: BLUE,
            color: "#fff",
            borderRadius: 999,
            textAlign: "center",
            padding: "15px 0",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            transform: `scale(${press})`,
          }}
        >
          {posted > 0.5 ? "Posted ✓" : "Post job"}
        </div>

        {/* cursor */}
        <div style={{ position: "absolute", left: cx, top: cy, zIndex: 5 }}>
          <Cursor />
        </div>
      </div>
    </div>
  );
};
