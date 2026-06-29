import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 3 頁・S06：遊戲原型是什麼？（90 幀）
const CONTENT_OUT = [76, 90] as const;

export const Ch1Page3S06Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const questionIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const markPulse = 1 + 0.08 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: `translate(-50%, -50%) scale(${questionIn})`,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 100,
            fontWeight: 800,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          遊戲原型
          <span style={{ color: SUBTLE, fontWeight: 500 }}>＝</span>
          <span style={{ color: YELLOW, transform: `scale(${markPulse})`, display: "inline-block" }}>
            ？
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
