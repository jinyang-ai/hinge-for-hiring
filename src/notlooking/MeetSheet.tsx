// ============================================================
// The product moment - tal BOSS's "Pick a time" sheet.
// Rebuilt from the live app: calendar tile, date + time wheels with a
// selection band, and the SWIPE TO INVITE pill. The founder picks a slot and
// swipes; a Google Meet goes out. No recruiter, no back-and-forth, no JD.
// Laid out for a 720×900 frame (the app is far taller, so this is compressed
// vertically - same anatomy, reel-legible sizes).
// ============================================================
import React from "react";
import { Img, interpolate, Easing, staticFile } from "remotion";
import { REEL_W } from "./timing";

const INK = "#1c1c1e";
const GREEN = "#13bf69";
const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const DATES = ["11 Aug 2026", "12 Aug 2026", "13 Aug 2026", "14 Aug 2026"];
const TIMES = ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

// a wheel column: values scroll so the chosen index lands in the band
const Wheel: React.FC<{ values: string[]; pick: number; offset: number }> = ({ values, pick, offset }) => {
  const ROW = 46;
  return (
    <div style={{ position: "relative", height: ROW * 3, overflow: "hidden", flex: 1 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: ROW, transform: `translateY(${-(pick + offset) * ROW}px)` }}>
        {values.map((v, i) => {
          const d = Math.abs(i - (pick + offset));
          const isSel = d < 0.5;
          return (
            <div
              key={v}
              style={{
                height: ROW,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isSel ? 25 : 22,
                fontWeight: isSel ? 700 : 500,
                color: isSel ? INK : "#b9b9c0",
                opacity: d > 1.6 ? 0.35 : 1,
              }}
            >
              {v}
            </div>
          );
        })}
      </div>
      {/* selection band */}
      <div style={{ position: "absolute", left: 18, right: 18, top: ROW, height: 1, background: "#e6e6ec" }} />
      <div style={{ position: "absolute", left: 18, right: 18, top: ROW * 2, height: 1, background: "#e6e6ec" }} />
    </div>
  );
};

