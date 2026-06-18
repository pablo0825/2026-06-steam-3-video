import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  CARD_BORDER,
  GREEN,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
  YELLOW,
} from "../theme/colors";

// 第 5 頁：原型的目的
//   S12：標題「原型的目的」＋論點句（最低成本 × 驗證問題）
//   S13：三張卡片依序翻入（測試玩法 / 視覺風格 / 技術評估）
//   S14：每張卡蓋上「✓ 已驗證」印章

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

type Card = {
  emoji: string;
  label: string;
  color: string;
  x: number;
  flipStart: number;
  stampStart: number;
};
const CARDS: Card[] = [
  { emoji: "🎮", label: "測試玩法", color: CARD_BORDER, x: 480, flipStart: 90, stampStart: 195 },
  { emoji: "🎨", label: "視覺風格", color: CARD_BORDER, x: 960, flipStart: 210, stampStart: 315 },
  { emoji: "⚙️", label: "技術評估", color: CARD_BORDER, x: 1440, flipStart: 330, stampStart: 435 },
];

export const Page5PrototypeGoal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const thesisIn = spring({ frame: frame - 30, fps, config: { damping: 16, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 160,
          transform: `translate(-50%, -50%) scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`,
          opacity: titleIn,
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: 4,
          color: TEXT_DARK,
        }}
      >
        原型的目的
      </div>

      {/* 論點句 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 300,
          transform: `translate(-50%, ${interpolate(thesisIn, [0, 1], [20, 0])}px)`,
          opacity: thesisIn,
          fontSize: 46,
          fontWeight: 500,
          color: SUBTLE,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
        }}
      >
        不是為了「完成」，而是用
        <span style={{ color: YELLOW, fontWeight: 800, margin: "0 6px" }}>最低成本</span>
        驗證問題
      </div>

      {/* 三張卡片 */}
      {CARDS.map((c) => {
        const flip = spring({ frame: frame - c.flipStart, fps, config: { damping: 13, stiffness: 150 } });
        const angle = interpolate(flip, [0, 1], [95, 0]);
        const stamp = spring({ frame: frame - c.stampStart, fps, config: { damping: 9, stiffness: 140 } });
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: c.x,
              top: 665,
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
                border: `5px solid ${c.color}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
                boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.08)}`,
              }}
            >
              <div style={{ fontSize: 120, lineHeight: 1 }}>{c.emoji}</div>
              <div style={{ fontSize: 50, fontWeight: 800, color: TEXT_DARK }}>{c.label}</div>
            </div>

            {/* ✓ 已驗證 印章 */}
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
  );
};
