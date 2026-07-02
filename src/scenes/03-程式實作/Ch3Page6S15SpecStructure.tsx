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
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

const FIELDS = [
  { title: "User Story", description: "從使用者角度描述功能", emoji: "👤" },
  {
    title: "Input / Output",
    description: "玩家輸入什麼，遊戲回應什麼",
    emoji: "🔄",
  },
  { title: "Rules", description: "功能的規則與限制", emoji: "📋" },
  { title: "Non-goals", description: "這次不實作的範圍", emoji: "🚫" },
  { title: "Acceptance Criteria", description: "怎樣才算完成", emoji: "✅" },
  { title: "Notes", description: "其他補充與備註", emoji: "📝" },
] as const;

export const Ch3Page6S15SpecStructure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const groupIn = interpolate(frame, [70, 120], [0, 1], easeStandard);
  const out = interpolate(frame, [980, 1018], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 84,
            transform: `translateX(-50%) scale(${interpolate(
              titleIn,
              [0, 1],
              [0.94, 1],
            )})`,
            opacity: titleIn,
            fontSize: 64,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 3,
          }}
        >
          Spec 結構
        </div>

        {FIELDS.map((field, index) => {
          const column = index % 3;
          const row = Math.floor(index / 3);
          const startX = 175 + column * 550; // 左右邊距各 175，整排水平置中
          const startY = 315 + row * 300;
          const cardIn = interpolate(
            frame,
            [70 + index * 7, 112 + index * 7],
            [0, 1],
            easeStandard,
          );
          const highlightStart = 180 + index * 108;
          const highlightIn = interpolate(
            frame,
            [highlightStart, highlightStart + 18],
            [0, 1],
            easeOutExpo,
          );
          const highlightOut = interpolate(
            frame,
            [highlightStart + 92, highlightStart + 112],
            [1, 0],
            easeStandard,
          );
          const highlight = Math.min(highlightIn, highlightOut);

          return (
            <div
              key={field.title}
              style={{
                position: "absolute",
                left: startX,
                top: startY,
                width: 470,
                height: 225,
                transform: `translateY(${interpolate(
                  cardIn,
                  [0, 1],
                  [22, 0],
                )}px) scale(${interpolate(highlight, [0, 1], [1, 1.04])})`,
                transformOrigin: "center",
                opacity: cardIn * groupIn,
                borderRadius: 26,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "0 34px",
                backgroundColor: WHITE,
                border: `3px solid ${highlight > 0.15 ? YELLOW : CARD_BORDER}`,
                boxShadow: `0 18px 42px ${withAlpha(
                  highlight > 0.15 ? YELLOW : TEXT_DARK,
                  highlight > 0.15 ? 0.14 : 0.07,
                )}`,
              }}
            >
              <div style={{ flex: "0 0 auto", fontSize: 46, lineHeight: 1 }}>
                {field.emoji}
              </div>
              <div>
                <div
                  style={{
                    fontSize: field.title === "Acceptance Criteria" ? 30 : 34,
                    fontWeight: 900,
                    color: highlight > 0.15 ? YELLOW : TEXT_DARK,
                    whiteSpace: "nowrap",
                  }}
                >
                  {field.title}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    fontSize: 25,
                    fontWeight: 700,
                    lineHeight: 1.45,
                    color: SUBTLE,
                  }}
                >
                  {field.description}
                </div>
              </div>
            </div>
          );
        })}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
