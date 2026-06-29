import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CHIP_BG, NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeSoft } from "../../theme/motion";

// 第 2 集・第 7 頁・S18：Storyboard 定義與案例提示（240 幀）
const CONTENT_OUT = [214, 240] as const;
const DEFINITION_IN = [36, 68] as const;
const PROMPT_IN = [104, 130] as const;

export const Ch2Page7S18StoryboardIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const title = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionOpacity = interpolate(frame, DEFINITION_IN, [0, 1], clamp);
  const promptOpacity = interpolate(frame, PROMPT_IN, [0, 1], clamp);
  const promptY = interpolate(frame, PROMPT_IN, [28, 0], easeSoft);

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
            opacity: title,
            transform: `scale(${interpolate(title, [0, 1], [0.92, 1])})`,
          }}
        >
          Storyboard
        </div>

        <div
          style={{
            marginTop: 56,
            maxWidth: 1500,
            textAlign: "center",
            fontSize: 48,
            fontWeight: 500,
            lineHeight: 1.55,
            letterSpacing: 2,
            color: SUBTLE,
            opacity: definitionOpacity,
          }}
        >
          Storyboard 是用
          <span style={{ color: YELLOW, fontWeight: 800 }}>連續畫面</span>
          ，呈現玩家在遊戲中經歷的工具
        </div>

        <div
          style={{
            marginTop: 58,
            padding: "18px 44px",
            borderRadius: 999,
            backgroundColor: CHIP_BG,
            color: TEXT_DARK,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 2,
            opacity: promptOpacity,
            transform: `translateY(${promptY}px)`,
          }}
        >
          一起看幾個案例
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
