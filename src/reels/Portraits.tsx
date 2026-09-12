// ============================================================
// THE ROOM - a portrait series.
//
// No app, no UI, no interface. Just the people who are actually on tal BOSS,
// full bleed, in black and white, held long enough to look at. The product is
// access to these people, so the people are the film.
//
// Black and white is doing real work here: the photographs were taken in
// wildly different light, and monochrome is what makes six of them read as
// one series rather than six stock images.
//
// Ends on the mark. No claim, no argument.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Stage, CompactSlate, timeline, fr, lerp } from "../shared/kit";

const BLACK = "#0B0B0D";
const WHITE = "#FFFFFF";

type Portrait = { src: string; pos: string; name: string; meta: string };

const PEOPLE: Portrait[] = [
  { src: "reel/cand-meera.jpg", pos: "46% 26%", name: "Meera Iyer", meta: "Backend · CRED" },
  { src: "reel/cand-karthik.jpg", pos: "36% 30%", name: "Karthik Rao", meta: "AI · Groww" },
  { src: "reel/person2.jpg", pos: "48% 24%", name: "Priya M.", meta: "Platform · Meesho" },
  { src: "reel/cand-aditya.jpg", pos: "52% 24%", name: "Aditya Nair", meta: "Systems · Zerodha" },
  { src: "reel/person1.jpg", pos: "44% 26%", name: "Ananya S.", meta: "ML · ShareChat" },
  { src: "reel/person3.jpg", pos: "50% 26%", name: "Rohan K.", meta: "Payments · PhonePe" },
];

const HOLD = fr(1300); // per portrait
const LEAD = fr(500); // a beat of black before the first face

const MS = { room: 500 + PEOPLE.length * 1300, slate: 1900 };
const ORDER: (keyof typeof MS)[] = ["room", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const Frame: React.FC<{ p: Portrait; local: number }> = ({ p, local }) => {
  // cross-dissolve in, hold, dissolve out under the next one
  const inOp = lerp(local, [0, fr(420)], [0, 1]);
  const outOp = lerp(local, [HOLD - fr(300), HOLD], [1, 0]);
  // the slowest possible drift, so it breathes without moving
  const zoom = lerp(local, [0, HOLD + fr(300)], [1.07, 1.0], (t) => t);
  const typeIn = lerp(local, [fr(260), fr(680)], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: inOp * outOp }}>
      <Img
        src={staticFile(p.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: p.pos,
          transform: `scale(${zoom})`,
          filter: "grayscale(1) contrast(1.06) brightness(1.02)",
        }}
      />
      {/* just enough scrim to hold the type */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(11,11,13,0.28) 0%, rgba(11,11,13,0) 26%, rgba(11,11,13,0) 52%, rgba(11,11,13,0.82) 100%)`,
        }}
      />
      <div style={{ position: "absolute", left: 52, bottom: 62, opacity: typeIn, transform: `translateY(${(1 - typeIn) * 10}px)` }}>
        <div style={{ fontSize: 42, fontWeight: 600, color: WHITE, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{p.name}</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: WHITE,
            opacity: 0.66,
            letterSpacing: "0.17em",
            textTransform: "uppercase",
            marginTop: 12,
          }}
        >
          {p.meta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Portraits: React.FC = () => {
  const frame = useCurrentFrame();
  const roomOut = lerp(frame, [S.room.end - fr(340), S.room.end], [1, 0]);

  return (
    <Stage bg={BLACK}>
      {frame < S.slate.start && (
        <AbsoluteFill style={{ opacity: roomOut, background: BLACK }}>
          {PEOPLE.map((p, i) => {
            const start = LEAD + i * HOLD;
            const local = frame - start;
            if (local < -fr(420) || local > HOLD + fr(60)) return null;
            return <Frame key={i} p={p} local={local} />;
          })}
        </AbsoluteFill>
      )}
      {/* black to white: both brand colours, and the mark lands hard */}
      {frame >= S.slate.start && <CompactSlate local={frame - S.slate.start} />}
    </Stage>
  );
};
