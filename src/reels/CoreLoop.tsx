// ============================================================
// THE core loop, end to end, nothing else.
// See profiles → reject → like one → ask for the resume → they send it →
// a short exchange → set up the meeting → THEY ACCEPT.
// All app UI, one line, the lockup, out. The acceptance is the payoff: the
// reel ends on a yes, not on a sent invite.
// ============================================================
import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame } from "remotion";
import { Stage, disp, timeline, fr, FPS, lerp, PURPLE, LOGO_SRC } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { CandidateCard } from "../hinge/CandidateCard";
import { MeetSheet } from "../notlooking/MeetSheet";
import { hero, dismissed, type Candidate } from "../hinge/data";

const MS = { deck: 3200, chat: 6600, meet: 3300, accepted: 2900, line: 1900, slate: 1500 };
const ORDER: (keyof typeof MS)[] = ["deck", "chat", "meet", "accepted", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const HERO: Candidate = { ...hero, intent: "Open to meet · this week" };
const STACK: Candidate[] = [dismissed[0], dismissed[2], HERO];
const CARD_SCALE = 1.24;

// ask → resume → a short exchange
const CHAT: Msg[] = [
  { side: "out", at: fr(300), text: "📋 You requested Sanchit's resume", time: "11:36 PM" },
  { side: "in", at: fr(1300), typingUntil: fr(1950), resume: true, text: "Here's my resume 🙌", time: "11:38 PM" },
  { side: "out", at: fr(3700), text: "This is great. Free for a quick call this week?", time: "11:41 PM" },
  { side: "in", at: fr(4750), typingUntil: fr(5300), text: "Yes — evenings work for me.", time: "11:43 PM" },
];

// the invite, then the yes
const ACCEPTED: Msg[] = [
  { side: "out", at: 0, meet: { when: "Wed 12 Aug, 8:00 PM · 30 min" }, time: "11:44 PM" },
  { side: "in", at: fr(1150), typingUntil: fr(1700), text: "Accepted — see you Wednesday.", time: "11:45 PM" },
];
const ACCEPTED_DONE: Msg[] = [
  { side: "out", at: 0, meet: { when: "Wed 12 Aug, 8:00 PM · 30 min", accepted: true }, time: "11:44 PM" },
  { side: "in", at: 0, text: "Accepted — see you Wednesday.", time: "11:45 PM" },
];

export const CoreLoop: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- deck: two rejected, one settles ----
  const rise = spring({ frame: Math.max(0, frame - fr(80)), fps: FPS, config: { damping: 16, stiffness: 140, mass: 0.85 } });
  const flick = (i: number) => lerp(frame, [fr(900) + i * fr(800), fr(1480) + i * fr(800)], [0, 1]);
  const press = (i: number) => (frame > fr(830) + i * fr(800) && frame < fr(1010) + i * fr(800) ? 0.9 : 1);

  // ---- accepted ----
  const al = frame - S.accepted.start;
  const showDone = al >= fr(1980);

  // ---- line ----
  const ll = frame - S.line.start;
  const l1 = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });
  const l2 = spring({ frame: Math.max(0, ll - fr(230)), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });

  // ---- slate ----
  const sl = frame - S.slate.start;
  const pop = spring({ frame: Math.max(0, sl), fps: FPS, config: { damping: 13, stiffness: 150, mass: 0.85 } });

  return (
    <Stage>
      {/* ---------- see profiles, reject, land on one ---------- */}
      {frame < S.chat.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {STACK.map((c, i) => {
            const isHero = i === STACK.length - 1;
            const f = isHero ? 0 : flick(i);
            if (f >= 1) return null;
            const depth = Math.max(0, i - (flick(0) >= 1 ? 1 : 0) - (flick(1) >= 1 ? 1 : 0));
            return (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  zIndex: 30 - i,
                  transform: `scale(${CARD_SCALE * (1 - 0.04 * depth)}) translate(${-f * 960}px, ${f * 46 + depth * 12}px) rotate(${-f * 16}deg) translateY(${(1 - rise) * 80}px)`,
                  opacity: rise * (1 - Math.max(0, (f - 0.8) / 0.2)),
                }}
              >
                <div style={{ position: "relative" }}>
                  <CandidateCard c={c} />
                  <ActionBar xPress={isHero ? 1 : press(i)} resumePress={isHero && frame > fr(2750) && frame < fr(2980) ? 0.92 : 1} />
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* ---------- resume + a short exchange ---------- */}
      {frame >= S.chat.start && frame < S.meet.start && <TalChat lf={frame - S.chat.start} msgs={CHAT} />}

      {/* ---------- set up the meeting ---------- */}
      {frame >= S.meet.start && frame < S.accepted.start && <MeetSheet local={frame - S.meet.start} f={fr} />}

      {/* ---------- they accept ---------- */}
      {frame >= S.accepted.start && frame < S.line.start && (
        <TalChat lf={al} msgs={showDone ? ACCEPTED_DONE : ACCEPTED} />
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 52px", background: "#fff" }}>
          <div style={{ ...disp(56), opacity: l1, transform: `translateY(${(1 - l1) * 16}px)` }}>Swiped to booked</div>
          <div style={{ ...disp(56, { color: PURPLE }), marginTop: 14, opacity: l2, transform: `translateY(${(1 - l2) * 16}px)` }}>in ten minutes.</div>
        </AbsoluteFill>
      )}

      {/* ---------- lockup ---------- */}
      {frame >= S.slate.start && (
        <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile(LOGO_SRC)} style={{ height: 186, width: "auto", display: "block", transform: `scale(${0.88 + 0.12 * Math.min(pop, 1.04)})` }} />
          <div style={{ fontSize: 21, fontWeight: 500, color: "#8a8a8a", marginTop: 26, opacity: lerp(sl, [fr(300), fr(600)], [0, 1]) }}>
            where Bangalore founders hire directly
          </div>
        </AbsoluteFill>
      )}
    </Stage>
  );
};
