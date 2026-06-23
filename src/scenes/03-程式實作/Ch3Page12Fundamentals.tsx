import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";

// 第 3 集・第 12 頁 S23：提醒「基本功很重要」（白底文字卡＋SVG 動畫）
//   標題 → 兩段重點依序升起 → 程式碼／Unity 圖示匯入放大鏡（Task 2）→ 結論（Task 2）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const POINTS: { num: string; node: React.ReactNode }[] = [
  {
    num: "①",
    node: (
      <>
        AI 寫程式很快，
        <span style={{ color: YELLOW, fontWeight: 900 }}>
          不代表程式語法或 Unity 操作不重要
        </span>
      </>
    ),
  },
  {
    num: "②",
    node: (
      <>
        有基本功，才能
        <span style={{ color: YELLOW, fontWeight: 900 }}>更快找到問題</span>
        ，並清楚描述給 AI
      </>
    ),
  },
];

export const Ch3Page12Fundamentals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const out = interpolate(frame, [300, 315], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}
    >
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 110,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 64,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
          whiteSpace: "nowrap",
        }}
      >
        提醒：<span style={{ color: YELLOW }}>基本功</span>很重要
      </div>

      {/* 兩段重點 */}
      {POINTS.map((p, i) => {
        const rise = spring({
          frame: frame - (40 + i * 55),
          fps,
          config: { damping: 18, stiffness: 120, overshootClamping: true },
        });
        return (
          <div
            key={p.num}
            style={{
              position: "absolute",
              left: 320,
              top: 280 + i * 120,
              width: 1280,
              opacity: rise,
              transform: `translateY(${interpolate(rise, [0, 1], [24, 0])}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.4,
              color: TEXT_DARK,
            }}
          >
            <span style={{ color: YELLOW, fontWeight: 900, flexShrink: 0 }}>
              {p.num}
            </span>
            <div>{p.node}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
