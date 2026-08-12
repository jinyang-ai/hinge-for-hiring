// ============================================================
// Scene 2 (4:5) — "Chat with your next boss, directly". A compact headline
// drops in; a stack of boss cards auto-swipes (three rejected, Aryan settles).
// Then the settled card expands to FILL WIDTH (becoming a 720-wide phone
// viewport) while the profile scrolls to the "what will you be working on now?"
// prompt; the Reply is pressed and the chat fades in full-frame.
// stackVisual() / press() ported from the 9:16 reel; only geometry differs.
// ============================================================
import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";
import {
  SCENES,
  f,
  REEL_W,
  CARD_W,
  CARD_H,
  CARD_SCALE,
  CARD_SCALE_FULL,
  CARD_LEFT,
  CARD_TOP,
  CARD_RISE_START,
  CARD_RISE_FROM,
  PROMOTE,
  REJECT_DUR,
  rejectBeats,
  EXPAND_START,
  EXPAND_MS_F,
  SCROLL_TARGET,
  REPLY_PRESS,
  CHAT_OPEN_START,
  CHAT_OPEN_MS_F,
  PRESS_FRAMES,
  BROWSE_MS_F,
  BROWSE_PX,
} from "./timing";
import { stack } from "./data";
import { Profile } from "./Profile";
import { ChatScreen } from "./ChatScreen";
import * as Ic from "./icons2";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerpF = (frame: number, i: number[], o: number[], easing = EASE) =>
  interpolate(frame, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// press() dip — ported.
const press = (frame: number, pf: number) => {
  const t = frame - pf;
  if (t < 0 || t > PRESS_FRAMES) return 1;
  return 1 - 0.16 * Math.sin((t / PRESS_FRAMES) * Math.PI);
};

const HERO_IDX = stack.length - 1;
// one reject beat per non-hero (browsed) card in the stack
const rejBeats = rejectBeats(HERO_IDX);

// each dismissed candidate auto-scrolls (browses) its rich profile in the beat
// before it gets flicked off — so the reel reads as "a lot is happening".
function browseScroll(i: number, lf: number): number {
  const end = rejBeats[i] - f(140);
  return interpolate(lf, [end - BROWSE_MS_F, end], [0, BROWSE_PX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

// stackVisual() — ported; reject translate is native card px (cleared after scale).
function stackVisual(i: number, lf: number) {
  const isHero = i === HERO_IDX;
  if (!isHero && lf >= rejBeats[i]) {
    const s = rejBeats[i];
    const d = REJECT_DUR;
    const e = lerpF(lf, [s, s + d], [0, 1], EASE);
    const opacity = lerpF(lf, [s + d * 0.7, s + d], [1, 0]);
    return { transform: `translate(${-880 * e}px, ${34 * e}px) rotate(${-15 * e}deg)`, opacity, z: 200 };
  }
  let pos = i;
  for (let j = 0; j < i && j < HERO_IDX; j++) pos -= clamp((lf - rejBeats[j]) / PROMOTE, 0, 1);
  pos = Math.max(pos, 0);
  return {
    transform: `translateY(${pos * 13}px) scale(${1 - 0.05 * pos})`,
    opacity: pos > 2 ? clamp(1 - (pos - 2), 0, 1) : 1,
    z: Math.round(100 - pos * 10),
  };
}

export const Stack: React.FC<{ frame: number }> = ({ frame }) => {
  const lf = frame - SCENES.chat.start; // local frame (negative during the overlap)

  // stack rises from below the frame on entry
  const riseY = interpolate(lf, [CARD_RISE_START, CARD_RISE_START + f(380)], [CARD_RISE_FROM, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ✕ presses with a frosted-glass effect on every reject
  const xPress = Math.min(...rejBeats.map((b) => press(lf, b)));
  const glass = Math.max(
    ...rejBeats.map((b) => {
      const t = lf - b;
      if (t < 0 || t > PRESS_FRAMES + 7) return 0;
      return t < PRESS_FRAMES ? Math.min(1, t / 2) : 1 - (t - PRESS_FRAMES) / 7;
    }),
  );

  // expand: card grows to fill width + pins to top; profile scrolls to the prompt.
  const expand = interpolate(lf, [EXPAND_START, EXPAND_START + EXPAND_MS_F], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const scroll = expand * SCROLL_TARGET;
  const barFade = interpolate(lf, [EXPAND_START, EXPAND_START + f(220)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const replyPress = press(lf, REPLY_PRESS);

  // card-group geometry: floating (centred) → full-width (pinned top)
  const cScale = interpolate(expand, [0, 1], [CARD_SCALE, CARD_SCALE_FULL]);
  const fLeft = interpolate(expand, [0, 1], [CARD_LEFT, 0]);
  const fTop = interpolate(expand, [0, 1], [CARD_TOP, 0]);
  const cardRadiusNative = 30 * (1 - expand); // native px (rendered = ×cScale)

  // chat fades in full-frame over the expanded card
  const chatFade = interpolate(lf, [CHAT_OPEN_START, CHAT_OPEN_START + CHAT_OPEN_MS_F], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chatSlide = (1 - chatFade) * 90; // gentle iOS-style push from the right

  return (
    <AbsoluteFill>
      {/* the "Hinge for hiring" lockup (headline) is rendered at the top level */}

      {/* card group — floats during the swipe, then grows to full-width */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: CARD_W,
          height: CARD_H,
          transformOrigin: "top left",
          transform: `translate(${fLeft}px, ${fTop}px) scale(${cScale})`,
          zIndex: 10,
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${riseY}px)`, willChange: "transform" }}>
          {stack.map((b, i) => {
            const v = stackVisual(i, lf);
            const isHero = i === HERO_IDX;
            return (
              <div
                key={b.id}
                style={{ position: "absolute", inset: 0, transform: v.transform, opacity: v.opacity, zIndex: v.z, filter: expand > 0.02 ? "none" : "drop-shadow(0 16px 34px rgba(20,28,48,0.16))" }}
              >
                <Profile
                  c={b}
                  scroll={isHero ? scroll : browseScroll(i, lf)}
                  replyPress={isHero ? replyPress : 1}
                  radius={cardRadiusNative}
                />
              </div>
            );
          })}

          {/* floating action bar — fades out as the profile scrolls to the segment */}
          <div className="r245-actions" style={{ opacity: barFade, pointerEvents: "none" }}>
            <div
              className="r245-x"
              style={{
                transform: `scale(${xPress})`,
                background: `rgba(${255 - 42 * glass}, ${255 - 40 * glass}, ${255 - 30 * glass}, ${1 - 0.3 * glass})`,
                boxShadow: `0 6px 18px rgba(40,30,20,0.12), 0 0 0 ${6 * glass}px rgba(180,185,200,0.16)`,
              }}
            >
              <Ic.Cross />
            </div>
            <div className="r245-pill">
              <div className="seg">
                <img src={staticFile("reel/icon-resume.png")} style={{ width: 23, height: 23 }} alt="" />
                <span>Request resume</span>
              </div>
              <div className="seg">
                <Ic.DM />
                <span>Reply</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the chat opens full-frame over the expanded card */}
      {lf >= CHAT_OPEN_START && (
        <div style={{ position: "absolute", inset: 0, zIndex: 500, opacity: chatFade, transform: `translateX(${chatSlide}px)` }}>
          <ChatScreen lf={lf} />
        </div>
      )}
    </AbsoluteFill>
  );
};
