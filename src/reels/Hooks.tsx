// ============================================================
// Two performance creatives, built to be clicked rather than admired.
//
//   Mirror    - describes the viewer to themselves, then reveals that the
//               people they are not looking for are already looking at them.
//   Inversion - you do not apply, you get asked. The status flip.
//
// Two rules drive the construction:
//
//   1. FRAME ONE IS THE AD. On a muted autoplay feed most impressions never
//      reach second two, so frame zero is fully composed and completely
//      still. No fade in, no entrance. It has to hold up as a static.
//   2. NO APOSTROPHES in display copy. The brand display face carries only
//      letters, digits, space, comma and full stop, so anything else falls
//      back to another typeface mid word. The constraint makes the lines
//      blunter, which suits the brief.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, staticFile, useCurrentFrame } from "remotion";
import { Stage, CompactSlate, disp, timeline, fr, FPS, lerp, INK, PURPLE, GREEN } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { CandidateCard } from "../hinge/CandidateCard";
import { CORE_STACK, MEERA } from "./coreCast";

const BLACK = "#0B0B0D";
const CARD_SCALE = 1.24;

// the hook frame is set in the body grotesque on purpose: a headline face
// would announce itself as advertising, and this needs to read as a note.
const note = (size: number, color = INK): React.CSSProperties => ({
  fontFamily: "inherit",
  fontWeight: 600,
  fontSize: size,
  lineHeight: 1.26,
  letterSpacing: "-0.025em",
  color,
});

const label: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

// ============================================================
// THE MIRROR
// ============================================================
const M_MS = { hook: 2000, turn: 2400, proof: 3400, line: 1700, slate: 1800 };
const M_ORDER: (keyof typeof M_MS)[] = ["hook", "turn", "proof", "line", "slate"];
export const { scenes: MS, total: MIRROR_TOTAL } = timeline(M_MS, M_ORDER);

