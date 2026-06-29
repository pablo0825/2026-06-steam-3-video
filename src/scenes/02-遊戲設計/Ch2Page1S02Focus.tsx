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
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 1 頁・S02：本次重點（240 幀）
const CONTENT_IN = [0, 20] as const;
const CONTENT_OUT = [218, 240] as const;

const FOCUS_CARDS = [
  { icon: "📄", title: "遊戲設計文件", tag: "跟 AI 討論並產出" },
  { icon: "🎬", title: "Storyboard", tag: "請 AI 協助產出" },
] as const;

export const Ch2Page1S02Focus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity =
    interpolate(frame, CONTENT_IN, [0, 1], clamp) *
    interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const card1 = spring({
    frame: frame - 28,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const card2 = spring({
    frame: frame - 54,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

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
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: 6,
            color: TEXT_DARK,
            marginBottom: 64,
          }}
        >
          本次重點
        </div>
        <div style={{ display: "flex", gap: 56 }}>
          {FOCUS_CARDS.map((card, index) => {
            const progress = index === 0 ? card1 : card2;

            return (
              <div
                key={card.title}
                style={{
                  width: 520,
                  padding: "56px 40px",
                  background: WHITE,
                  border: `2px solid ${CARD_BORDER}`,
                  borderRadius: 28,
                  boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [48, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                <div style={{ fontSize: 92 }}>{card.icon}</div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 800,
                    color: TEXT_DARK,
                    letterSpacing: 2,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: BLUE,
                    background: withAlpha(BLUE, 0.1),
                    padding: "10px 26px",
                    borderRadius: 999,
                    letterSpacing: 1,
                  }}
                >
                  {card.tag}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
