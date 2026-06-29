import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  DIVIDER,
  GREEN,
  HEADER_BG,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 8 頁・S20：Codex 右欄兩步驟（240 幀）
const CONTENT_OUT = [218, 240] as const;
const LX = 520;
const RX = 1400;
const CHIP_W = 520;
const HEADER_Y = 210;
const LEFT_Y = [350, 480, 610] as const;
const RIGHT_Y = [350, 480] as const;
const LEFT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, highlight: false },
  { emoji: "🤖", text: "它給你答案", color: SUBTLE, highlight: false },
  { emoji: "🧑", text: "你自己貼到文件", color: RED, highlight: true },
] as const;
const RIGHT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, start: 50, highlight: false },
  { emoji: "⚡", text: "直接幫你寫進文件", color: GREEN, start: 105, highlight: true },
] as const;

const Chip: React.FC<{
  item: { emoji: string; text: string; color: string; highlight: boolean };
  cx: number;
  y: number;
  scale: number;
}> = ({ item, cx, y, scale }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: y,
      width: CHIP_W,
      marginLeft: -CHIP_W / 2,
      transform: `translateY(-50%) scale(${scale})`,
      opacity: scale <= 0 ? 0 : 1,
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

export const Ch1Page8S20Codex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const rightHead = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 120 } });
  const chipScale = (start: number) =>
    spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 120 } });

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
            opacity: 1,
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
            transform: `translate(-50%, -50%) scale(${rightHead})`,
            opacity: rightHead,
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
          <Chip key={item.text} item={item} cx={LX} y={LEFT_Y[index]} scale={1} />
        ))}

        {RIGHT.map((item, index) => (
          <Chip key={item.text} item={item} cx={RX} y={RIGHT_Y[index]} scale={chipScale(item.start)} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
