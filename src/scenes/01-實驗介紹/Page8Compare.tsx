import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BLUE,
  DIVIDER,
  GREEN,
  HAIRLINE,
  HEADER_BG,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { VerdictBadge } from "../../components/VerdictBadge";

// 第 8 頁：ChatGPT vs Codex（左右對比）
//   S19：左欄 ChatGPT 三步驟，最後「你自己貼到文件」紅色強調費工
//   S20：右欄 Codex 兩步驟，最後「直接幫你寫進文件」綠色
//   S21：右欄蓋「✋ 不用動手」，左欄標「多一道手動工」

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LX = 520; // 左欄中心
const RX = 1400; // 右欄中心
const CHIP_W = 520;

type Item = { emoji: string; text: string; color: string; start: number; highlight?: boolean };
const LEFT: Item[] = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, start: 40 },
  { emoji: "🤖", text: "它給你答案", color: SUBTLE, start: 95 },
  { emoji: "🧑", text: "你自己貼到文件", color: RED, start: 150, highlight: true },
];
const RIGHT: Item[] = [
  { emoji: "💬", text: "你問它問題", color: SUBTLE, start: 350 },
  { emoji: "⚡", text: "直接幫你寫進文件", color: GREEN, start: 405, highlight: true },
];

const LEFT_Y = [350, 480, 610];
const RIGHT_Y = [350, 480];
const FOOT_START = 540;
const HEADER_Y = 210;
const HLINE_Y = 720;

const Chip: React.FC<{ item: Item; cx: number; y: number; s: number }> = ({ item, cx, y, s }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: y,
      width: CHIP_W,
      marginLeft: -CHIP_W / 2,
      transform: `translateY(-50%) scale(${s})`,
      opacity: s <= 0 ? 0 : 1,
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

// 定位 + 進場（scale）的外層；視覺交給 VerdictBadge
const Verdict: React.FC<{
  cx: number;
  kind: "pass" | "fail";
  text: string;
  s: number;
}> = ({ cx, kind, text, s }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: 800,
      transform: `translate(-50%, -50%) scale(${s})`,
      opacity: s <= 0 ? 0 : 1,
    }}
  >
    <VerdictBadge kind={kind} label={text} />
  </div>
);

export const Page8Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftHead = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 120 } });
  const rightHead = spring({ frame: frame - 320, fps, config: { damping: 14, stiffness: 120 } });
  const leftV = spring({ frame: frame - (FOOT_START + 10), fps, config: { damping: 11, stiffness: 130 } });
  const rightV = spring({ frame: frame - (FOOT_START + 30), fps, config: { damping: 11, stiffness: 130 } });

  const sp = (start: number) => spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 中間分隔線（短淡入） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 150,
          width: 0,
          height: 760,
          borderLeft: `3px dashed ${DIVIDER}`,
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* 左欄標題 ChatGPT */}
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

      {/* 右欄標題 Codex */}
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

      {/* 左欄步驟 */}
      {LEFT.map((it, i) => (
        <Chip key={i} item={it} cx={LX} y={LEFT_Y[i]} s={sp(it.start)} />
      ))}

      {/* 右欄步驟 */}
      {RIGHT.map((it, i) => (
        <Chip key={i} item={it} cx={RX} y={RIGHT_Y[i]} s={sp(it.start)} />
      ))}

      {/* 橫線（上＝過程 / 下＝結論）：在 FOOT_START 短淡入 */}
      <div
        style={{
          position: "absolute",
          left: 180, // 線左緣（960 − 1560/2）
          top: HLINE_Y,
          width: 1560,
          height: 0,
          borderTop: `3px dashed ${HAIRLINE}`,
          opacity: interpolate(frame, [FOOT_START, FOOT_START + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* 結論對比 */}
      <Verdict cx={LX} kind="fail" text="還要自己動手" s={leftV} />
      <Verdict cx={RX} kind="pass" text="完全不用動手" s={rightV} />
    </AbsoluteFill>
  );
};
