// ============================================================
// The message set. Three short films, one line each, all extending the
// existing positioning rather than inventing new: direct boss-to-engineer,
// no recruiters, no applications, Bangalore only.
//
//   OnTap          "Bangalore's best engineers. On tap."
//   GoodOnes       "The good ones don't apply. They're here."
//   BangaloreHires "Bangalore hires here."
//
// All under 10s so each works as a GIF.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame } from "remotion";
import { Stage, CompactSlate, disp, timeline, fr, FPS, lerp, INK, PURPLE, MUTED } from "../shared/kit";
import { CandidateCard } from "../hinge/CandidateCard";
import { Marquee } from "../wall/Marquee";
import { hero, dismissed, type Candidate } from "../hinge/data";
import { KARTHIK, ADITYA, MEERA } from "./coreCast";

const CREAM = "#F5EFE7";

// everyone we can show, all currently employed somewhere good
const POOL: Candidate[] = [MEERA, KARTHIK, dismissed[0], ADITYA, hero, dismissed[1], dismissed[2]];

// ---------- shared closer ----------
const Line: React.FC<{ local: number; a: string; b: string; onInk?: boolean }> = ({ local, a, b, onInk }) => {
  const s1 = spring({ frame: Math.max(0, local), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });
  const s2 = spring({ frame: Math.max(0, local - fr(260)), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 54px",
        background: onInk ? INK : "#fff",
      }}
    >
      <div style={{ ...disp(58, { color: onInk ? CREAM : INK }), opacity: s1, transform: `translateY(${(1 - s1) * 16}px)` }}>{a}</div>
      <div style={{ ...disp(58, { color: PURPLE }), marginTop: 14, opacity: s2, transform: `translateY(${(1 - s2) * 16}px)` }}>{b}</div>
    </AbsoluteFill>
  );
};

// ============================================================
// 1 - ON TAP
// One card at a time, tapped through at speed. The pun is the point:
// "tap" is the gesture, "on tap" is the availability.
// ============================================================
const TAP_MS = { taps: 4200, line: 1800, slate: 1700 };
const TAP_ORDER: (keyof typeof TAP_MS)[] = ["taps", "line", "slate"];
export const { scenes: TS, total: TAP_TOTAL } = timeline(TAP_MS, TAP_ORDER);

const EVERY = fr(600); // one card per tap

export const OnTap: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(POOL.length - 1, Math.floor(frame / EVERY));
  const into = frame - idx * EVERY; // frames since this card landed

  // the card snaps in on the tap, then holds
  const land = spring({ frame: Math.max(0, into), fps: FPS, config: { damping: 18, stiffness: 320, mass: 0.5 } });
  // a ripple where the thumb hit
  const ripple = lerp(into, [0, fr(420)], [0, 1]);

  return (
    <Stage>
      {frame < TS.line.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", transform: `scale(${1.24 * (0.97 + 0.03 * land)})` }}>
            <CandidateCard c={POOL[idx]} />
          </div>
          {/* tap ripple */}
          {ripple < 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 88,
                width: 120,
                height: 120,
                borderRadius: 999,
                border: `5px solid ${PURPLE}`,
                background: `rgba(139,76,216,${(1 - ripple) * 0.12})`,
                opacity: Math.min(1, (1 - ripple) * 1.6),
                transform: `scale(${0.3 + ripple * 1.7})`,
              }}
            />
          )}
        </AbsoluteFill>
      )}
      {frame >= TS.line.start && frame < TS.slate.start && (
        <Line local={frame - TS.line.start} a="Bangalore's best engineers." b="On tap." />
      )}
      {frame >= TS.slate.start && <CompactSlate local={frame - TS.slate.start} />}
    </Stage>
  );
};

// ============================================================
// 2 - THE GOOD ONES DON'T APPLY
// The proof is the profiles: every one of them already has a good job.
// Nobody here sent you a resume.
// ============================================================
const GOOD_MS = { list: 4400, line: 1900, slate: 1700 };
const GOOD_ORDER: (keyof typeof GOOD_MS)[] = ["list", "line", "slate"];
export const { scenes: GS, total: GOOD_TOTAL } = timeline(GOOD_MS, GOOD_ORDER);

const EMPLOYED = POOL.map((c) => ({
  face: c.facePhoto,
  pos: c.heroPos ?? "50% 26%",
  name: c.name,
  role: c.role.split(" · ")[0],
  logo: c.xps[0].logo,
  at: c.xps[0].company,
}));

const Row: React.FC<{ r: (typeof EMPLOYED)[number] }> = ({ r }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: "#fff",
      border: "1px solid #ece8e3",
      borderRadius: 20,
      padding: "16px 20px",
      boxShadow: "0 10px 26px -18px rgba(20,28,48,0.4)",
    }}
  >
    <Img src={r.face} style={{ width: 64, height: 64, borderRadius: 999, objectFit: "cover", objectPosition: r.pos, flex: "0 0 auto" }} />
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: 25, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>{r.name}</div>
      <div style={{ fontSize: 18, color: MUTED, marginTop: 2 }}>{r.role}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
      {r.logo && <Img src={r.logo} style={{ width: 38, height: 38, borderRadius: 9, objectFit: "contain", background: "#fff" }} />}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, color: "#b3aca5", fontWeight: 600, letterSpacing: "0.06em" }}>CURRENTLY AT</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>{r.at}</div>
      </div>
    </div>
  </div>
);

