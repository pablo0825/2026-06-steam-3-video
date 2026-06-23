import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, SUBTLE, TEXT_DARK, WHITE, YELLOW } from "../../theme/colors";

// 第 3 集・第 12 頁 S23：提醒「基本功很重要」（白底文字卡＋SVG 動畫）
//   標題 → 兩段重點依序升起 → 程式碼／Unity 圖示匯入放大鏡（Task 2）→ 結論（Task 2）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

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

  // ── 結尾：圖示匯入放大鏡 ＋ 結論 ──
  const iconsIn = interpolate(frame, [150, 180], [0, 1], ease);
  const merge = interpolate(frame, [185, 235], [0, 1], ease);
  // 程式碼／Unity 邊滑邊淡出，趁未完全重疊前消失，避免與放大鏡擠在一起
  const iconsOut = interpolate(frame, [196, 224], [1, 0], clamp);
  const magIn = interpolate(frame, [216, 248], [0, 1], ease);
  const magHi = interpolate(frame, [248, 266], [0, 1], ease);
  const conclusionIn = interpolate(frame, [264, 296], [0, 1], ease);

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

      {/* 程式碼圖示（左 → 中央匯入） */}
      <div
        style={{
          position: "absolute",
          left: interpolate(merge, [0, 1], [760, 960]),
          top: 620,
          transform: "translate(-50%, -50%)",
          opacity: iconsIn * iconsOut,
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="84" height="84" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M18 14 8 24 18 34 M30 14 40 24 30 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
          程式語法
        </div>
      </div>

      {/* Unity 圖示（右 → 中央匯入；簡化立方體） */}
      <div
        style={{
          position: "absolute",
          left: interpolate(merge, [0, 1], [1160, 960]),
          top: 620,
          transform: "translate(-50%, -50%)",
          opacity: iconsIn * iconsOut,
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="84" height="84" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 6 40 15 40 33 24 42 8 33 8 15 Z M24 24 24 6 M24 24 8 33 M24 24 40 33"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>Unity</div>
      </div>

      {/* 放大鏡（中央，匯入後高亮） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 620,
          transform: `translate(-50%, -50%) scale(${interpolate(magIn, [0, 1], [0.7, 1])})`,
          opacity: magIn,
          color: magHi > 0.3 ? YELLOW : SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="108" height="108" viewBox="0 0 48 48" aria-hidden="true">
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M29 29 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>找到問題</div>
      </div>

      {/* 結論 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 850,
          transform: `translateX(-50%) translateY(${interpolate(conclusionIn, [0, 1], [16, 0])}px)`,
          opacity: conclusionIn,
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: YELLOW }}>基本功</span>
        <span style={{ color: TEXT_DARK, margin: "0 16px" }}>×</span>
        <span style={{ color: BLUE }}>AI</span>
        <span style={{ color: TEXT_DARK }}> 協作</span>
      </div>
    </AbsoluteFill>
  );
};
