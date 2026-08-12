// ============================================================
// The mechanic. One card, two faces:
//   front — greyscale, "Not open to offers", a NOT LOOKING stamp
//   back  — full colour, a green "Open to meet" pill
// rotateY carries it from one to the other; backface-visibility means the
// colour returns exactly at the 90° turn, so the flip IS the reveal.
// ============================================================
import React from "react";
import { CARD_W, CARD_H } from "./timing";
import { CandidateCard } from "../hinge/CandidateCard";
import { type Candidate } from "../hinge/data";

export const Stamp: React.FC<{ text: string; scale?: number; rot?: number; top?: string; opacity?: number }> = ({
  text,
  scale = 1,
  rot = -13,
  top = "34%",
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: "50%",
      transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
      fontFamily: "var(--font-anton), sans-serif",
      fontWeight: 700,
      textTransform: "uppercase",
      fontSize: 40,
      letterSpacing: "0.01em",
      color: "#7A736C",
      border: "5px solid #7A736C",
      borderRadius: 10,
      padding: "6px 18px",
      background: "rgba(255,255,255,0.72)",
      whiteSpace: "nowrap",
      opacity,
      zIndex: 30,
    }}
  >
    {text}
  </div>
);

// `turn` is degrees: 0 = closed/grey face, 180 = open/colour face.
export const FlipCard: React.FC<{
  closed: Candidate;
  open: Candidate;
  turn: number;
  stampText?: string;
  stampOpacity?: number;
  stampDrop?: number;
}> = ({ closed, open, turn, stampText, stampOpacity = 1, stampDrop = 0 }) => (
  <div style={{ perspective: 1400, width: CARD_W, height: CARD_H }}>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        transform: `rotateY(${turn}deg)`,
      }}
    >
      {/* closed face — drained of colour */}
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
        <div style={{ filter: "grayscale(1) contrast(0.9) brightness(1.06)" }}>
          <CandidateCard c={closed} />
        </div>
        {stampText && stampOpacity > 0 && (
          <div style={{ transform: `translateY(${stampDrop}px) rotate(${stampDrop * 0.06}deg)` }}>
            <Stamp text={stampText} opacity={stampOpacity} />
          </div>
        )}
      </div>

      {/* open face — full colour */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <CandidateCard c={open} />
      </div>
    </div>
  </div>
);
