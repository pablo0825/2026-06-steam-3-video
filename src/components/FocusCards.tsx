import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../theme/colors";
import { FONT, clamp } from "../theme/motion";

// 共用「本次重點」卡片版型（Ch4 S04 風格）：
//   小淡灰標題 + emoji 圓底直式卡片，依序由下彈入；場景整體淡入／淡出。
//   文字支援行內黃字強調（LinePart），長文字置中折行。
export type LinePart = { text: string; hl?: boolean };
export type FocusCard = { icon: string; parts: LinePart[] };

const HiliteLabel: React.FC<{ parts: LinePart[] }> = ({ parts }) => (
  <div
    style={{
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: 1,
      lineHeight: 1.4,
      color: TEXT_DARK,
      textAlign: "center",
      maxWidth: 360,
    }}
  >
    {parts.map((p, i) => (
      <span key={i} style={{ color: p.hl ? YELLOW : TEXT_DARK }}>
        {p.text}
      </span>
    ))}
  </div>
);

export const FocusCards: React.FC<{
  heading?: string;
  cards: FocusCard[];
  /** 第一張卡片進場的起始幀 */
  firstFrame?: number;
  /** 卡片之間的 stagger 間隔（幀） */
  step?: number;
  /** 場景淡入區間 */
  inRange: readonly [number, number];
  /** 場景淡出區間 */
  outRange: readonly [number, number];
}> = ({
  heading = "本次重點",
  cards,
  firstFrame = 37,
  step = 26,
  inRange,
  outRange,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity =
    interpolate(frame, inRange, [0, 1], clamp) *
    interpolate(frame, outRange, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{ opacity, justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: 6,
            color: SUBTLE,
            marginBottom: 64,
          }}
        >
          {heading}
        </div>
        {/* 固定寬 + 左右內推 240 + grid 等分欄：各欄中心等距，不受字長影響 */}
        <div
          style={{
            width: 1920,
            padding: "0 240px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
            alignItems: "start",
          }}
        >
          {cards.map((c, i) => {
            const s = spring({
              frame: frame - (firstFrame + i * step),
              fps,
              config: { damping: 15, stiffness: 120 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [48, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                {/* emoji 淡色圓底 */}
                <div
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 999,
                    background: WHITE,
                    boxShadow: `0 8px 24px ${withAlpha(TEXT_DARK, 0.06)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: 76 }}>{c.icon}</div>
                </div>
                <HiliteLabel parts={c.parts} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
