import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, SUBTLE, TEXT_DARK, WHITE, YELLOW, withAlpha } from "../../theme/colors";

// 第 3 集・第 12 頁 S23：提醒「基本功很重要」（白底文字卡＋SVG 動畫）
//   標題 → 兩段短重點 → 程式碼／Unity（＝基本功）匯入放大鏡「找到問題」並高亮
//   → 結論「基本功 × AI 協作」放大 pop 當主角

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 900 };

const POINTS: React.ReactNode[] = [
  <>
    AI 寫程式很快，<span style={KEY}>基本功一樣重要</span>
  </>,
  <>
    有基本功，才能<span style={KEY}>更快找到問題</span>、清楚描述給 AI
  </>,
];

export const Ch3Page12Fundamentals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });

  // ── 圖示匯入放大鏡 ──
  const iconsIn = interpolate(frame, [120, 150], [0, 1], ease);
  const merge = interpolate(frame, [150, 200], [0, 1], ease);
  const iconsOut = interpolate(frame, [158, 190], [1, 0], clamp);
  const magIn = interpolate(frame, [186, 216], [0, 1], ease);
  const magHi = interpolate(frame, [216, 238], [0, 1], ease);
  // 放大鏡在結論長出前完全淡出，避免標籤與結論重疊
  const magOut = interpolate(frame, [254, 276], [1, 0], clamp);
  const magPulse = 1 + 0.05 * Math.sin((frame - 216) * 0.35) * magHi * magOut;

  // ── 結論（主角，放大 pop）──
  const pop = spring({
    frame: frame - 274,
    fps,
    config: { damping: 11, stiffness: 150 },
  });
  const out = interpolate(frame, [312, 330], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}
    >
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 96,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 56,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
          whiteSpace: "nowrap",
        }}
      >
        提醒：<span style={{ color: YELLOW }}>基本功</span>很重要
      </div>

      {/* 兩段短重點 */}
      {POINTS.map((node, i) => {
        const rise = spring({
          frame: frame - (36 + i * 22),
          fps,
          config: { damping: 18, stiffness: 120, overshootClamping: true },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960,
              top: 210 + i * 64,
              transform: `translateX(-50%) translateY(${interpolate(rise, [0, 1], [18, 0])}px)`,
              opacity: rise,
              fontSize: 36,
              fontWeight: 600,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            {node}
          </div>
        );
      })}

      {/* 放大鏡高亮光暈 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 450,
          width: 360,
          height: 360,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          opacity: magHi * magOut,
          background: `radial-gradient(circle, ${withAlpha(YELLOW, 0.28)} 0%, ${withAlpha(YELLOW, 0)} 70%)`,
        }}
      />

      {/* 程式碼圖示（左 → 中央匯入） */}
      <div
        style={{
          position: "absolute",
          left: interpolate(merge, [0, 1], [740, 960]),
          top: 450,
          transform: "translate(-50%, -50%)",
          opacity: iconsIn * iconsOut,
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="116" height="116" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M18 14 8 24 18 34 M30 14 40 24 30 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>程式語法</div>
      </div>

      {/* Unity 圖示（右 → 中央匯入；簡化立方體） */}
      <div
        style={{
          position: "absolute",
          left: interpolate(merge, [0, 1], [1180, 960]),
          top: 450,
          transform: "translate(-50%, -50%)",
          opacity: iconsIn * iconsOut,
          color: SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="116" height="116" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 6 40 15 40 33 24 42 8 33 8 15 Z M24 24 24 6 M24 24 8 33 M24 24 40 33"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>Unity</div>
      </div>

      {/* 放大鏡（中央，匯入後高亮脈動） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 450,
          transform: `translate(-50%, -50%) scale(${interpolate(magIn, [0, 1], [0.7, 1]) * magPulse})`,
          opacity: magIn * magOut,
          color: magHi > 0.3 ? YELLOW : SUBTLE,
          textAlign: "center",
        }}
      >
        <svg width="168" height="168" viewBox="0 0 48 48" aria-hidden="true">
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
        <div style={{ marginTop: 4, fontSize: 24, fontWeight: 800 }}>找到問題</div>
      </div>

      {/* 結論（主角） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 560,
          transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * pop})`,
          opacity: pop,
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: YELLOW }}>基本功</span>
        <span style={{ color: TEXT_DARK, margin: "0 22px" }}>×</span>
        <span style={{ color: BLUE }}>AI</span>
        <span style={{ color: TEXT_DARK }}> 協作</span>
      </div>
    </AbsoluteFill>
  );
};
