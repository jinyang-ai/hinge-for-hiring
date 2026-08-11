# Hinge for Hiring — Tal reel (boss-POV)

A self-playing **"Hinge, but for hiring"** promo reel, built with [Remotion](https://remotion.dev). The hiring manager swipes through **candidate** cards, requests a resume, and chats — the pitch being that on Tal bosses hire directly, with no agencies, recruiters, job boards, or applications in between.

> **Direction matters:** this is **boss-POV** — the boss swipes *candidates*, requests a resume, and the candidate replies. It is deliberately *not* the candidate-POV "chat with your next boss" cut. If you're adapting it, keep the arrow pointing boss → candidate.

- **Format:** 720×900 (4:5), 30 fps
- **Duration:** ~12.7s (381 frames) — `title` 1.4s → `chat` 8.6s → `outro` 2.7s
- **Composition id:** `HingeForHiring`
- **Render scale:** `--scale=2` → 1440×1800 master

---

## Quick start

```bash
git clone https://github.com/MediumMasala/hinge-for-hiring
cd hinge-for-hiring
npm install

npm run dev        # Remotion Studio — preview + scrub at http://localhost:3000
```

Requirements: **Node 18+** (developed on Node 25) and a machine that can run headless Chromium (Remotion downloads its own on first render). No API keys, no env vars, no external services — every asset and font is committed, so it renders fully offline.

### Render

```bash
npm run render     # out/hinge-for-hiring.mp4   (1440×1800 @ scale 2, H.264)
npm run gif        # out/hinge-for-hiring.gif    (every 2nd frame)
npm run still      # out/still.png               (single frame, scale 2)
```

Outputs land in `out/` (gitignored). Concurrency is pinned to 4 and image format to JPEG in `remotion.config.ts`.

---

## The reel, scene by scene

The whole reel is driven by **one global frame** (`Hinge.tsx`); scenes overlap rather than hard-cut. Scene order and durations live in `src/hinge/timing.ts` (`SCENE_ORDER = ["title", "chat", "outro"]`).

1. **Title / poster** (`title`, ~1.4s) — `NO` holds on a fixed baseline while the middlemen cycle and get flicked off one at a time: **AGENCIES · RECRUITERS · JOB BOARDS · APPLICATIONS**. The "Hinge for hiring" lockup then rises from below and settles at the top, where it stays as a persistent headline.
2. **Candidate stack + browse** (`chat`, ~8.6s) — the candidate cards rise in under the lockup. The boss auto-scrolls each of **three** candidates (a quick browse of their profile), then flicks them off with an ✕: **Ananya·Groww**, **Priya·Meesho**, **Rohan·Zerodha** (order is seed-shuffled, male-first — see below). **Sanchit Tripathi · CRED** (*Top 1%*) settles as the last card.
3. **Profile** — Sanchit's card expands to full width and scrolls to the "What am I working on at CRED → *Rebuilding the rewards engine on UPI rails — sub-100ms payouts for 12M members.*" segment.
4. **Request resume → chat** — the boss taps **Reply / Request resume**; the chat layer fades in with the request already in place ("You sent a request to check out **Sanchit**'s resume"), Sanchit types, then replies with **Sanchit_Resume.pdf**.
5. **Outro** (`outro`, ~2.7s) — CTA slate: tal logo + tagline + **App Store / Google Play** badges.

---

## Editing guide

Almost everything you'd want to change is **data or timing** — you rarely need to touch component internals.

### Cast & copy — `src/hinge/data.ts`

This is the main file to edit.

- **`hero`** — the candidate who settles and gets their resume requested (Sanchit). Change name, `role`, `ctc`, work `xps`, `skills`, the `working` prompt, and the `code` stat block.
- **`dismissed[]`** — the three candidates who get browsed and flicked. Same shape as `hero`.
- **Stack order:** the on-screen order is `[...dismissed (shuffled), hero]`. The **last** entry in `stack` is always the one that settles.
- **Photos & logos** live in `public/reel/` and are wired via `staticFile(...)`. Swap the JPG/PNG, keep the filename (or update the reference).
- **Seeded shuffle:** the dismissed order is a deterministic shuffle (`SHUFFLE_SEED`, currently `3`) — *not* `Math.random`, so every Remotion render worker agrees on the same order (otherwise frames disagree). A male candidate is guaranteed first (`MALE_IDS`). **Bump `SHUFFLE_SEED` to re-roll the order.**
- **Chat copy** — the request line and the resume reply (`Sanchit_Resume.pdf`, "Here's my resume 🙌") are the `chat` object at the bottom.

### Timing & motion — `src/hinge/timing.ts`

Every motion value is a **named millisecond constant** converted to frames via `f(ms)`; the schedule recomputes, so you don't hand-edit frame numbers.

- `SCENE_MS` — the three scene durations (retime the whole reel here).
- `S1` / `DWELL` — poster: how `NO` drops in and how fast each middleman word flicks.
- `S2` — the browse/dismiss/expand/reply/chat beat schedule (e.g. `firstReject`, `cycle`, `expandAt`, `replyAt`, `inviteAt`). Card geometry (`CARD_SCALE`, `CARD_SCALE_FULL`, etc.) also lives here.

### Frame size / fps

`REEL_W` / `REEL_H` / `FPS` in `timing.ts`, mirrored by the `<Composition>` in `src/Root.tsx`.

---

## Project layout

```
index.ts                  # Remotion entry (registerRoot)
remotion.config.ts        # jpeg frames, overwrite output, concurrency 4
src/
  index.ts                # registerRoot(RemotionRoot)
  Root.tsx                # <Composition id="HingeForHiring" …>
  hinge/
    Hinge.tsx             # root wrapper — one global frame drives all scenes
    timing.ts             # scene durations + every motion constant (ms → frames)
    data.ts               # BOSS-POV cast, copy, seeded shuffle, chat script
    HingeLockup.tsx       # "Hinge for hiring" poster + persistent headline
    Stack.tsx             # candidate stack: rise, browse-scroll, dismiss, expand
    CandidateCard.tsx     # a single swipeable candidate card face
    Profile.tsx           # expanded scrollable profile (xp / skills / working / code)
    ChatScreen.tsx        # request bubble → typing → resume-reply chat layer
    Outro.tsx             # closing CTA — tal logo + store badges
    icons2.tsx            # inline SVG icons
    fonts.ts              # Obviously Narrow Bold loader (delayRender-aware)
    hinge.css             # stage styles + CSS vars (--font-anton, --font-playfair)
public/
  fonts/ObviouslyNarrowBold.otf
  reel/                   # candidate photos, company logos, tal logo, store badges, resume icon
out/                      # rendered mp4 / gif / png (gitignored)
```

### Fonts

- **Obviously Narrow Bold** (display / poster / headline) is committed at `public/fonts/ObviouslyNarrowBold.otf` and loaded via `@remotion/fonts` (`fonts.ts`), which holds a `delayRender` until the file decodes so text never renders in a fallback face.
- **Inter** (body/UI) is pulled through `@remotion/google-fonts` at render time.

---

## Provenance

Boss-POV concept and cast were carried over from the HM-side `TalReel` in `remotion-boss-swipe/src/reel`; the card / profile / chat look-and-feel is a 4:5 reflow of the 9:16 `tal-reel-2` UI (native-sized components scaled as groups). This repo is isolated and self-contained — it doesn't depend on either of those projects at build time.
