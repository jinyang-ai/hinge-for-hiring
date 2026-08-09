// ============================================================
// Tal Reel 2 — 4:5 cut (720×900 @30fps, ~10.3s). A tightened
// reflow of the 9:16 reel: poster (NO … cycling nouns) → boss
// stack → short scroll to the work-prompt → chat → interview.
// The card/profile/chat components are native-sized and scaled
// as groups, so only this file + the scene wrappers change.
// Every motion value is a named ms constant → frames via f().
// ============================================================
export const FPS = 30;
export const REEL_W = 720;
export const REEL_H = 900;
export const f = (ms: number) => Math.round((ms * FPS) / 1000);

// ---- scene durations (ms) ----
export const SCENE_MS = {
  title: 1400, // intro: "Hinge for hiring" rises from below → hero hold → settles to top
  chat: 7900, // stack → settle → expand+scroll to prompt → Reply → chat → resume
} as const;

export type SceneName = keyof typeof SCENE_MS;
export const SCENE_ORDER: SceneName[] = ["title", "chat"];

export type SceneSpan = { name: SceneName; start: number; end: number; dur: number };
export function buildTimeline(): { scenes: Record<SceneName, SceneSpan>; total: number } {
  const scenes = {} as Record<SceneName, SceneSpan>;
  let t = 0;
  for (const name of SCENE_ORDER) {
    const dur = f(SCENE_MS[name]);
    scenes[name] = { name, start: t, end: t + dur, dur };
    t += dur;
  }
  return { scenes, total: t };
}
export const { scenes: SCENES, total: TOTAL_FRAMES } = buildTimeline();

// ============================================================
// Scene 1 — poster ("NO" holds; the middlemen cycle and get flicked)
// One word on a fixed baseline at a time; the block is centred in-frame
// by Title.tsx off the measured SIZE (no hard-coded NO_TOP at 4:5).
// ============================================================
export const MEASURE = 640; // 720 − 40 left − 40 right — width the noun must fit
export const LEADING = 0.99;
export const TRACKING = "0em";
export const INK = "#131313"; // pure black vibrates at this size
export const SIZE_CAP = 150; // guard against a short list blowing up
export const SIZE_FALLBACK = 118; // if fitText won't behave before the font loads
export const WORD_FROM = -112; // % — NO drops in out of its mask

// per-noun dwell (ms) — fast rapid-fire; each holds a clear beat then flicks
export const DWELL = [360, 340, 320, 300];
export const S1 = {
  noIn: 300, // "NO" drops in
  firstNoun: 200, // noun 1 begins revealing, overlapping NO's landing
  dwellStart: 300, // noun 1's dwell clock starts
  noExit: 280, // NO + last word rise fully off before scene 2 enters
} as const;
// flick duration derived from dwell keeps flick < dwell (one noun in flight)
export const flickMs = (i: number) => Math.max(120, Math.round(DWELL[i] * 0.55));
// flick time (ms from scene start) for noun i = dwellStart + cumulative dwell
export function flickAtMs(i: number): number {
  let t = S1.dwellStart;
  for (let j = 0; j <= i; j++) t += DWELL[j];
  return t;
}
// noun i reveals when noun i−1 flicks (noun 0 reveals at firstNoun)
export const revealAtMs = (i: number) => (i === 0 ? S1.firstNoun : flickAtMs(i - 1));

// ============================================================
// Scene 2 — "Chat with your next boss, directly"
// ============================================================
// headline — "Hinge for hiring" serif lockup (see Stack.tsx). HEAD_SIZE/HEAD_LH
// are legacy (unused by the current lockup) but kept for reference.
export const HEAD_TOP = 24;
export const HEAD_SIZE = 40;
export const HEAD_LH = 0.92;

