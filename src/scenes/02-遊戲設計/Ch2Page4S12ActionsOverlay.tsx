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
  BORDER_LIGHT,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 2 集・第 4 頁・S12：Celeste 三個核心動作透明 Overlay（208 幀）
const BAR_OUT = [48, 72] as const;
const VEIL_IN = [102, 130] as const;
const HEADING_IN = [132, 152] as const;
const ACTION_START = [144, 160, 176] as const;
const CONTENT_OUT = [206, 229] as const;
const END_FILL = [206, 229] as const;

const ACTIONS = [
  { emoji: "⬆️", label: "跳躍" },
  { emoji: "🧗", label: "攀牆" },
  { emoji: "💨", label: "衝刺" },
] as const;

export const Ch2Page4S12ActionsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOut = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const veilOpacity = interpolate(frame, VEIL_IN, [0, 0.54], clamp) * contentOut;
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);
  const headingIn = interpolate(frame, HEADING_IN, [0, 1], easeStandard);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: withAlpha(BLACK, 0.82),
          opacity: barOpacity,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          此影片僅用於教學實驗
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          蔚藍 Celeste
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 235,
          transform: `translate(-50%, ${interpolate(headingIn, [0, 1], [16, 0])}px)`,
          opacity: headingIn * contentOut,
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: 4,
          color: WHITE,
          textShadow: `0 3px 18px ${withAlpha(BLACK, 0.45)}`,
          whiteSpace: "nowrap",
        }}
      >
        最常重複的 <span style={{ color: YELLOW }}>3 個動作</span>
      </div>

      {ACTIONS.map((action, index) => {
        const progress = spring({
          frame: frame - ACTION_START[index],
          fps,
          config: { damping: 16, stiffness: 130, mass: 0.8 },
        });
        const y = 405 + index * 140;

        return (
          <div
            key={action.label}
            style={{
              position: "absolute",
              left: 960,
              top: y,
              width: 720,
              minHeight: 104,
              transform: `translate(-50%, -50%) translateY(${interpolate(
                progress,
                [0, 1],
                [30, 0],
              )}px) scale(${interpolate(progress, [0, 1], [0.97, 1])})`,
              opacity: progress * contentOut,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "20px 58px",
              boxSizing: "border-box",
              borderRadius: 22,
              backgroundColor: withAlpha(WHITE, 0.94),
              border: `2px solid ${withAlpha(BORDER_LIGHT, 0.9)}`,
              boxShadow: `0 18px 46px ${withAlpha(BLACK, 0.22)}`,
            }}
          >
            <div
              style={{
                width: 60,
                flexShrink: 0,
                fontSize: 46,
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              {action.emoji}
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: 4,
                color: TEXT_DARK,
                whiteSpace: "nowrap",
              }}
            >
              {action.label}
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: endFill }} />
    </AbsoluteFill>
  );
};
