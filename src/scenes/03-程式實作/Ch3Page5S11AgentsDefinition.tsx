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

// 第 3 集・第 5 頁・S11：AGENTS.md 定義（150 幀）
export const Ch3Page5S11AgentsDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, [34, 58], [0, 1], clamp);
  const out = interpolate(frame, [126, 148], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: out,
        }}
      >
        <div
          style={{
            fontSize: 94,
            fontWeight: 900,
            letterSpacing: 3,
            color: TEXT_DARK,
            opacity: titleIn,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
          }}
        >
          AGENTS.md
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 2,
            color: SUBTLE,
            opacity: definitionIn,
            whiteSpace: "nowrap",
          }}
        >
          讓 AI 了解
          <span style={{ color: YELLOW, fontWeight: 800 }}>專案需求</span>
          與
          <span style={{ color: YELLOW, fontWeight: 800 }}>協作規則</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
