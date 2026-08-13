// ============================================================
// THE core loop, end to end, nothing else.
// See profiles → reject → like one → ask for the resume → they send it →
// a short exchange → set up the meeting → THEY ACCEPT.
// All app UI, one line, the lockup, out. The acceptance is the payoff: the
// reel ends on a yes, not on a sent invite.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Stage, CompactSlate, disp, timeline, fr, FPS, lerp, PURPLE } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { CandidateCard } from "../hinge/CandidateCard";
import { Profile } from "../hinge/Profile";
import { MeetSheet } from "../notlooking/MeetSheet";
import { type Candidate } from "../hinge/data";
import { CORE_STACK, MEERA } from "./coreCast";

const MS = { deck: 3200, read: 3800, chat: 6600, meet: 3300, accepted: 2900, line: 1900, slate: 2100 };
const ORDER: (keyof typeof MS)[] = ["deck", "read", "chat", "meet", "accepted", "line", "slate"];
export const { scenes: S, total: TOTAL } = timeline(MS, ORDER);

const HERO: Candidate = MEERA;
const STACK: Candidate[] = CORE_STACK;
const FIRST = HERO.name.split(" ")[0];
const FACE_POS = "46% 22%";
const CARD_SCALE = 1.24;

// ask, resume, a short exchange
const CHAT: Msg[] = [
  { side: "out", at: fr(300), text: `📋 You requested ${FIRST}'s resume`, time: "11:36 AM" },
  { side: "in", at: fr(1300), typingUntil: fr(1950), resume: true, text: "Here's my resume 🙌", time: "11:38 AM" },
  { side: "out", at: fr(3700), text: "This is great. Free for a quick call this week?", time: "11:41 AM" },
  { side: "in", at: fr(4750), typingUntil: fr(5300), text: "Yes, evenings work for me.", time: "11:43 AM" },
];

// The invite lands in the SAME thread: everything above it is already in
// place (at: 0), so the conversation stays continuous instead of the earlier
// messages vanishing when the calendar card appears.
const PRIOR: Msg[] = CHAT.map((m) => ({ ...m, at: 0, typingUntil: undefined }));
const ACCEPTED: Msg[] = [
  ...PRIOR,
  { side: "out", at: 0, meet: { when: "Wed 12 Aug, 8:00 PM · 30 min" }, time: "11:44 AM" },
  { side: "in", at: fr(1150), typingUntil: fr(1700), text: "Accepted. See you tonight.", time: "11:45 AM" },
];
const ACCEPTED_DONE: Msg[] = [
  ...PRIOR,
  { side: "out", at: 0, meet: { when: "Wed 12 Aug, 8:00 PM · 30 min", accepted: true }, time: "11:44 AM" },
  { side: "in", at: 0, text: "Accepted. See you tonight.", time: "11:45 AM" },
];

export const CoreLoop: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- deck: two rejected, one settles ----
  const rise = spring({ frame: Math.max(0, frame - fr(80)), fps: FPS, config: { damping: 16, stiffness: 140, mass: 0.85 } });
  const flick = (i: number) => lerp(frame, [fr(900) + i * fr(800), fr(1480) + i * fr(800)], [0, 1]);
  const press = (i: number) => (frame > fr(830) + i * fr(800) && frame < fr(1010) + i * fr(800) ? 0.9 : 1);

  // ---- read: the card opens out, then the profile is scrolled ----
  const rl = frame - S.read.start;
  const expand = lerp(rl, [0, fr(520)], [0, 1]);
  const readScale = 1.24 + (1.83 - 1.24) * expand;
  const readScroll = lerp(rl, [fr(560), fr(3100)], [0, 830]);
  const readPress = rl > fr(3250) && rl < fr(3520) ? 0.92 : 1;

  // ---- accepted ----
  const al = frame - S.accepted.start;
  const showDone = al >= fr(1980);

  // ---- line ----
  const ll = frame - S.line.start;
  const l1 = spring({ frame: Math.max(0, ll), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });
  const l2 = spring({ frame: Math.max(0, ll - fr(230)), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });

  return (
    <Stage>
      {/* ---------- see profiles, reject, land on one ---------- */}
      {frame < S.read.start && (
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
                  <ActionBar xPress={isHero ? 1 : press(i)} />
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* ---------- actually read the profile ---------- */}
      {frame >= S.read.start && frame < S.chat.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ position: "relative", transform: `scale(${readScale})`, transformOrigin: "top center" }}>
            <Profile c={HERO} scroll={readScroll} radius={30 * (1 - expand)} />
            <ActionBar resumePress={readPress} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- resume + a short exchange ---------- */}
      {frame >= S.chat.start && frame < S.meet.start && <TalChat lf={frame - S.chat.start} msgs={CHAT} name={HERO.name} subtitle={HERO.chatSubtitle} face={HERO.facePhoto} facePos={FACE_POS} />}

      {/* ---------- set up the meeting ---------- */}
      {frame >= S.meet.start && frame < S.accepted.start && <MeetSheet local={frame - S.meet.start} f={fr} name={HERO.name} subtitle="Software Engineer, CRED" face={HERO.facePhoto} facePos={FACE_POS} />}

      {/* ---------- they accept ---------- */}
      {frame >= S.accepted.start && frame < S.line.start && (
        <TalChat lf={al} msgs={showDone ? ACCEPTED_DONE : ACCEPTED} name={HERO.name} subtitle={HERO.chatSubtitle} face={HERO.facePhoto} facePos={FACE_POS} />
      )}

      {/* ---------- the line ---------- */}
      {frame >= S.line.start && frame < S.slate.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 52px", background: "#fff" }}>
          <div style={{ ...disp(56), opacity: l1, transform: `translateY(${(1 - l1) * 16}px)` }}>Swiped to booked</div>
          <div style={{ ...disp(56, { color: PURPLE }), marginTop: 14, opacity: l2, transform: `translateY(${(1 - l2) * 16}px)` }}>in ten minutes.</div>
        </AbsoluteFill>
      )}

      {/* ---------- lockup + store badges ---------- */}
      {frame >= S.slate.start && <CompactSlate local={frame - S.slate.start} />}

    </Stage>
  );
};
