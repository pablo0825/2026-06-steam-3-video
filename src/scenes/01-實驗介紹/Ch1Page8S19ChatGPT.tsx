import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  DIVIDER,
  HEADER_BG,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 8 頁・S19：ChatGPT 左欄三步驟（300 幀）
const CONTENT_OUT = [278, 300] as const;
const LX = 520;
const CHIP_W = 520;
const LEFT_Y = [350, 480, 610] as const;
const HEADER_Y = 210;
const LEFT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, start: 40, highlight: false },
  { emoji: "🤖", text: "它給你答案", color: SUBTLE, start: 95, highlight: false },
  { emoji: "🧑", text: "你自己貼到文件", color: RED, start: 150, highlight: true },
] as const;

const Chip: React.FC<{
  item: (typeof LEFT)[number];
  y: number;
  scale: number;
}> = ({ item, y, scale }) => (
  <div
    style={{
      position: "absolute",
      left: LX,
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

export const Ch1Page8S19ChatGPT: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const leftHead = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 120 } });
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
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: LX,
            top: HEADER_Y,
            transform: `translate(-50%, -50%) scale(${leftHead})`,
            opacity: leftHead,
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

        {LEFT.map((item, index) => (
          <Chip key={item.text} item={item} y={LEFT_Y[index]} scale={chipScale(item.start)} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
