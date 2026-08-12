// ============================================================
// "400 applications. Or 3 people." — the job-board pain reel.
// A torrent of anonymous applications buries the frame, freezes on the
// gut-punch ("0 you'd actually hire"), sweeps away, and three verified
// humans fan in. 720×900 @30fps to match the main reel.
// Every motion value is a named ms constant → frames via f().
// ============================================================
export const FPS = 30;
export const REEL_W = 720;
export const REEL_H = 900;
export const f = (ms: number) => Math.round((ms * FPS) / 1000);

export const SCENE_MS = {
  flood: 2900, // "You posted one job." → applications avalanche in, counter spins
  gut: 1000, // freeze on the pile: "400 applications. 0 you'd actually hire."
  sweep: 460, // the whole pile drops away
  reveal: 2900, // three verified candidates fan in + "Or 3 people." lands
  payoff: 2100, // tal CTA slate
} as const;

export type SceneName = keyof typeof SCENE_MS;
export const SCENE_ORDER: SceneName[] = ["flood", "gut", "sweep", "reveal", "payoff"];

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

// ---- flood tuning ----
export const ROWS = 34; // rendered junk rows (the counter says 400+)
export const COUNT_TO = 412; // where the application counter lands
export const ROW_W = 452; // junk row width (native px)
export const ROW_STEP = 25; // vertical gap as the pile grows upward (rows overlap)
export const FALL_FROM = -260; // px above frame where rows spawn
// spawn curve exponent < 1 → slow first drips, then a torrent (avalanche feel)
export const SPAWN_CURVE = 0.6;
