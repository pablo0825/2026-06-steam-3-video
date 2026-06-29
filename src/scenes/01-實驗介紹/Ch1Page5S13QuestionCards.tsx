import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, CARD_BORDER, NEUTRAL_50, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 5 頁・S13：三個可透過原型驗證的問題（240 幀）
const CONTENT_OUT = [220, 240] as const;
const CARDS = [
  { emoji: "🎮", label: "測試玩法", x: 480, flipStart: 0 },
  { emoji: "🎨", label: "視覺風格", x: 960, flipStart: 80 },
  { emoji: "⚙️", label: "技術評估", x: 1440, flipStart: 160 },
] as const;

export const Ch1Page5S13QuestionCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        {CARDS.map((card) => {
          const flip = spring({
            frame: frame - card.flipStart,
            fps,
            config: { damping: 13, stiffness: 150 },
          });
          const angle = interpolate(flip, [0, 1], [95, 0]);

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
                transform: `perspective(1000px) rotateY(${angle}deg)`,
                opacity: flip <= 0 ? 0 : 1,
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
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
