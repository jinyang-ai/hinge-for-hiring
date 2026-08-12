// ============================================================
// "Not looking. But open." — the passive-talent reel.
// The engineer a founder actually wants is employed, content, and will never
// see a job post. One mechanic carries it: a card FLIP. Front is grey and
// closed (Not looking); the back blooms into colour (But open) — the title is
// the two faces of the same person. Payoff is the real product moment: the
// founder picks a slot and SWIPES TO INVITE, sending a Google Meet.
// 720×900 @30fps to match the rest of the set.
// ============================================================
export const FPS = 30;
export const REEL_W = 720;
export const REEL_H = 900;
export const f = (ms: number) => Math.round((ms * FPS) / 1000);

export const SCENE_MS = {
  premise: 1600, // "Your best hire will never apply."
  closed: 2400, // Sanchit rises, drains to greyscale, NOT LOOKING thuds on
  wall: 1600, // two more refusals, fast — one refusal is anecdote, three is a market
  flip: 2300, // ★ the card turns: grey → colour, "But open."
  wave: 1900, // pull back: a grid of cards flips in a diagonal wave
  meet: 3200, // Pick a time → swipe to invite → Google Meet sent
  end: 1900, // "They were never going to apply." → travelling tal BOSS lockup
} as const;

export type SceneName = keyof typeof SCENE_MS;
export const SCENE_ORDER: SceneName[] = ["premise", "closed", "wall", "flip", "wave", "meet", "end"];

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

// ---- card geometry ----
export const CARD_W = 393; // native CandidateCard width
export const CARD_H = 500;
export const CARD_SCALE = 1.26;
export const CARD_W_R = CARD_W * CARD_SCALE;
export const CARD_H_R = CARD_H * CARD_SCALE;

// ---- the travelling tal BOSS lockup (same device as the Flood reel) ----
export const LOGO_END_TOP = 300;
export const LOGO_END_H = 200;
