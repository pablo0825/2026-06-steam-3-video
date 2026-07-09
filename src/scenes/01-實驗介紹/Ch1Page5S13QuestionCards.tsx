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

// 第 1 集・第 5 頁・S13：三個可透過原型驗證的問題，並逐一蓋上「已驗證」（390 幀）
//   原本被拆成 S13(三張卡翻牌)/S14(逐一蓋章) 兩顆，此處合併回單一連續鏡頭：
//   三張卡翻牌進場 → 約 f=240 逐一彈出「✓ 已驗證」綠章。
const CONTENT_OUT = [368, 389] as const;

// 蓋章（第二拍）於三張卡翻完後開始。
const STAMP_OFFSET = 240;

const CARDS = [
  { emoji: "🎮", label: "測試玩法", x: 480, flipStart: 0, stampStart: STAMP_OFFSET + 0 },
  { emoji: "🎨", label: "視覺風格", x: 960, flipStart: 80, stampStart: STAMP_OFFSET + 45 },
  { emoji: "⚙️", label: "技術評估", x: 1440, flipStart: 160, stampStart: STAMP_OFFSET + 90 },
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
