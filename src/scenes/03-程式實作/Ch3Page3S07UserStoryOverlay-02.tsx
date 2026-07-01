import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, WHITE, YELLOW, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 3 頁・S07-02：Rhythm Doctor User Story 透明 Overlay（600 幀）
//   套用 Ch3Page2S05Format 的句型版面：兩行置中、「」括號段逐段淡入，
//   括號詞直接以黃字強調（跟著該段一起淡入）。
const VEIL_IN = [8, 36] as const;
const VEIL_OUT = [570, 600] as const;
const SEG_FIRST = 110; // 第一段進場（標題出現後）
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

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);

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
          opacity: infoOut,
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
    </AbsoluteFill>
  );
};