export const GoodOnes: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = lerp(frame, [fr(200), GS.list.dur + fr(200)], [0, 560], (t) => t);
  const fade = lerp(frame, [GS.list.end - fr(320), GS.list.end], [1, 0]);

  return (
    <Stage>
      {frame < GS.line.start && (
        <AbsoluteFill style={{ opacity: fade }}>
          <div
            style={{
              position: "absolute",
              left: 34,
              right: 34,
              top: 90,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transform: `translateY(${-scroll}px)`,
            }}
          >
            {[...EMPLOYED, ...EMPLOYED].map((r, i) => (
              <Row key={i} r={r} />
            ))}
          </div>
          {/* soften the ends so the column reads as a longer list */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(180deg,#fff 0%,rgba(255,255,255,0) 12%,rgba(255,255,255,0) 82%,#fff 97%)",
              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      )}
      {frame >= GS.line.start && frame < GS.slate.start && (
        <Line local={frame - GS.line.start} a="The good ones don't apply." b="They're here." />
      )}
      {frame >= GS.slate.start && <CompactSlate local={frame - GS.slate.start} />}
    </Stage>
  );
};

// ============================================================
// 3 - BANGALORE HIRES HERE
// Both sides of the market, moving past each other: the people doing the
// hiring in one lane, the people worth hiring in the other.
// ============================================================
const BLR_MS = { lanes: 4400, line: 1900, slate: 1700 };
const BLR_ORDER: (keyof typeof BLR_MS)[] = ["lanes", "line", "slate"];
export const { scenes: BS, total: BLR_TOTAL } = timeline(BLR_MS, BLR_ORDER);

// the boss side: tech and product leadership across Bangalore
const BOSSES = [
  "VP Engineering, Razorpay",
  "Head of Product, Swiggy",
  "Director of Engineering, CRED",
  "CTO, Zepto",
  "Head of Platform, PhonePe",
  "VP Product, Meesho",
  "Head of AI, Groww",
  "Director of Engineering, Zerodha",
  "VP Engineering, ShareChat",
  "Head of Design, Flipkart",
];

// the engineer side: where they work now
const ENGINEERS = [
  "Backend, CRED",
  "AI, Groww",
  "Platform, Zerodha",
  "Infra, Razorpay",
  "Android, Swiggy",
  "ML, ShareChat",
  "Payments, PhonePe",
  "Data, Meesho",
  "Frontend, Zepto",
  "Systems, Flipkart",
];

const Lane: React.FC<{ items: string[]; dir: 1 | -1; speed: number; accent?: boolean }> = ({ items, dir, speed, accent }) => (
  <div style={{ height: 74, display: "flex", alignItems: "center" }}>
    <Marquee speed={speed} direction={dir} startOffset={0}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: accent ? PURPLE : CREAM,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </span>
          <span style={{ color: CREAM, opacity: 0.28, padding: "0 22px", fontSize: 34 }}>·</span>
        </div>
      ))}
    </Marquee>
  </div>
);

export const BangaloreHires: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = lerp(frame, [0, fr(400)], [0, 1]);
  const out = lerp(frame, [BS.lanes.end - fr(320), BS.lanes.end], [1, 0]);
  const label = (t: string, o: number) => (
    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.14em", color: CREAM, opacity: o }}>{t}</div>
  );

  return (
    <Stage bg={INK}>
      {frame < BS.line.start && (
        <AbsoluteFill
          style={{
            opacity: fade * out,
            justifyContent: "center",
            gap: 22,
            maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
            WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
          }}
        >
          <div style={{ paddingLeft: 44 }}>{label("HIRING", 0.45)}</div>
          <Lane items={BOSSES} dir={-1} speed={1.5} accent />
          <Lane items={BOSSES.slice(4).concat(BOSSES.slice(0, 4))} dir={-1} speed={1.15} accent />
          <Lane items={BOSSES.slice(7).concat(BOSSES.slice(0, 7))} dir={-1} speed={1.75} accent />
          <div style={{ paddingLeft: 44, marginTop: 22 }}>{label("HIREABLE", 0.45)}</div>
          <Lane items={ENGINEERS} dir={1} speed={1.35} />
          <Lane items={ENGINEERS.slice(5).concat(ENGINEERS.slice(0, 5))} dir={1} speed={1.7} />
          <Lane items={ENGINEERS.slice(3).concat(ENGINEERS.slice(0, 3))} dir={1} speed={1.1} />
        </AbsoluteFill>
      )}
      {frame >= BS.line.start && frame < BS.slate.start && (
        <Line local={frame - BS.line.start} a="Bangalore hires" b="here." onInk />
      )}
      {frame >= BS.slate.start && <CompactSlate local={frame - BS.slate.start} />}
    </Stage>
  );
};
