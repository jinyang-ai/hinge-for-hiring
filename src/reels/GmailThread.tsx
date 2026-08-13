// ============================================================
// A Gmail thread view - the scheduling thread every founder has actually had.
// Gmail's layout and type conventions (collapsed thread rows, avatar circles,
// Inbox chip, Reply/Forward pills) without reproducing Google's wordmark.
// Rows land one at a time so the thread visibly grows.
// ============================================================
import React from "react";
import { spring } from "remotion";
import { FPS } from "../shared/kit";

const G_TEXT = "#202124";
const G_SUB = "#5f6368";
const G_LINE = "#e8eaed";
const G_BLUE = "#1a73e8";

export type Mail = { who: string; to: string; txt: string; when: string; colour: string };

export const MAILS: Mail[] = [
  { who: "me", to: "to Sanchit", txt: "Intro call. Does Tuesday work?", when: "Mon, 9:14 AM", colour: "#1a73e8" },
  { who: "Sanchit Tripathi", to: "to me", txt: "Tuesday's tough. Wednesday?", when: "Mon, 6:40 PM", colour: "#e37400" },
  { who: "me", to: "to Sanchit", txt: "Wednesday 4pm then?", when: "Tue, 11:02 AM", colour: "#1a73e8" },
  { who: "Sanchit Tripathi", to: "to me", txt: "Sorry, can we move? Sprint demo.", when: "Wed, 8:15 AM", colour: "#e37400" },
  { who: "me", to: "to Sanchit", txt: "No problem. Resending an invite…", when: "Thu, 10:30 AM", colour: "#1a73e8" },
  { who: "Sanchit Tripathi", to: "to me", txt: "Didn't come through?", when: "Thu, 7:55 PM", colour: "#e37400" },
];

const Icon: React.FC<{ d: string; size?: number; fill?: string }> = ({ d, size = 21, fill = G_SUB }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
    <path d={d} />
  </svg>
);

const ARROW_BACK = "M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z";
const ARCHIVE = "M20.54 5.23l-1.39-1.68A1.45 1.45 0 0018 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19a2 2 0 002 2h14a2 2 0 002-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z";
const TRASH = "M6 19c0 1.1.9 2 2 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z";
const MAIL_ICON = "M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z";
const CLOCK = "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20a8 8 0 110-16 8 8 0 010 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z";
const REPLY = "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z";
const DOTS = "M12 8a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z";
const STAR = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

export const GmailThread: React.FC<{ local: number; at: (i: number) => number }> = ({ local, at }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", flexDirection: "column" }}>
    {/* toolbar */}
    <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "22px 26px 0" }}>
      <Icon d={ARROW_BACK} />
      <Icon d={ARCHIVE} />
      <Icon d={TRASH} />
      <Icon d={MAIL_ICON} />
      <Icon d={CLOCK} />
      <div style={{ marginLeft: "auto", fontSize: 13, color: G_SUB }}>1 of 2,481</div>
    </div>

    {/* subject */}
    <div style={{ padding: "20px 26px 0", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 26, color: G_TEXT, letterSpacing: "-0.005em" }}>Intro call</div>
      <div style={{ fontSize: 12, color: G_SUB, background: "#f1f3f4", borderRadius: 4, padding: "3px 8px" }}>Inbox</div>
      <div style={{ marginLeft: "auto" }}><Icon d={STAR} size={19} fill="#dadce0" /></div>
    </div>

    {/* thread rows */}
    <div style={{ marginTop: 14, flex: 1 }}>
      {MAILS.map((m, i) => {
        const s = spring({ frame: Math.max(0, local - at(i)), fps: FPS, config: { damping: 17, stiffness: 180, mass: 0.8 } });
        if (s <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "13px 26px",
              borderTop: `1px solid ${G_LINE}`,
              opacity: s,
              transform: `translateY(${(1 - s) * 16}px)`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: m.colour,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                flex: "0 0 auto",
              }}
            >
              {m.who === "me" ? "A" : "S"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: G_TEXT }}>{m.who}</span>
                <span style={{ fontSize: 12.5, color: G_SUB }}>{m.to}</span>
                <span style={{ marginLeft: "auto", fontSize: 12.5, color: G_SUB, whiteSpace: "nowrap" }}>{m.when}</span>
              </div>
              <div style={{ fontSize: 14, color: G_SUB, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.txt}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* reply / forward */}
    <div style={{ display: "flex", gap: 12, padding: "0 26px 26px", borderTop: `1px solid ${G_LINE}`, paddingTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, border: `1px solid #dadce0`, borderRadius: 999, padding: "9px 20px", color: G_SUB, fontSize: 14.5 }}>
        <Icon d={REPLY} size={17} /> Reply
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, border: `1px solid #dadce0`, borderRadius: 999, padding: "9px 20px", color: G_SUB, fontSize: 14.5 }}>
        Forward
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}><Icon d={DOTS} size={19} /></div>
    </div>
  </div>
);
