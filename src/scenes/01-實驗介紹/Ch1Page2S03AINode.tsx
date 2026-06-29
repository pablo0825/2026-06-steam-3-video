import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 2 頁・S03：AI 節點（90 幀）
const CONTENT_OUT = [76, 90] as const;
const AI = { x: 960, y: 540 };
const AI_R = 95;

export const Ch1Page2S03AINode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const aiIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: AI.x,
            top: AI.y,
            width: AI_R * 2,
            height: AI_R * 2,
            marginLeft: -AI_R,
            marginTop: -AI_R,
            borderRadius: "50%",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WHITE,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: 2,
            transform: `scale(${aiIn})`,
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
            boxShadow: `0 20px 50px ${withAlpha(BLUE, 0.35)}`,
          }}
        >
          AI
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
