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

// 第 4 集・第 9 頁・S19：美術規格表（360 幀）
//   白底 8 欄表格，外框淡入 → 表頭依序出現 → 三列逐列填入 → 底部範本註，結尾淡出到 NEUTRAL_50。

const ENDING_FADE = [332, 360] as const; // 結尾淡出到 NEUTRAL_50

export const Ch4Page9S19ArtSpecTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 120,
            transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
            opacity: titleIn,
            fontSize: 64,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 4,
          }}
        >
          美術規格表
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
