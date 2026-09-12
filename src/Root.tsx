import { Composition } from "remotion";
import { Hinge } from "./hinge/Hinge";
import { TOTAL_FRAMES, FPS, REEL_W, REEL_H } from "./hinge/timing";
import { CompanyWall } from "./wall/CompanyWall";
import { Flood } from "./flood/Flood";
import { TOTAL_FRAMES as FLOOD_FRAMES, FPS as FLOOD_FPS, REEL_W as FLOOD_W, REEL_H as FLOOD_H } from "./flood/timing";
import { NotLooking } from "./notlooking/NotLooking";
import { TOTAL_FRAMES as NL_FRAMES, FPS as NL_FPS, REEL_W as NL_W, REEL_H as NL_H } from "./notlooking/timing";
import { OneSwipe, TOTAL as ONESWIPE_FRAMES } from "./reels/OneSwipe";
import { SpeedRun, TOTAL as SPEEDRUN_FRAMES } from "./reels/SpeedRun";
import { AskTheWork, TOTAL as ASK_FRAMES } from "./reels/AskTheWork";
import { Shortlist, TOTAL as SHORTLIST_FRAMES } from "./reels/Shortlist";
import { BecauseItWasYou, TOTAL as BECAUSE_FRAMES } from "./reels/BecauseItWasYou";
import {
  ResumeLoop, RESUME_TOTAL,
  MeetLoop, MEET_TOTAL,
  AskLoop, ASK_TOTAL,
  DeckLoop, DECK_TOTAL,
} from "./reels/Loops";
import { CoreLoop, TOTAL as CORE_TOTAL } from "./reels/CoreLoop";
import { OnTap, TAP_TOTAL, GoodOnes, GOOD_TOTAL, BangaloreHires, BLR_TOTAL } from "./reels/Message";
import { SEGMENTS } from "./wall/segments";

// Hinge for Hiring - boss-POV Tal reel (720×900, 30fps, ~10.3s).
// The hiring manager swipes through candidate cards, requests a resume,
// and chats - "Hinge, but for hiring."
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HingeForHiring"
        component={Hinge}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={REEL_W}
        height={REEL_H}
      />

      {/* Company Wall - bosses' companies scroll horizontally across the
          frame in stacked marquee lanes. Vertical reel, 1080×1920, 30fps,
          8s seamless loop. */}
      <Composition
        id="CompanyWall"
        component={CompanyWall}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* "400 applications. Or 3 people." - job-board pain: a torrent of
          faceless applications buries the frame, then three verified humans
          fan in. 720×900 to match the main reel. */}
      <Composition
        id="Flood"
        component={Flood}
        durationInFrames={FLOOD_FRAMES}
        fps={FLOOD_FPS}
        width={FLOOD_W}
        height={FLOOD_H}
      />

      {/* "Not looking. But open." - the passive-talent reel. One card flip
          carries it: grey/closed → colour/open. Payoff is the real product
          moment - pick a slot, swipe to invite, Google Meet sent. */}
      <Composition
        id="NotLooking"
        component={NotLooking}
        durationInFrames={NL_FRAMES}
        fps={NL_FPS}
        width={NL_W}
        height={NL_H}
      />

      {/* ---- the product-loop set: one reel per loop, each with one claim ---- */}

      {/* whole loop - "Cold to calendar in 41 seconds." */}
      <Composition id="SpeedRun" component={SpeedRun} durationInFrames={SPEEDRUN_FRAMES} fps={30} width={720} height={900} />

      {/* Talk loop - "Ask about the work. They answer." */}
      <Composition id="AskTheWork" component={AskTheWork} durationInFrames={ASK_FRAMES} fps={30} width={720} height={900} />

      {/* Discover loop - "You don't search. The shortlist is the app." */}
      <Composition id="Shortlist" component={Shortlist} durationInFrames={SHORTLIST_FRAMES} fps={30} width={720} height={900} />

      {/* Meet loop - "Six emails, or one swipe." */}
      <Composition id="OneSwipe" component={OneSwipe} durationInFrames={ONESWIPE_FRAMES} fps={30} width={720} height={900} />

      {/* no-middleman loop - "They replied because it was you asking." */}
      <Composition id="BecauseItWasYou" component={BecauseItWasYou} durationInFrames={BECAUSE_FRAMES} fps={30} width={720} height={900} />

      {/* THE core loop: profiles -> reject -> resume -> chat -> meet -> accepted */}
      <Composition id="CoreLoop" component={CoreLoop} durationInFrames={CORE_TOTAL} fps={30} width={720} height={900} />

      {/* ---- company wall, one cut per peer group ---- */}
      {/* Generated from wall/segments.ts, so a new variation is a config
          entry rather than a new composition. */}
      {SEGMENTS.map((seg) => (
        <Composition
          key={seg.id}
          id={`Wall-${seg.id}`}
          component={CompanyWall}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ segment: seg }}
        />
      ))}

      {/* ---- the message set: one line each, on-brand, under 10s ---- */}
      <Composition id="OnTap" component={OnTap} durationInFrames={TAP_TOTAL} fps={30} width={720} height={900} />
      <Composition id="GoodOnes" component={GoodOnes} durationInFrames={GOOD_TOTAL} fps={30} width={720} height={900} />
      <Composition id="BangaloreHires" component={BangaloreHires} durationInFrames={BLR_TOTAL} fps={30} width={720} height={900} />

      {/* ---- the simple set: one loop each, under 10s, GIF-able ---- */}
      <Composition id="LoopResume" component={ResumeLoop} durationInFrames={RESUME_TOTAL} fps={30} width={720} height={900} />
      <Composition id="LoopMeet" component={MeetLoop} durationInFrames={MEET_TOTAL} fps={30} width={720} height={900} />
      <Composition id="LoopAsk" component={AskLoop} durationInFrames={ASK_TOTAL} fps={30} width={720} height={900} />
      <Composition id="LoopDeck" component={DeckLoop} durationInFrames={DECK_TOTAL} fps={30} width={720} height={900} />
    </>
  );
};
