import { Composition } from "remotion";
import { Hinge } from "./hinge/Hinge";
import { TOTAL_FRAMES, FPS, REEL_W, REEL_H } from "./hinge/timing";

// Hinge for Hiring — boss-POV Tal reel (720×900, 30fps, ~10.3s).
// The hiring manager swipes through candidate cards, requests a resume,
// and chats — "Hinge, but for hiring."
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HingeForHiring"
      component={Hinge}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={REEL_W}
      height={REEL_H}
    />
  );
};