export const Mirror: React.FC = () => {
  const frame = useCurrentFrame();

  // turn
  const tl = frame - MS.turn.start;
  const strike = lerp(tl, [fr(150), fr(600)], [0, 1]);
  const they = spring({ frame: Math.max(0, tl - fr(650)), fps: FPS, config: { damping: 14, stiffness: 170, mass: 0.8 } });

  // proof: the boss side, browsing
  const pl = frame - MS.proof.start;
  const flick = (i: number) => lerp(pl, [fr(700) + i * fr(950), fr(1250) + i * fr(950)], [0, 1]);
  const labIn = lerp(pl, [fr(200), fr(560)], [0, 1]);

  // close
  const ll = frame - MS.line.start;
  const c1 = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });

  return (
    <Stage>
      {/* ---- frame one: fully composed at frame zero, no entrance ---- */}
      {frame < MS.turn.start && (
        <AbsoluteFill style={{ background: "#fff", padding: "0 58px", justifyContent: "center" }}>
          <div style={note(50)}>
            Backend engineer.
            <br />4 years.
            <br />Bengaluru.
            <br />Not looking.
          </div>
        </AbsoluteFill>
      )}

      {/* ---- the turn ---- */}
      {frame >= MS.turn.start && frame < MS.proof.start && (
        <AbsoluteFill style={{ background: "#fff", padding: "0 58px", justifyContent: "center" }}>
          <div style={{ ...note(50), opacity: 1 - strike * 0.55 }}>
            Backend engineer.
            <br />4 years.
            <br />Bengaluru.
            <br />
            <span
              style={{
                textDecoration: strike > 0.15 ? "line-through" : "none",
                textDecorationThickness: 4,
                opacity: 1 - strike * 0.35,
              }}
            >
              Not looking.
            </span>
          </div>
          <div
            style={{
              ...disp(76, { color: PURPLE, textAlign: "left" }),
              marginTop: 34,
              opacity: they,
              transform: `translateY(${(1 - they) * 18}px)`,
            }}
          >
            They are.
          </div>
        </AbsoluteFill>
      )}

      {/* ---- proof: the real boss screen, browsing engineers ---- */}
      {frame >= MS.proof.start && frame < MS.line.start && (
        <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
          {CORE_STACK.map((c, i) => {
            const f = i === CORE_STACK.length - 1 ? 0 : flick(i);
            if (f >= 1) return null;
            const depth = Math.max(0, i - (flick(0) >= 1 ? 1 : 0) - (flick(1) >= 1 ? 1 : 0));
            return (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  zIndex: 30 - i,
                  transform: `scale(${CARD_SCALE * (1 - 0.04 * depth)}) translate(${-f * 950}px, ${f * 44 + depth * 12}px) rotate(${-f * 15}deg)`,
                  opacity: 1 - Math.max(0, (f - 0.8) / 0.2),
                }}
              >
                <div style={{ position: "relative" }}>
                  <CandidateCard c={c} />
                  <ActionBar />
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", opacity: labIn }}>
            <div style={{ ...label, color: "#9a938c" }}>What the founders see</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- close ---- */}
      {frame >= MS.line.start && frame < MS.slate.start && (
        <AbsoluteFill style={{ background: BLACK, alignItems: "center", justifyContent: "center", padding: "0 54px" }}>
          <div style={{ ...disp(66, { color: "#fff" }), opacity: c1, transform: `translateY(${(1 - c1) * 16}px)` }}>
            See who is
          </div>
          <div style={{ ...disp(66, { color: PURPLE }), marginTop: 10, opacity: c1 }}>looking.</div>
        </AbsoluteFill>
      )}

      {frame >= MS.slate.start && <CompactSlate local={frame - MS.slate.start} />}
    </Stage>
  );
};

// ============================================================
// THE INVERSION
// ============================================================
const I_MS = { hook: 2000, turn: 2200, proof: 3400, line: 1600, slate: 1800 };
const I_ORDER: (keyof typeof I_MS)[] = ["hook", "turn", "proof", "line", "slate"];
export const { scenes: IS, total: INVERSION_TOTAL } = timeline(I_MS, I_ORDER);

const ASKED: Msg[] = [
  { side: "in", at: fr(300), text: "I am the founder. 9 of us, building payments infra. 20 minutes this week?", time: "8:31 PM" },
  { side: "out", at: fr(1700), typingUntil: fr(2400), text: "Friday works.", time: "8:42 PM" },
];

export const Inversion: React.FC = () => {
  const frame = useCurrentFrame();

  const tl = frame - IS.turn.start;
  const asked = spring({ frame: Math.max(0, tl - fr(250)), fps: FPS, config: { damping: 14, stiffness: 170, mass: 0.8 } });

  const pl = frame - IS.proof.start;
  const labIn = lerp(pl, [fr(2200), fr(2600)], [0, 1]);

  const ll = frame - IS.line.start;
  const c1 = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });

  return (
    <Stage bg={BLACK}>
      {/* ---- frame one: held, complete, no entrance ---- */}
      {frame < IS.turn.start && (
        <AbsoluteFill style={{ background: BLACK, padding: "0 56px", justifyContent: "center" }}>
          <div style={disp(92, { color: "#fff", textAlign: "left" })}>
            You do not
            <br />apply.
          </div>
        </AbsoluteFill>
      )}

      {/* ---- the completion ---- */}
      {frame >= IS.turn.start && frame < IS.proof.start && (
        <AbsoluteFill style={{ background: BLACK, padding: "0 56px", justifyContent: "center" }}>
          <div style={{ ...disp(92, { color: "#fff", textAlign: "left" }), opacity: 0.3 }}>
            You do not
            <br />apply.
          </div>
          <div
            style={{
              ...disp(92, { color: PURPLE, textAlign: "left" }),
              marginTop: 26,
              opacity: asked,
              transform: `translateY(${(1 - asked) * 20}px)`,
            }}
          >
            You get
            <br />asked.
          </div>
        </AbsoluteFill>
      )}

      {/* ---- proof: a real founder, in the real chat ---- */}
      {frame >= IS.proof.start && frame < IS.line.start && (
        <AbsoluteFill>
          <TalChat
            lf={pl}
            msgs={ASKED}
            name="Arjun Mehta"
            subtitle="Founder · 9 person team · Bengaluru"
            face={staticFile("reel/boss-face.jpg")}
            facePos="52% 20%"
            chips={["Setup Meet", "View profile"]}
          />
          <div style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", opacity: labIn }}>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 999, padding: "11px 24px", boxShadow: "0 10px 26px -14px rgba(20,28,48,0.4)" }}>
              <div style={{ ...label, fontSize: 14, color: GREEN }}>No recruiter. No form.</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- close ---- */}
      {frame >= IS.line.start && frame < IS.slate.start && (
        <AbsoluteFill style={{ background: BLACK, alignItems: "center", justifyContent: "center", padding: "0 54px" }}>
          <div style={{ ...disp(70, { color: "#fff" }), opacity: c1, transform: `translateY(${(1 - c1) * 16}px)` }}>Get asked</div>
          <div style={{ ...disp(70, { color: PURPLE }), marginTop: 10, opacity: c1 }}>instead.</div>
        </AbsoluteFill>
      )}

      {frame >= IS.slate.start && <CompactSlate local={frame - IS.slate.start} />}
    </Stage>
  );
};
