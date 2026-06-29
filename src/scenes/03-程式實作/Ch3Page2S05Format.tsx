import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 2 頁・S05：User Story 格式（360 幀）
const CONTENT_IN = [0, 20] as const;
const CARD_FIRST = 20;
const CARD_STEP = 42;
const TIP_IN = [152, 184] as const;

const STORY_CARDS = [
  { label: "身為一位", value: "角色", icon: "👤" },
  { label: "我想要", value: "需求", icon: "🎯" },
  { label: "為了", value: "價值", icon: "⭐" },
] as const;

export const Ch3Page2S05Format: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_IN, [0, 1], clamp);
  const tip = interpolate(frame, TIP_IN, [0, 1], clamp);
  const tipRise = interpolate(frame, TIP_IN, [18, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 48,
          }}
        >
          {STORY_CARDS.map((c, i) => {
            const s = spring({
              frame: frame - (CARD_FIRST + i * CARD_STEP),
              fps,
              config: { damping: 16, stiffness: 120 },
            });
            return (
              <div
                key={c.value}
                style={{
                  width: 460,
                  padding: "64px 36px",
                  background: WHITE,
                  border: `2px solid ${CARD_BORDER}`,
                  borderRadius: 28,
                  boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [56, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 84,
                    lineHeight: 1,
                  }}
                >
                  {c.icon}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    letterSpacing: 2,
                    color: SUBTLE,
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: YELLOW,
                  }}
                >
                  「{c.value}」
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 64,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 2,
            color: BLUE,
            opacity: tip,
            transform: `translateY(${tipRise}px)`,
          }}
        >
          先看案例，再一起寫 →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
