import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { OpeningTitle } from "../../components/OpeningTitle";

// 第 3 集・第 1 頁・S01：開場標題（210 幀，結尾淡出到 NEUTRAL_50）
const ENDING_FADE = [188, 210] as const;

export const Ch3Page1S01Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <OpeningTitle subtitle="第 3 集・程式實作" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
