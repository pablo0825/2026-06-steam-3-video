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

// 第 1 集・第 8 頁・S19：ChatGPT vs Codex 對比＋結論（630 幀）
//   原本被拆成 S19(建左欄)/S20(建右欄)/S21(左右結論徽章) 三顆，此處合併回單一連續鏡頭：
//   左欄 ChatGPT 只建一次並持續留著 → 約 f=300（Codex 那句）後建右欄 Codex →
//   約 f=540 兩欄建完後，底部分隔線＋左右結論徽章（✗ 還要自己動手 / ✓ 完全不用動手）。
const CONTENT_OUT = [608, 629] as const;
const LX = 520;
const RX = 1400;
const CHIP_W = 520;
const HEADER_Y = 210;
const HLINE_Y = 720;
const LEFT_Y = [350, 480, 610] as const;
const RIGHT_Y = [350, 480] as const;

// 右欄延後於左句講完後（~300 幀）開始建。
const RIGHT_OFFSET = 300;
// 結論徽章在兩欄建完後（~540 幀）出現。
const VERDICT_OFFSET = 540;

const LEFT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, start: 40, highlight: false },
  { emoji: "🤖", text: "它給你答案", color: SUBTLE, start: 95, highlight: false },
  { emoji: "🧑", text: "你自己貼到文件", color: RED, start: 150, highlight: true },
] as const;
const RIGHT = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, start: RIGHT_OFFSET + 50, highlight: false },
  { emoji: "⚡", text: "直接幫你寫進文件", color: GREEN, start: RIGHT_OFFSET + 105, highlight: true },
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

export const Ch1Page8S19Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const leftHead = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 120 } });
  const rightHead = spring({
    frame: frame - (RIGHT_OFFSET + 20),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const chipScale = (start: number) =>
    spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 120 } });
  const leftVerdict = spring({
    frame: frame - (VERDICT_OFFSET + 10),
    fps,
    config: { damping: 11, stiffness: 130 },
  });
  const rightVerdict = spring({
    frame: frame - (VERDICT_OFFSET + 30),
    fps,
    config: { damping: 11, stiffness: 130 },
  });

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
          <Chip key={item.text} item={item} cx={LX} y={LEFT_Y[index]} scale={chipScale(item.start)} />
        ))}

        {RIGHT.map((item, index) => (
          <Chip key={item.text} item={item} cx={RX} y={RIGHT_Y[index]} scale={chipScale(item.start)} />
        ))}

        <div
          style={{
            position: "absolute",
            left: 180,
            top: HLINE_Y,
            width: 1560,
            height: 0,
            borderTop: `3px dashed ${HAIRLINE}`,
            opacity: interpolate(frame, [VERDICT_OFFSET, VERDICT_OFFSET + 8], [0, 1], clamp),
          }}
        />

        <Verdict cx={LX} kind="fail" text="還要自己動手" scale={leftVerdict} />
        <Verdict cx={RX} kind="pass" text="完全不用動手" scale={rightVerdict} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
