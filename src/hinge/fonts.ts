// Obviously Narrow Bold - display face for the poster + headline.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const OBVIOUSLY = "ObviouslyNarrowBold";

// loadFont() registers its own delayRender until the file is decoded, so the
// render waits for it. We also expose the promise so the poster (fitText) can
// re-measure once the font is actually resident.
export const obviouslyReady = loadFont({
  family: OBVIOUSLY,
  url: staticFile("fonts/ObviouslyNarrowBold.otf"),
  weight: "700",
  format: "opentype",
});
