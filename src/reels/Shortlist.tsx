// ============================================================
// "You don't search. The shortlist is the app." - the Discover loop.
// Claim: ten right people beats ten thousand results.
// search: a query returns 10,247 rows of grey nobody will ever read →
// deck: the same need, answered as ten cards already matched on stack, CTC
// and location, each stamped Top 1% for you.
// ============================================================
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, Img, staticFile } from "remotion";
import { Stage, Slate, disp, timeline, fr, FPS, lerp, clampE, INK, PURPLE, GREEN, MUTED } from "../shared/kit";
import { CandidateCard } from "../hinge/CandidateCard";
import { hero, dismissed, type Candidate } from "../hinge/data";

const MS = { search: 2200, results: 3800, question: 2400, deck: 4400, line: 2200, slate: 2300 };
const ORDER: (keyof typeof MS)[] = ["search", "results", "question", "deck", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const QUERY = "backend engineer bangalore";

// the shortlist, in the real app UI - three cards fanned, the hero forward
const DECK: Candidate[] = [
  { ...dismissed[0], intent: "Open to meet · this week" },
  { ...hero, intent: "Open to meet · this week" },
  { ...dismissed[2], intent: "Open to meet · this week" },
];

export const Shortlist: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- the search box types ----
  const sl = frame;
  const typed = QUERY.slice(0, Math.round(QUERY.length * interpolate(sl, [fr(400), fr(1750)], [0, 1], clampE)));
  const caret = sl > fr(400) && sl < fr(1800);

  // ---- results flood ----
  const rl = frame - S.results.start;
  const count = Math.round(interpolate(rl, [0, fr(1400)], [0, 10247], clampE));
  const scroll = lerp(rl, [fr(500), S.results.dur + fr(400)], [0, 2100], (t) => t);
  const resultsOut = lerp(frame, [S.question.end - fr(280), S.question.end], [1, 0]);

  // ---- the question ----
  const ql = frame - S.question.start;
  const qIn = spring({ frame: Math.max(0, ql), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.9 } });

  // ---- the deck ----
  const dl = frame - S.deck.start;
  const cardAt = (i: number) => fr(250) + i * fr(380);

  // ---- line ----
  const ll = frame - S.line.start;
  const lIn = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 150, mass: 0.9 } });

  return (
    <Stage>
      {/* ---------- search + results ---------- */}
      {frame < S.deck.start && (
        <AbsoluteFill style={{ opacity: resultsOut }}>
          {/* the search bar */}
          <div style={{ position: "absolute", top: 74, left: 44, right: 44, zIndex: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, border: "1.5px solid #dcdce2", borderRadius: 999, padding: "17px 24px", background: "#fff", boxShadow: "0 6px 20px -12px rgba(20,28,48,0.4)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#9a9aa2"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
              <span style={{ fontSize: 21, color: INK }}>{typed}</span>
              {caret && <span style={{ width: 2, height: 24, background: PURPLE, display: "inline-block" }} />}
            </div>
            {frame >= S.results.start && (
              <div style={{ fontSize: 17, color: MUTED, marginTop: 16, paddingLeft: 6, fontVariantNumeric: "tabular-nums" }}>
                About <b style={{ color: INK }}>{count.toLocaleString("en-IN")}</b> results
              </div>
            )}
          </div>

          {/* the grey wall of results */}
          {frame >= S.results.start && (
            <div style={{ position: "absolute", top: 196, left: 0, right: 0, bottom: 0, overflow: "hidden", maskImage: "linear-gradient(180deg,#000 0%,#000 72%,transparent 100%)", WebkitMaskImage: "linear-gradient(180deg,#000 0%,#000 72%,transparent 100%)" }}>
              <div style={{ transform: `translateY(${-scroll}px)`, padding: "10px 44px" }}>
                {Array.from({ length: 40 }, (_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f0f0f3" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 999, background: "#e4e4e9", flex: "0 0 auto" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 11, width: `${44 + ((i * 37) % 40)}%`, borderRadius: 99, background: "#dedee4" }} />
                      <div style={{ height: 9, width: `${28 + ((i * 53) % 34)}%`, borderRadius: 99, background: "#ececf0", marginTop: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* the question that kills it */}
          {frame >= S.question.start && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 60 }}>
              <div style={{ background: "rgba(255,255,255,0.94)", padding: "34px 30px", borderRadius: 20, opacity: qIn, transform: `scale(${0.9 + 0.1 * qIn})` }}>
                <div style={disp(50)}>Which ten do you</div>
                <div style={disp(50, { color: PURPLE })}>actually talk to</div>
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ---------- the shortlist ---------- */}
      {frame >= S.deck.start && frame < S.line.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {/* the real deck - three app cards fanned, the Top 1% one forward */}
          <div style={{ position: "relative", width: 720, height: 620, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {DECK.map((c, i) => {
              const s = spring({ frame: Math.max(0, dl - cardAt(i)), fps: FPS, config: { damping: 16, stiffness: 130, mass: 0.9 } });
              if (s <= 0.001) return null;
              const spread = [-168, 0, 168][i];
              const tilt = [-8, 0, 8][i];
              const scale = i === 1 ? 0.86 : 0.72;
              return (
                <div
                  key={c.id}
                  style={{
                    position: "absolute",
                    zIndex: i === 1 ? 20 : 10,
                    transform: `translate(${spread * s}px, ${(1 - s) * 90}px) rotate(${tilt * s}deg) scale(${scale * (0.9 + 0.1 * s)})`,
                    opacity: s,
                    filter: "drop-shadow(0 18px 38px rgba(20,28,48,0.22))",
                  }}
                >
                  <CandidateCard c={c} />
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", bottom: 96, left: 0, right: 0, textAlign: "center", opacity: lerp(dl, [fr(1700), fr(2100)], [0, 1]), padding: "0 60px" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: INK, letterSpacing: "-0.015em" }}>
              Ten people. Matched on stack, salary and city.
            </div>
            <div style={{ fontSize: 22, color: GREEN, fontWeight: 600, marginTop: 8 }}>● All open to meet</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: "0 52px" }}>
          <div style={{ ...disp(58), opacity: lIn, transform: `translateY(${(1 - lIn) * 18}px)` }}>You don&rsquo;t search.</div>
          <div style={{ ...disp(58, { color: PURPLE }), opacity: lIn }}>The shortlist is the app.</div>
        </AbsoluteFill>
      )}

      {frame >= S.slate.start && <Slate local={frame - S.slate.start} total={TOTAL} frame={frame} />}
    </Stage>
  );
};
