import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, NEUTRAL_50, SUBTLE, WHITE, withAlpha, YELLOW } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 7 頁・S17：Codex 是 OpenAI 開發的 AI Agent（150 幀）
const CONTENT_OUT = [130, 150] as const;
const CODEX = { x: 960, y: 500, w: 360, h: 190 };

export const Ch1Page7S17CodexAgent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const codexIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const openaiOpacity = interpolate(frame, [15, 35], [0, 1], clamp);
  const tagIn = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            left: CODEX.x,
            top: CODEX.y,
            width: CODEX.w,
            height: CODEX.h,
            marginLeft: -CODEX.w / 2,
            marginTop: -CODEX.h / 2,
            transform: `scale(${codexIn})`,
            opacity: codexIn,
            borderRadius: 28,
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WHITE,
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: 1,
            boxShadow: `0 20px 50px ${withAlpha(BLUE, 0.32)}`,
          }}
        >
          Codex
        </div>

        <div
          style={{
            position: "absolute",
            left: CODEX.x,
            top: CODEX.y - CODEX.h / 2 - 60,
            transform: `translate(-50%, ${interpolate(tagIn, [0, 1], [30, 0])}px) rotate(-4deg) scale(${tagIn})`,
            opacity: tagIn <= 0 ? 0 : 1,
            background: YELLOW,
            color: WHITE,
            fontSize: 34,
            fontWeight: 800,
            padding: "10px 26px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: `0 8px 20px ${withAlpha(YELLOW, 0.35)}`,
          }}
        >
          AI Agent
        </div>

        <div
          style={{
            position: "absolute",
            left: CODEX.x,
            top: CODEX.y + CODEX.h / 2 + 42,
            transform: "translateX(-50%)",
            opacity: openaiOpacity,
            fontSize: 36,
            fontWeight: 600,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          by OpenAI
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
