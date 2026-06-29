import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARD_BORDER,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 1 頁・S02：本次重點（240 幀）
const CONTENT_IN = [0, 20] as const;
const CONTENT_OUT = [218, 240] as const;

type LinePart = { text: string; hl: boolean };

const FOCUS_CARDS: { icon: string; parts: LinePart[] }[] = [
  {
    icon: "📝",
    parts: [
      { text: "根據 Storyboard 撰寫 ", hl: false },
      { text: "User Story", hl: true },
    ],
  },
  {
    icon: "🤖",
    parts: [
      { text: "基於 ", hl: false },
      { text: "Spec", hl: true },
      { text: " 與 ", hl: false },
      { text: "AI", hl: true },
      { text: " 協作開發遊戲", hl: false },
    ],
  },
];

const HiliteLine: React.FC<{ parts: LinePart[] }> = ({ parts }) => (
  <div
    style={{
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: 1,
      lineHeight: 1.4,
      color: TEXT_DARK,
    }}
  >
    {parts.map((p, i) => (
      <span key={i} style={{ color: p.hl ? YELLOW : TEXT_DARK }}>
        {p.text}
      </span>
    ))}
  </div>
);

export const Ch3Page1S02Focus: React.FC = () => {
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
    frame: frame - 60,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {FOCUS_CARDS.map((c, i) => {
            const s = i === 0 ? card1 : card2;
            return (
              <div
                key={c.icon}
                style={{
                  width: 1080,
                  padding: "40px 56px",
                  background: WHITE,
                  border: `2px solid ${CARD_BORDER}`,
                  borderRadius: 28,
                  boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                  opacity: s,
                  transform: `translateX(${interpolate(s, [0, 1], [-56, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 36,
                }}
              >
                <div style={{ fontSize: 72 }}>{c.icon}</div>
                <HiliteLine parts={c.parts} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
