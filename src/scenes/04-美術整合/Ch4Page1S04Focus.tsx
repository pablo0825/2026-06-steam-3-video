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
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 1 頁・S04：本次重點三卡（245 幀）
//   原合併檔的 1015–1260 區間已全部 −1015 重新基準化為 0 起算。進場淡入 × 結尾淡出到 NEUTRAL_50。
const S4_IN = [5, 29] as const;
const ENDING_FADE = [217, 245] as const;
const FOCUS_FIRST = 37;
const FOCUS_STEP = 26;
const FOCUS_CARDS: { icon: string; label: string }[] = [
  { icon: "📋", label: "AI 協助產生美術規格表" },
  { icon: "🤖", label: "用 AI 生假素材" },
  { icon: "✅", label: "Unity 驗證規格" },
];

export const Ch4Page1S04Focus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity =
    interpolate(frame, S4_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: sceneOpacity,
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
        <div style={{ display: "flex", gap: 48 }}>
          {FOCUS_CARDS.map((c, i) => {
            const s = spring({
              frame: frame - (FOCUS_FIRST + i * FOCUS_STEP),
              fps,
              config: { damping: 15, stiffness: 120 },
            });
            return (
              <div
                key={c.label}
                style={{
                  width: 480,
                  padding: "52px 32px",
                  background: WHITE,
                  border: `2px solid ${CARD_BORDER}`,
                  borderRadius: 28,
                  boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [48, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div style={{ fontSize: 76 }}>{c.icon}</div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: TEXT_DARK,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
