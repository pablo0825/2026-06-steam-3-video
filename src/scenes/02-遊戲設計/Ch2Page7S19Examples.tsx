import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import {
  FullscreenStoryboardImage,
  STORYBOARD_SAMPLES,
} from "./Ch2Page7StoryboardShared";

// 第 2 集・第 7 頁・S19：三張分鏡圖案例（276 幀）
export const Ch2Page7S19Examples: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {STORYBOARD_SAMPLES.map((sample) => (
        <FullscreenStoryboardImage
          key={sample.src}
          src={sample.src}
          opacity={
            interpolate(frame, sample.fadeIn, [0, 1], clamp) *
            interpolate(frame, sample.fadeOut, [1, 0], clamp)
          }
          scale={interpolate(
            frame,
            [sample.fadeIn[0], sample.fadeOut[1]],
            [1, 1.025],
            clamp,
          )}
          objectPosition={sample.objectPosition}
        />
      ))}
    </AbsoluteFill>
  );
};
