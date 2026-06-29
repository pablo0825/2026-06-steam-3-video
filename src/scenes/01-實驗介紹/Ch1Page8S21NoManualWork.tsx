import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BLUE,
  DIVIDER,
  GREEN,
  HAIRLINE,
  HEADER_BG,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { VerdictBadge } from "../../components/VerdictBadge";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 8 頁・S21：左右結論對比（90 幀）
const CONTENT_OUT = [72, 90] as const;
const LX = 520;
const RX = 1400;
const CHIP_W = 520;
const HEADER_Y = 210;
const HLINE_Y = 720;
const LEFT_Y = [350, 480, 610] as const;
const RIGHT_Y = [350, 480] as const;
const LEFT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, highlight: false },
  { emoji: "🤖", text: "它給你答案", color: SUBTLE, highlight: false },
  { emoji: "🧑", text: "你自己貼到文件", color: RED, highlight: true },
] as const;
const RIGHT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, highlight: false },
  { emoji: "⚡", text: "直接幫你寫進文件", color: GREEN, highlight: true },
] as const;

const Chip: React.FC<{
  item: { emoji: string; text: string; color: string; highlight: boolean };
  cx: number;
  y: number;
}> = ({ item, cx, y }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: y,
      width: CHIP_W,
      marginLeft: -CHIP_W / 2,
      transform: "translateY(-50%)",
      background: item.highlight ? `${item.color}1a` : "transparent",
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "18px 30px",
    }}
  >
    <span style={{ fontSize: 52 }}>{item.emoji}</span>
    <span
      style={{
        fontSize: 42,
        fontWeight: item.highlight ? 800 : 600,
        color: item.highlight ? item.color : TEXT_DARK,
        whiteSpace: "nowrap",
      }}
    >
      {item.text}
    </span>
  </div>
);

const Verdict: React.FC<{
  cx: number;
  kind: "pass" | "fail";
  text: string;
  scale: number;
}> = ({ cx, kind, text, scale }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: 800,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity: scale <= 0 ? 0 : 1,
    }}
  >
    <VerdictBadge kind={kind} label={text} />
  </div>
);

export const Ch1Page8S21NoManualWork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const leftVerdict = spring({ frame: frame - 10, fps, config: { damping: 11, stiffness: 130 } });
  const rightVerdict = spring({ frame: frame - 30, fps, config: { damping: 11, stiffness: 130 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 150,
            width: 0,
            height: 760,
            borderLeft: `3px dashed ${DIVIDER}`,
            transform: "translateX(-50%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: LX,
            top: HEADER_Y,
            transform: "translate(-50%, -50%)",
            background: HEADER_BG,
            color: TEXT_DARK,
            fontSize: 44,
            fontWeight: 800,
            padding: "12px 40px",
            borderRadius: 999,
          }}
        >
          ChatGPT
        </div>

        <div
          style={{
            position: "absolute",
            left: RX,
            top: HEADER_Y,
            transform: "translate(-50%, -50%)",
            background: BLUE,
            color: WHITE,
            fontSize: 44,
            fontWeight: 800,
            padding: "12px 40px",
            borderRadius: 999,
            boxShadow: `0 10px 24px ${withAlpha(BLUE, 0.3)}`,
          }}
        >
          Codex
        </div>

        {LEFT.map((item, index) => (
          <Chip key={item.text} item={item} cx={LX} y={LEFT_Y[index]} />
        ))}
        {RIGHT.map((item, index) => (
          <Chip key={item.text} item={item} cx={RX} y={RIGHT_Y[index]} />
        ))}

        <div
          style={{
            position: "absolute",
            left: 180,
            top: HLINE_Y,
            width: 1560,
            height: 0,
            borderTop: `3px dashed ${HAIRLINE}`,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        />

        <Verdict cx={LX} kind="fail" text="還要自己動手" scale={leftVerdict} />
        <Verdict cx={RX} kind="pass" text="完全不用動手" scale={rightVerdict} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
