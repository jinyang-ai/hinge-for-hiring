// ============================================================
// The simple set. One product loop each, shown plainly in the app UI, one
// line, the lockup, out — under 10s so each works as a GIF.
//
// Deliberately NO villain screens, no contrast setups, no headline
// sequences. The product working IS the ad; everything else was scaffolding
// around it. If a beat is not the app doing its job, it is not in here.
// ============================================================
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Stage, CompactSlate, disp, timeline, fr, FPS, lerp, PURPLE } from "../shared/kit";
import { ActionBar, TalChat, type Msg } from "../shared/AppUI";
import { CandidateCard } from "../hinge/CandidateCard";
import { Profile } from "../hinge/Profile";
import { MeetSheet } from "../notlooking/MeetSheet";
import { hero, dismissed, type Candidate } from "../hinge/data";

const HERO: Candidate = { ...hero, intent: "Open to meet · this week" };
const CARD_SCALE = 1.24;

// ---------- shared closers ----------
const Line: React.FC<{ local: number; a: string; b: string }> = ({ local, a, b }) => {
  const s1 = spring({ frame: Math.max(0, local), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });
  const s2 = spring({ frame: Math.max(0, local - fr(240)), fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.85 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 54px", background: "#fff" }}>
      <div style={{ ...disp(62), opacity: s1, transform: `translateY(${(1 - s1) * 16}px)` }}>{a}</div>
      <div style={{ ...disp(62, { color: PURPLE }), marginTop: 14, opacity: s2, transform: `translateY(${(1 - s2) * 16}px)` }}>{b}</div>
    </AbsoluteFill>
  );
};

// ============================================================
// 1 — REQUEST A RESUME
// profile → Request resume → it arrives in the chat.
// ============================================================
const RESUME_MS = { profile: 2600, chat: 3800, line: 1700, slate: 1900 };
const RESUME_ORDER: (keyof typeof RESUME_MS)[] = ["profile", "chat", "line", "slate"];
export const { scenes: RS, total: RESUME_TOTAL } = timeline(RESUME_MS, RESUME_ORDER);

const RESUME_CHAT: Msg[] = [
  { side: "out", at: fr(250), text: "📋 You requested Sanchit's resume", time: "11:36 PM" },
  { side: "in", at: fr(1100), typingUntil: fr(1900), resume: true, text: "Here's my resume 🙌", time: "11:46 PM" },
];

export const ResumeLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = lerp(frame, [fr(200), fr(1700)], [0, 800]);
  const press = frame > fr(1900) && frame < fr(2200) ? 0.93 : 1;
  return (
    <Stage>
      {frame < RS.chat.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ position: "relative", transform: "scale(1.83)", transformOrigin: "top center" }}>
            <Profile c={HERO} scroll={scroll} radius={0} />
            <ActionBar resumePress={press} />
          </div>
        </AbsoluteFill>
      )}
      {frame >= RS.chat.start && frame < RS.line.start && <TalChat lf={frame - RS.chat.start} msgs={RESUME_CHAT} />}
      {frame >= RS.line.start && frame < RS.slate.start && <Line local={frame - RS.line.start} a="Resume in" b="ten minutes." />}
      {frame >= RS.slate.start && <CompactSlate local={frame - RS.slate.start} />}
    </Stage>
  );
};

// ============================================================
// 2 — BOOK THE INTERVIEW
// Setup Meet → pick a slot → swipe → Google Meet sent.
// ============================================================
const MEET_MS = { sheet: 5200, line: 1700, slate: 1900 };
const MEET_ORDER: (keyof typeof MEET_MS)[] = ["sheet", "line", "slate"];
export const { scenes: MS_, total: MEET_TOTAL } = timeline(MEET_MS, MEET_ORDER);

export const MeetLoop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      {frame < MS_.line.start && <MeetSheet local={frame} f={fr} />}
      {frame >= MS_.line.start && frame < MS_.slate.start && <Line local={frame - MS_.line.start} a="Interview booked." b="One swipe." />}
      {frame >= MS_.slate.start && <CompactSlate local={frame - MS_.slate.start} />}
    </Stage>
  );
};

// ============================================================
// 3 — ASK ABOUT THE WORK
// the candidate's own prompt → Reply → a real answer.
// ============================================================
const ASK_MS = { profile: 2500, chat: 3700, line: 1600, slate: 1900 };
const ASK_ORDER: (keyof typeof ASK_MS)[] = ["profile", "chat", "line", "slate"];
export const { scenes: AS, total: ASK_TOTAL } = timeline(ASK_MS, ASK_ORDER);

const ASK_CHAT: Msg[] = [
  { side: "out", at: fr(250), text: "How did you get payouts under 100ms on UPI rails?", time: "9:12 PM" },
  { side: "in", at: fr(1200), typingUntil: fr(2100), text: "Sharded the ledger, settlement async — the payout path never touches the DB.", time: "9:23 PM" },
];

export const AskLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = lerp(frame, [fr(200), fr(1700)], [0, 800]);
  const press = frame > fr(1900) && frame < fr(2200) ? 0.93 : 1;
  return (
    <Stage>
      {frame < AS.chat.start && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ position: "relative", transform: "scale(1.83)", transformOrigin: "top center" }}>
            <Profile c={HERO} scroll={scroll} replyPress={press} radius={0} />
            <ActionBar />
          </div>
        </AbsoluteFill>
      )}
      {frame >= AS.chat.start && frame < AS.line.start && <TalChat lf={frame - AS.chat.start} msgs={ASK_CHAT} />}
      {frame >= AS.line.start && frame < AS.slate.start && <Line local={frame - AS.line.start} a="Ask about the work." b="They answer." />}
      {frame >= AS.slate.start && <CompactSlate local={frame - AS.slate.start} />}
    </Stage>
  );
};

// ============================================================
// 4 — THE DECK
// swipe past, land on the one who is already matched to you.
// ============================================================
const DECK_MS = { deck: 5000, line: 1700, slate: 1900 };
const DECK_ORDER: (keyof typeof DECK_MS)[] = ["deck", "line", "slate"];
export const { scenes: DS, total: DECK_TOTAL } = timeline(DECK_MS, DECK_ORDER);

const STACK: Candidate[] = [dismissed[0], dismissed[2], HERO];

export const DeckLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = spring({ frame: Math.max(0, frame - fr(120)), fps: FPS, config: { damping: 16, stiffness: 130, mass: 0.9 } });
  // two cards get flicked, the third settles
  const flick = (i: number) => lerp(frame, [fr(900) + i * fr(1150), fr(1500) + i * fr(1150)], [0, 1]);
  const press = (i: number) => (frame > fr(830) + i * fr(1150) && frame < fr(1020) + i * fr(1150) ? 0.9 : 1);

  return (
    <Stage>
      {frame < DS.line.start && (
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
                  {!isHero && <ActionBar xPress={press(i)} />}
                  {isHero && <ActionBar />}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      {frame >= DS.line.start && frame < DS.slate.start && <Line local={frame - DS.line.start} a="Your shortlist," b="already made." />}
      {frame >= DS.slate.start && <CompactSlate local={frame - DS.slate.start} />}
    </Stage>
  );
};
