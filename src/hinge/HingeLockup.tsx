// ============================================================
// The "Hinge for hiring" brand lockup — the opener AND the persistent
// headline. It rises up from below into the centre (hero beat), holds,
// then travels up to settle at the top just as the candidate cards rise
// in. Fades out as the hero card expands to full-frame.
// One element on the global frame → the whole move is continuous.
// ============================================================
import React from "react";
import { Easing, interpolate } from "remotion";
import { SCENES, f, HEAD_TOP, EXPAND_START, EXPAND_MS_F } from "./timing";

const clampE = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// vertical drop from the resting (top) position to the centred hero position
const CENTER_DROP = 336;

export const HingeLockup: React.FC<{ frame: number }> = ({ frame }) => {
  // entrance: rise up from below + fade in
  const enterExtra = interpolate(frame, [0, f(650)], [150, 0], { ...clampE, easing: Easing.out(Easing.cubic) });
  const enterFade = interpolate(frame, [0, f(360)], [0, 1], clampE);
  // "for hiring" descriptor arrives a beat after the wordmark
  const p2 = interpolate(frame, [f(180), f(600)], [0, 1], { ...clampE, easing: Easing.out(Easing.cubic) });

  // settle: centre → top, scaling the hero size down to the headline size,
  // finishing exactly as scene 2 (the card stack) begins.
  const settle = interpolate(frame, [f(1000), SCENES.chat.start], [0, 1], { ...clampE, easing: Easing.inOut(Easing.cubic) });
  const offsetY = CENTER_DROP * (1 - settle) + enterExtra;
  const scale = 1.5 - 0.5 * settle; // 1.5 hero → 1.0 headline

  // fade out as the card expands to full-frame (so it never shows through)
  const expandStart = SCENES.chat.start + EXPAND_START;
  const expandFade = interpolate(frame, [expandStart, expandStart + EXPAND_MS_F], [1, 0], clampE);

  return (
    <div
      className="r245-head"
      style={{
        top: HEAD_TOP,
        opacity: enterFade * expandFade,
        transform: `translateY(${offsetY}px) scale(${scale})`,
        transformOrigin: "center top",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 56,
          lineHeight: 1,
          color: "#141414",
          letterSpacing: "-0.015em",
        }}
      >
        Hinge
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 14.5,
          lineHeight: 1,
          letterSpacing: "0.44em",
          textTransform: "uppercase",
          color: "#a2a2a8",
          marginTop: 9,
          paddingLeft: "0.44em",
          opacity: p2,
        }}
      >
        for hiring
      </div>
    </div>
  );
};
