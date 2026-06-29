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

// 第 3 集・第 2 頁・S04：User Story 定義（360 幀）
const DEFINITION_IN = [44, 62] as const;
const CONTENT_OUT = [332, 356] as const;

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

export const Ch3Page2S04UserStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionOpacity = interpolate(frame, DEFINITION_IN, [0, 1], clamp);
  const out = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: out,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: 6,
            color: TEXT_DARK,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
            opacity: titleIn,
          }}
        >
          User Story
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: 2,
            color: SUBTLE,
            opacity: definitionOpacity,
            whiteSpace: "nowrap",
          }}
        >
          用一段話，描述<span style={KEY}>使用者的需求</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