// card geometry — native 393-wide face, scaled + positioned as one group.
// Native sizes are shared verbatim with the 9:16 reel (BossCard/HeroProfile),
// so the card proportions match the reference exactly.
export const CARD_W = 393; // native
export const CARD_H = 575; // native — wider card ⇒ a little shorter to fit 4:5
export const PHOTO_H = 308; // native photo height (~54%) — leaves sheet clearance above the action bar
export const SHEET_TOP = 288; // native — sheet overlaps the photo by 20px

// floating (pre-expand) placement: whole card visible, centred, under headline.
// Wider than before — fills ~74% of the frame width (was ~59%); everything on
// the card scales up with it, and CARD_H is trimmed so it still fits vertically.
export const CARD_SCALE = 1.35; // 393·1.35 ≈ 531 wide, 575·1.35 ≈ 776 tall
export const CARD_W_R = CARD_W * CARD_SCALE; // rendered width ≈ 531
export const CARD_H_R = CARD_H * CARD_SCALE; // rendered height ≈ 776
export const CARD_LEFT = Math.round((REEL_W - CARD_W_R) / 2); // centred (gutter ≈ 95)
export const CARD_TOP = 112; // just under the headline (bottom ≈ 888)

// expand target: card grows to FILL WIDTH and pins to the top, becoming a
// 720-wide phone viewport (4:5 shows a window into it — unlike 9:16 which
// filled height, since the card aspect ≈ the 9:16 frame aspect).
export const CARD_SCALE_FULL = REEL_W / CARD_W; // 720/393 ≈ 1.832

// ---- Scene 2 beat schedule (ms from scene start) ----
export const S2 = {
  headIn: 380, // headline words fully in by here
  cardRiseAt: 40, // stack begins rising from below frame
  cardRise: 380, // rise duration
  holdFirst: 520, // first card dwell → reject #1
  reject: 340, // swipe-off duration
  hold: 300, // dwell between rejects
  promote: 400, // behind-card spring forward
  expandAt: 2500, // card expands to full-width + profile scrolls to the prompt
  expandMs: 900, // expand + scroll duration
  replyAt: 4050, // Reply press on the work-segment prompt
  chatOpenAt: 4230, // chat layer fades in
  chatOpenMs: 340, // chat fade-in duration
  flyMs: 460, // display-picture shrinks + flies into the chat header avatar
  candReplyAt: 4270, // boss's "Request resume" bubble — already in place as chat opens (right, dark)
  m1At: 4900, // (unused in boss-POV)
  m2At: 5100, // Sanchit starts typing
  inviteAt: 5700, // Sanchit replies with his resume (left, beige) — conversation ends here
  endHold: 2200, // hold on the resume reply
} as const;

// how far (native px) the hero profile scrolls to land the work-prompt (heading
// + body + Reply) fully in the expanded viewport before the Reply is pressed
export const SCROLL_TARGET = 572;

// press() dip length (frames @30) — button press feedback
export const PRESS_FRAMES = 5;

// ---- derived, in local frames from Scene 2 start ----
export const CARD_RISE_START = f(S2.cardRiseAt);
export const CARD_RISE_FROM = 520; // px below its resting position
export const PROMOTE = f(S2.promote);
export const REJECT_DUR = f(S2.reject);

// one reject beat per dismissed card; hero (last) settles.
export function rejectBeats(dismissedCount: number): number[] {
  return Array.from(
    { length: dismissedCount },
    (_, i) => f(S2.holdFirst) + i * (f(S2.reject) + f(S2.hold)),
  );
}

export const EXPAND_START = f(S2.expandAt);
export const EXPAND_MS_F = f(S2.expandMs);
export const REPLY_PRESS = f(S2.replyAt);
export const CHAT_OPEN_START = f(S2.chatOpenAt);
export const CHAT_OPEN_MS_F = f(S2.chatOpenMs);
export const FLY_MS_F = f(S2.flyMs);
export const CAND_REPLY_FRAME = f(S2.candReplyAt);
export const M1_FRAME = f(S2.m1At);
export const M2_FRAME = f(S2.m2At);
export const INVITE_FRAME = f(S2.inviteAt);
