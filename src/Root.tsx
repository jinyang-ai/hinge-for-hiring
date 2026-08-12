import { Composition } from "remotion";
import { Hinge } from "./hinge/Hinge";
import { TOTAL_FRAMES, FPS, REEL_W, REEL_H } from "./hinge/timing";
import { CompanyWall } from "./wall/CompanyWall";
import { Flood } from "./flood/Flood";
import { TOTAL_FRAMES as FLOOD_FRAMES, FPS as FLOOD_FPS, REEL_W as FLOOD_W, REEL_H as FLOOD_H } from "./flood/timing";
import { NotLooking } from "./notlooking/NotLooking";
import { TOTAL_FRAMES as NL_FRAMES, FPS as NL_FPS, REEL_W as NL_W, REEL_H as NL_H } from "./notlooking/timing";

// Hinge for Hiring — boss-POV Tal reel (720×900, 30fps, ~10.3s).
// The hiring manager swipes through candidate cards, requests a resume,
// and chats — "Hinge, but for hiring."
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

      {/* Company Wall — bosses' companies scroll horizontally across the
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

      {/* "400 applications. Or 3 people." — job-board pain: a torrent of
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

      {/* "Not looking. But open." — the passive-talent reel. One card flip
          carries it: grey/closed → colour/open. Payoff is the real product
          moment — pick a slot, swipe to invite, Google Meet sent. */}
      <Composition
        id="NotLooking"
        component={NotLooking}
        durationInFrames={NL_FRAMES}
        fps={NL_FPS}
        width={NL_W}
        height={NL_H}
      />
    </>
  );
};
