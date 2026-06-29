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

// 第 1 集・第 5 頁・S12：原型的目的（210 幀）
const CONTENT_OUT = [190, 210] as const;

export const Ch1Page5S12PrototypeGoal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const thesisIn = spring({
    frame: frame - 30,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 320,
            transform: `translate(-50%, -50%) scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`,
            opacity: titleIn,
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 4,
            color: TEXT_DARK,
          }}
        >
          原型的目的
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 500,
            transform: `translate(-50%, ${interpolate(thesisIn, [0, 1], [20, 0])}px)`,
            opacity: thesisIn,
            fontSize: 46,
            fontWeight: 500,
            color: SUBTLE,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          不是為了「完成」，而是用
          <span style={{ color: YELLOW, fontWeight: 800, margin: "0 6px" }}>最低成本</span>
          驗證問題
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
