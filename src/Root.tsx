import { Composition } from "remotion";
import { Hinge } from "./hinge/Hinge";
import { TOTAL_FRAMES, FPS, REEL_W, REEL_H } from "./hinge/timing";
import { CompanyWall } from "./wall/CompanyWall";

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
    </>
  );
};
