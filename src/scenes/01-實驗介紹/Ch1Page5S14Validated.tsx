import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, CARD_BORDER, GREEN, NEUTRAL_50, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 5 頁・S14：三個問題皆可先驗證（150 幀）
const CONTENT_OUT = [130, 150] as const;
const CARDS = [
  { emoji: "🎮", label: "測試玩法", x: 480, stampStart: 0 },
  { emoji: "🎨", label: "視覺風格", x: 960, stampStart: 45 },
  { emoji: "⚙️", label: "技術評估", x: 1440, stampStart: 90 },
] as const;

export const Ch1Page5S14Validated: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        {CARDS.map((card) => {
          const stamp = spring({
            frame: frame - card.stampStart,
            fps,
            config: { damping: 9, stiffness: 140 },
          });

          return (
            <div
              key={card.label}
              style={{
                position: "absolute",
                left: card.x,
                top: 540,
                width: 380,
                height: 360,
                marginLeft: -190,
                marginTop: -180,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 32,
                  background: WHITE,
                  border: `5px solid ${CARD_BORDER}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 28,
                  boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.08)}`,
                }}
              >
                <div style={{ fontSize: 120, lineHeight: 1 }}>{card.emoji}</div>
                <div style={{ fontSize: 50, fontWeight: 800, color: TEXT_DARK }}>{card.label}</div>
              </div>

              {stamp > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -28,
                    right: -24,
                    transform: `rotate(-12deg) scale(${stamp})`,
                    background: GREEN,
                    color: WHITE,
                    fontSize: 30,
                    fontWeight: 800,
                    padding: "10px 20px",
                    borderRadius: 12,
                    boxShadow: `0 8px 20px ${withAlpha(GREEN, 0.35)}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ 已驗證
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
