// ============================================================
// Scene 1 — the poster (4:5). "NO" lands once, centred, and holds. Under
// it, on a fixed baseline, one middleman-noun at a time is revealed and
// flicked off with the same reject motion as the boss cards. The dwell is
// fast (rapid-fire). After the last noun holds, the whole poster rides up
// and off the top so scene 2 can rise into place.
// ============================================================
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { OBVIOUSLY, obviouslyReady } from "./fonts";
import {
  SCENES,
  REEL_H,
  f,
  MEASURE,
  LEADING,
  TRACKING,
  INK,
  SIZE_CAP,
  SIZE_FALLBACK,
  WORD_FROM,
  S1,
  flickMs,
  flickAtMs,
  revealAtMs,
} from "./timing";
import { NOUNS } from "./data";

const SNAP = Easing.bezier(0.16, 1, 0.3, 1);
const EASE = Easing.bezier(0.22, 1, 0.36, 1); // same as the card reject
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// NO micro-dip on every flick (2.2% over ~100ms) — reads as the word working.
const nudge = (frame: number, at: number, dur = f(100)) => {
  const t = frame - at;
  if (t < 0 || t > dur) return 1;
  return 1 - 0.022 * Math.sin((t / dur) * Math.PI);
};

export const Title: React.FC<{ frame: number }> = ({ frame }) => {
  const { start } = SCENES.title;
  const scene2Start = SCENES.chat.start;

  // one size for NO and every noun, set by the widest noun. Gate on the font
  // being resident so Studio and headless render agree.
  const [handle] = useState(() => delayRender("fit poster to widest noun"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    obviouslyReady.then(() => {
      if (alive) {
        setReady(true);
        continueRender(handle);
      }
    });
    return () => {
      alive = false;
    };
  }, [handle]);

  const SIZE = ready
    ? Math.min(
        ...NOUNS.map((n) => fitText({ text: n, withinWidth: MEASURE, fontFamily: OBVIOUSLY, fontWeight: 700, textTransform: "uppercase", validateFontIsLoaded: false }).fontSize),
        SIZE_CAP,
      )
    : SIZE_FALLBACK;

  // centre the two-line block (NO + noun) in the frame
  const lineH = SIZE * LEADING;
  const NO_TOP = Math.round((REEL_H - 2 * lineH) / 2);
  const NOUN_TOP = NO_TOP + lineH;

  // NO + the last word rise fully off the top BEFORE scene 2 enters.
  const noExitY = interpolate(frame, [scene2Start - f(S1.noExit), scene2Start], [0, -(NOUN_TOP + SIZE * 1.35)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  if (frame >= scene2Start) return null;

  // NO: drops in out of its mask, then holds; micro-dips on every flick
  const noY = interpolate(frame, [start, start + f(S1.noIn)], [WORD_FROM, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SNAP,
  });
  // only the first three flick (the last word holds), so NO nudges 3 times
  const noNudge = Math.min(...NOUNS.slice(0, -1).map((_, i) => nudge(frame, start + f(flickAtMs(i)))));

  const wordStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: OBVIOUSLY,
    fontWeight: 700,
    fontSize: SIZE,
    lineHeight: LEADING,
    letterSpacing: TRACKING,
    textTransform: "uppercase",
    color: INK,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill>
      {/* whole poster rides up and off the top on exit */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${noExitY}px)` }}>
        {/* NO — masked line, drops in and holds still (centred) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: NO_TOP, height: lineH, overflow: "hidden", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: OBVIOUSLY, fontWeight: 700, fontSize: SIZE, lineHeight: LEADING, letterSpacing: TRACKING, textTransform: "uppercase", color: INK, whiteSpace: "nowrap", transform: `translateY(${noY}%) scaleY(${noNudge})`, transformOrigin: "center top" }}>
            NO
          </div>
        </div>

        {/* nouns — unclipped so the flick leaves frame; stacked on the baseline */}
        <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {NOUNS.map((n, i) => {
            const revealF = start + f(revealAtMs(i));
            const flickF = start + f(flickAtMs(i));
            const localReveal = frame - revealF;
            const localFlick = frame - flickF;

            if (localReveal < 0) return null; // not yet revealed

            const isLast = i === NOUNS.length - 1;
            let transform = "translateY(0px)";
            let opacity = 1;
            if (localFlick >= 0 && !isLast) {
              // flicking off — ported reject motion (−820 clears frame; −7° tilt)
              const d = f(flickMs(i));
              const e = interpolate(localFlick, [0, d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
              transform = `translate(${-820 * e}px, ${16 * e}px) rotate(${-7 * e}deg)`;
              opacity = interpolate(localFlick, [d * 0.6, d], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            } else {
              // revealed: opacity 0→1, translateY 10→0 over ~120ms, then static
              const r = clamp(localReveal / f(120), 0, 1);
              transform = `translateY(${(1 - r) * 10}px)`;
              opacity = r;
            }

            return (
              <div key={n} style={{ ...wordStyle, top: NOUN_TOP, transform, opacity, transformOrigin: "center" }}>
                {n}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
