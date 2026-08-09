// ============================================================
// Hinge for Hiring — root wrapper. The "Hinge for hiring" lockup opens the
// reel (rises from below → settles at top), then the candidate stack rises in
// under it. One global frame drives both. Playfair exposed as --font-playfair.
// ============================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import "./hinge.css";
import { SCENES } from "./timing";
import { HingeLockup } from "./HingeLockup";
import { Stack } from "./Stack";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true });
// Playfair Display — elegant serif for the "Hinge" wordmark in the headline.
const playfair = loadPlayfair("italic", { weights: ["500", "600"], ignoreTooManyRequestsWarning: true });

export const Hinge: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      className="r245-stage"
      style={{
        fontFamily: inter.fontFamily,
        ["--font-playfair" as string]: playfair.fontFamily,
      }}
    >
      {/* the candidate stack rises in under the lockup once it starts settling */}
      {frame >= SCENES.chat.start - 8 && <Stack frame={frame} />}
      {/* the "Hinge for hiring" lockup: opener + persistent headline */}
      <HingeLockup frame={frame} />
    </AbsoluteFill>
  );
};
