import React, { useLayoutEffect, useRef, useState } from "react";
import { useCurrentFrame, delayRender, continueRender } from "remotion";

// Seamless horizontal marquee. Renders two identical copies of the
// children side-by-side, measures one copy's width, and translates the
// pair by (frame · speed) wrapped into [0, width). When the first copy
// scrolls fully off, the second sits exactly where it started → no seam.
export const Marquee: React.FC<{
  speed: number; // px per frame (always positive)
  direction?: 1 | -1; // -1 = leftward (default), 1 = rightward
  startOffset?: number; // px head-start, to stagger lanes
  children: React.ReactNode;
}> = ({ speed, direction = -1, startOffset = 0, children }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [handle] = useState(() => delayRender("marquee-measure"));

  useLayoutEffect(() => {
    if (ref.current) setW(ref.current.scrollWidth);
    continueRender(handle);
  }, [handle]);

  // distance travelled, wrapped into one copy-width
  const travel = w > 0 ? (((frame * speed + startOffset) % w) + w) % w : 0;
  const translateX = direction === -1 ? -travel : travel - w;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        whiteSpace: "nowrap",
        willChange: "transform",
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div ref={ref} style={{ display: "flex", flexShrink: 0 }}>
        {children}
      </div>
      <div style={{ display: "flex", flexShrink: 0 }} aria-hidden>
        {children}
      </div>
    </div>
  );
};
