import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, NEUTRAL_50, WHITE, YELLOW, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 3 頁・S07-02：Rhythm Doctor User Story 透明 Overlay（600 幀）
//   開場先出貼底黑條（出處條）並淡出，空檔後半透明黑底才淡入；
//   再套用 Ch3Page2S05Format 的句型版面：兩行置中、「」括號段逐段淡入，
//   括號詞直接以黃字強調（跟著該段一起淡入）；結尾淡入白底銜接 S08。
const BAR_OUT = [104, 128] as const; // 開場黑條全程存在，veil 出現前才淡出消失
const VEIL_IN = [160, 188] as const; // 空檔後半透明黑底才淡入
const END_FILL = [566, 594] as const; // 結尾淡入滿版 NEUTRAL_50；594 前收到純白、末幾幀停白，無縫接 S08
const SEG_FIRST = 200; // 第一段進場（veil 出現後）
const SEG_STEP = 72; // 每段進場的間隔

// 兩行置中：line 0 兩段、line 1 一段
const SEGMENTS = [
  { pre: "身為一位", word: "「玩家」", post: "，", line: 0 },
  { pre: "我想要", word: "「在第七拍按下空白鍵」", post: "，", line: 0 },
  { pre: "為了", word: "「配合節奏救活病人，完成關卡」", post: "。", line: 1 },
] as const;

export const Ch3Page3S07UserStoryOverlay02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const veilOpacity = interpolate(frame, VEIL_IN, [0, 0.6], clamp);
  // 結尾淡入滿版白底，蓋掉遊戲畫面與句子，停在純白銜接 S08（NEUTRAL_50）
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);
  // 開場即滿版存在（不淡入），veil 出現前才淡出消失
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);

  // 各段以全域索引計算進場／高亮時序，再依 line 分兩行排版
  const rendered = SEGMENTS.map((seg, i) => {
    const at = SEG_FIRST + i * SEG_STEP;
    const appear = spring({
      frame: frame - at,
      fps,
      config: { damping: 18, stiffness: 120 },
    });
    return {
      line: seg.line,
      el: (
        <span
          key={seg.word}
          style={{ display: "inline-block", opacity: appear }}
        >
          {seg.pre}
          <span style={{ color: YELLOW, fontWeight: 800 }}>{seg.word}</span>
          {seg.post}
        </span>
      ),
    };
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: 2,
            lineHeight: 1.75,
            color: WHITE,
            whiteSpace: "nowrap",
            textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
          }}
        >
          {[0, 1].map((li) => (
            <div key={li}>
              {rendered.filter((r) => r.line === li).map((r) => r.el)}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* 開場貼底黑條（出處條）：開場即存在、停留，於 veil 出現前淡出 */}
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
          此影片僅用於教學實驗上
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

      {/* 結尾淡入滿版白底，與下一支 S08（NEUTRAL_50）無縫銜接 */}
      <AbsoluteFill
        style={{ backgroundColor: NEUTRAL_50, opacity: endFill }}
      />
    </AbsoluteFill>
  );
};
