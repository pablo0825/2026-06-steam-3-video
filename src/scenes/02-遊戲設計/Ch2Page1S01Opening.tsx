import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { OpeningTitle } from "../../components/OpeningTitle";

// 第 2 集・第 1 頁・S01：開場標題（210 幀，結尾淡出到 NEUTRAL_50）
const CONTENT_OUT = [188, 209] as const;

export const Ch2Page1S01Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <OpeningTitle subtitle="第 2 集・遊戲設計" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
