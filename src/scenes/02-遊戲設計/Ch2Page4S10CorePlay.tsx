import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CHIP_BG, NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 2 集・第 4 頁・S10：核心玩法定義（220 幀）
const CONTENT_OUT = [184, 212] as const;
const DEFINITION_IN = [24, 54] as const;
const PROMPT_IN = [92, 114] as const;
const PROMPT_Y = [92, 112] as const;

export const Ch2Page4S10CorePlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionOpacity = interpolate(frame, DEFINITION_IN, [0, 1], clamp);
  const promptOpacity = interpolate(frame, PROMPT_IN, [0, 1], clamp);
  const promptY = interpolate(frame, PROMPT_Y, [30, 0], easeOutExpo);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: 8,
            color: TEXT_DARK,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
            opacity: titleIn,
          }}
        >
          核心玩法
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 52,
            fontWeight: 500,
            letterSpacing: 2,
            color: SUBTLE,
            opacity: definitionOpacity,
            whiteSpace: "nowrap",
          }}
        >
          玩家在遊戲中
          <span style={{ color: YELLOW, fontWeight: 800 }}>
            最常重複的動作
          </span>
        </div>
        <div
          style={{
            marginTop: 64,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 2,
            color: TEXT_DARK,
            background: CHIP_BG,
            padding: "18px 44px",
            borderRadius: 999,
            opacity: promptOpacity,
            transform: `translateY(${promptY}px)`,
            whiteSpace: "nowrap",
          }}
        >
          觀察：哪些動作最常重複？
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
