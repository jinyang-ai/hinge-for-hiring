// ============================================================
// The candidate's lock screen. Recruiter pings arrive as translucent,
// interchangeable frosted cards and die there; the tal BOSS message lands as
// a solid white card with a real face on it. The contrast is carried by the
// surface itself - dead glass vs a real person - before a word is read.
// ============================================================
import React from "react";
import { Img, staticFile } from "remotion";

export type Ping = { app: string; from: string; txt: string; ago: string };

const Glass: React.FC<{ p: Ping; style?: React.CSSProperties }> = ({ p, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.13)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 24,
      padding: "17px 19px",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.28)" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>{p.app}</span>
      <span style={{ marginLeft: "auto", fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{p.ago}</span>
    </div>
    <div style={{ fontSize: 19, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginTop: 9 }}>{p.from}</div>
    <div style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", marginTop: 3, lineHeight: 1.35 }}>{p.txt}</div>
  </div>
);

export const LockScreen: React.FC<{ children?: React.ReactNode; dim?: number }> = ({ children, dim = 0 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(120% 80% at 30% 8%, #3b3550 0%, #262233 42%, #17151f 100%)",
      overflow: "hidden",
    }}
  >
    {/* clock */}
    <div style={{ paddingTop: 74, textAlign: "center", opacity: 1 - dim * 0.55 }}>
      <div style={{ fontSize: 21, color: "rgba(255,255,255,0.72)", fontWeight: 500 }}>Wednesday, 12 August</div>
      <div style={{ fontSize: 104, color: "#fff", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 2 }}>9:41</div>
    </div>
    {children}
  </div>
);

export const GlassPing = Glass;

// the one that is not glass
export const TalPing: React.FC<{ msg: string; style?: React.CSSProperties }> = ({ msg, style }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 26,
      padding: "20px 22px",
      boxShadow: "0 26px 60px -20px rgba(0,0,0,0.7)",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
      <Img src={staticFile("reel/tal-boss-wordmark-dark.png")} style={{ height: 27, width: "auto", display: "block" }} />
      <span style={{ marginLeft: "auto", fontSize: 15, color: "#a9a29b" }}>now</span>
    </div>
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <Img
        src={staticFile("reel/boss-face.jpg")}
        style={{ width: 58, height: 58, borderRadius: 999, objectFit: "cover", objectPosition: "52% 20%", flex: "0 0 auto" }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#141414" }}>
          Arjun <span style={{ fontWeight: 500, color: "#6c6c70" }}>· Founder</span>
        </div>
        <div style={{ fontSize: 19, color: "#3a3a3f", marginTop: 5, lineHeight: 1.42 }}>{msg}</div>
      </div>
    </div>
  </div>
);
