import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 8 頁・S18：美術整合實作流程（270 幀）
//   四節點水平流程圖 + 黃色回饋迴圈（末節點 → 美術規格表），結尾淡出到 NEUTRAL_50。

const ENDING_FADE = [242, 270] as const; // 結尾淡出到 NEUTRAL_50

export const Ch4Page8S18ArtWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT, opacity: out }}
    >
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 60,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 2,
        }}
      >
        美術整合實作流程
      </div>
    </AbsoluteFill>
  );
};
