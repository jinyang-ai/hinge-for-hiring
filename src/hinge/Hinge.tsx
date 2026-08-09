// ============================================================
// Tal Reel 2 — 4:5 cut. Root wrapper. Composes Scene 1 (Title) +
// Scene 2 (Stack) off a single global frame; the title straddles
// the boundary on exit. Fonts loaded here; Anton (Obviously Narrow)
// exposed as --font-anton on the stage.
// ============================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import "./hinge.css";
import { SCENES } from "./timing";
import { OBVIOUSLY } from "./fonts";
import { Title } from "./Title";
import { Stack } from "./Stack";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true });

export const Hinge: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      className="r245-stage"
      style={{
        fontFamily: inter.fontFamily,
        ["--font-anton" as string]: OBVIOUSLY,
      }}
    >
      {/* Scene 2 sits under the title; the title flies up and off to reveal it */}
      {frame >= SCENES.chat.start - 8 && <Stack frame={frame} />}
      <Title frame={frame} />
    </AbsoluteFill>
  );
};
