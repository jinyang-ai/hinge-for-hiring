# Hinge for Hiring — Tal reel (boss-POV)

A self-playing **"Hinge, but for hiring"** reel, rendered with [Remotion](https://remotion.dev) at **720×900 (4:5), 30fps, ~10.3s**. The hiring manager swipes through **candidate** cards, requests a resume, and chats — the app where bosses hire directly, no middlemen.

## Flow

1. **Poster** — `NO` AGENCIES / RECRUITERS / JOB BOARDS / APPLICATIONS, then rises away
2. **Candidate stack** — "Chat with your next hire, directly" + candidate cards (Ananya·Groww / Priya·Meesho / Rohan·Zerodha dismissed → **Sanchit Tripathi**·CRED, *Top 1%*, settles)
3. **Profile** — expands + scrolls to "What am I working on at CRED → Rebuilding the rewards engine on UPI rails…"
4. **Request resume** — tap on the ✕ / **Request resume** / Reply bar
5. **Chat** — boss's "You sent a request to check out Sanchit's resume" → Sanchit replies with **Sanchit_Resume.pdf**

## Run

```bash
npm install        # if node_modules is missing
npm run dev        # Remotion Studio at localhost:3000
npm run render     # out/hinge-for-hiring.mp4  (1440×1800 @ scale 2)
npm run gif        # out/hinge-for-hiring.gif
```

## Edit

- **Cast & copy** live in `src/hinge/data.ts` — the last candidate in `stack` is the one that settles and gets their resume requested. Swap photos (`public/reel/`), names, roles, salary, and the "what I'm working on" line freely.
- **Timing** is motion-only in `src/hinge/timing.ts` (named ms constants; the schedule recomputes).
- **Frame size / fps** in `src/Root.tsx` + `src/hinge/timing.ts`.

Boss-POV concept + cast reused from the HM-side `TalReel` (`remotion-boss-swipe/src/reel`); look/feel from `tal-reel-2`. Isolated, self-contained project.