export const MeetSheet: React.FC<{
  local: number;
  f: (ms: number) => number;
  name?: string;
  subtitle?: string;
  face?: string;
  facePos?: string;
}> = ({ local, f, name = "Sanchit Tripathi", subtitle = "Software Engineer, CRED…", face, facePos = "50% 30%" }) => {
  // sheet rises
  const rise = interpolate(local, [0, f(420)], [1, 0], { ...clampE, easing: Easing.out(Easing.cubic) });
  // wheels spin then settle
  const spinD = interpolate(local, [f(400), f(1050)], [2.4, 0], { ...clampE, easing: Easing.out(Easing.cubic) });
  const spinT = interpolate(local, [f(560), f(1250)], [-2.2, 0], { ...clampE, easing: Easing.out(Easing.cubic) });
  // the Google Meet summary lands once the wheels settle
  const meetRow = interpolate(local, [f(1280), f(1600)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });
  // the swipe
  const swipe = interpolate(local, [f(1750), f(2450)], [0, 1], { ...clampE, easing: Easing.inOut(Easing.cubic) });
  const sent = interpolate(local, [f(2470), f(2650)], [0, 1], clampE);

  const TRACK = REEL_W - 80 - 76; // pill width minus knob

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* dimmed conversation behind the sheet */}
      <div style={{ position: "absolute", inset: 0, background: "#8f8f94" }} />
      <div style={{ position: "absolute", top: 42, left: 0, right: 0, padding: "0 30px", opacity: 0.55 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 30, color: "#fff" }}>‹</div>
          <div style={{ position: "relative" }}>
            <Img src={face ?? staticFile("reel/sanchit-face.jpg")} style={{ width: 54, height: 54, borderRadius: 999, objectFit: "cover", objectPosition: facePos, display: "block" }} />
            <div style={{ position: "absolute", right: 1, bottom: 1, width: 13, height: 13, borderRadius: 999, background: GREEN, border: "2px solid #fff" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{name}</div>
            <div style={{ fontSize: 15, color: "#efefef", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 24, color: "#fff" }}>•••</div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.72)", borderRadius: 16, padding: "13px 0", textAlign: "center", fontSize: 17, fontWeight: 600, color: INK }}>
            📹 Setup Meet
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.72)", borderRadius: 16, padding: "13px 0", textAlign: "center", fontSize: 17, fontWeight: 600, color: INK }}>
            Resume requested
          </div>
        </div>
      </div>

      {/* the sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 196,
          bottom: 0,
          background: "#fff",
          borderRadius: "30px 30px 0 0",
          transform: `translateY(${rise * 760}px)`,
          padding: "0 40px",
        }}
      >
        {/* close */}
        <div style={{ position: "absolute", right: 34, top: 26, width: 46, height: 46, borderRadius: 999, background: "#f1f1f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#66666e" }}>
          ✕
        </div>

        {/* calendar tile */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <div style={{ width: 122, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 22px -8px rgba(20,28,48,0.28)", border: "1px solid #eeeef2" }}>
            <div style={{ background: "#2b2b2e", color: "#fff", textAlign: "center", padding: "8px 0", fontSize: 15, fontWeight: 700, letterSpacing: "0.06em" }}>WED</div>
            <div style={{ background: "#fff", textAlign: "center", padding: "6px 0 10px" }}>
              <div style={{ fontSize: 52, fontWeight: 700, color: INK, lineHeight: 1.05, letterSpacing: "-0.02em" }}>12</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#8e8e97", letterSpacing: "0.06em" }}>AUG</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 42, fontWeight: 700, color: INK, letterSpacing: "-0.025em", marginTop: 20 }}>Pick a time</div>
        <div style={{ textAlign: "center", fontSize: 18, color: "#8e8e97", marginTop: 8 }}>Send an invite for the intro call.</div>

        <div style={{ textAlign: "center", fontSize: 16, fontWeight: 600, color: "#66666e", marginTop: 22 }}>Date &amp; Time</div>

        <div style={{ display: "flex", gap: 22, marginTop: 8 }}>
          <Wheel values={DATES} pick={1} offset={spinD} />
          <Wheel values={TIMES} pick={2} offset={spinT} />
        </div>

        {/* what actually goes out - appears once the wheels settle */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 14,
            border: "1px solid #ececf1",
            borderRadius: 16,
            padding: "15px 18px",
            background: sent > 0.5 ? "rgba(19,191,105,0.08)" : "#fafafc",
            opacity: meetRow,
            transform: `translateY(${(1 - meetRow) * 10}px)`,
          }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 11, background: "#fff", border: "1px solid #e8e8ee", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
            {/* Google Meet mark */}
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
              <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 16.5v-9z" fill="#00832D" />
              <path d="M15 9.6l4.3-3.1c.7-.5 1.7 0 1.7.9v9.2c0 .9-1 1.4-1.7.9L15 14.4V9.6z" fill="#00AC47" />
              <path d="M15 9.6V7a1 1 0 0 0-1-1h-3.2l4.2 3.6z" fill="#FFBA00" />
              <path d="M10.8 18H14a1 1 0 0 0 1-1v-2.6L10.8 18z" fill="#0066DA" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>Google Meet</div>
            <div style={{ fontSize: 15, color: "#8e8e97", marginTop: 1 }}>
              {sent > 0.5 ? "Invite sent · Wed 12 Aug, 8:00 PM" : "Wed 12 Aug, 8:00 PM · 30 min"}
            </div>
          </div>
          {sent > 0.5 && <div style={{ marginLeft: "auto", fontSize: 20, color: GREEN }}>✓</div>}
        </div>

        {/* swipe to invite */}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 42 }}>
          <div
            style={{
              position: "relative",
              height: 76,
              borderRadius: 999,
              background: sent > 0.5 ? GREEN : "#1f1f22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "0.09em", opacity: sent > 0.5 ? 1 : 1 - swipe * 0.75 }}>
              {sent > 0.5 ? "GOOGLE MEET SENT" : "SWIPE TO INVITE"}
            </div>
            {/* knob */}
            <div
              style={{
                position: "absolute",
                left: 8,
                top: 8,
                width: 60,
                height: 60,
                borderRadius: 999,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateX(${swipe * TRACK}px)`,
                opacity: 1 - sent,
                fontSize: 26,
              }}
            >
              🗓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
