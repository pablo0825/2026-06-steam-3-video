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

// 第 2 集・第 3 頁・S08：節奏醫生限制說明透明 Overlay（339 幀）
const BAR_OUT = [48, 72] as const;
const VEIL_IN = [102, 130] as const;
const HEADING_IN = [138, 168] as const;
const LABEL_START = [180, 222, 264] as const;
const INFO_OUT = [294, 318] as const;
const VEIL_OUT = [306, 338] as const;
const END_FILL = [310, 338] as const;

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const LABELS: { emoji: string; node: React.ReactNode }[] = [
  {
    emoji: "⌨️",
    node: (
      <>
        節奏到<span style={KEY}>第 7 拍</span>，按下空白鍵
      </>
    ),
  },
  {
    emoji: "☝️",
    node: (
      <>
        全程只靠<span style={KEY}>一個按鍵</span>
      </>
    ),
  },
  {
    emoji: "🎯",
    node: (
      <>
        注意力集中在<span style={KEY}>節拍 × 時間</span>
      </>
    ),
  },
];

export const Ch2Page3S08LimitOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.54], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);
  const headingIn = interpolate(frame, HEADING_IN, [0, 1], easeStandard);
  const infoOut = interpolate(frame, INFO_OUT, [1, 0], clamp);

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
          節奏醫生 Rhythm Doctor
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 220,
          transform: `translate(-50%, ${interpolate(headingIn, [0, 1], [16, 0])}px)`,
          opacity: headingIn * infoOut,
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: 4,
          color: WHITE,
          textShadow: `0 3px 18px ${withAlpha(BLACK, 0.45)}`,
          whiteSpace: "nowrap",
        }}
      >
        它的「<span style={{ color: YELLOW }}>限制</span>」在哪？
      </div>

      {LABELS.map((label, index) => {
        const progress = spring({
          frame: frame - LABEL_START[index],
          fps,
          config: { damping: 16, stiffness: 130, mass: 0.8 },
        });
        const y = 400 + index * 150;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 960,
              top: y,
              width: 900,
              minHeight: 104,
              transform: `translate(-50%, -50%) translateY(${interpolate(
                progress,
                [0, 1],
                [30, 0],
              )}px) scale(${interpolate(progress, [0, 1], [0.97, 1])})`,
              opacity: progress * infoOut,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "20px 42px 20px 80px",
              boxSizing: "border-box",
              borderRadius: 22,
              backgroundColor: withAlpha(WHITE, 0.94),
              border: `2px solid ${withAlpha(BORDER_LIGHT, 0.9)}`,
              boxShadow: `0 18px 46px ${withAlpha(BLACK, 0.22)}`,
            }}
          >
            <div
              style={{
                width: 52,
                flexShrink: 0,
                fontSize: 42,
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              {label.emoji}
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "left",
                paddingRight: 68,
                fontSize: 42,
                fontWeight: 650,
                letterSpacing: 2,
                color: TEXT_DARK,
                whiteSpace: "nowrap",
              }}
            >
              {label.node}
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: endFill }} />
    </AbsoluteFill>
  );
};
