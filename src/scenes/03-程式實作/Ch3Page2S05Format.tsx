import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";
import { HighlightWord } from "../../components/HighlightWord";

// 第 3 集・第 2 頁・S05：User Story 固定句型（384 幀）
//   一整句置中當畫面中心亮點，逐段出現：每段（連接詞＋「重點詞」）先進場，
//   該段出現後其重點詞才用 HighlightWord 刷上黃襯底高亮，再帶出下一段。Ch4 DefinitionCard 風格。
const HOLD = 24; // 進場白底先停留的幀數
const FADE_DURATION = 28; // 結尾淡出花幾幀
const TAIL_HOLD = 12; // 淡出後再留幾幀全白底（末幀乾淨）
const SEG_FIRST = 4; // 第一段進場
const SEG_STEP = 72; // 每段（進場＋高亮）的間隔（拉長，讓高亮停留更久再帶下一段）
const HL_DELAY = 22; // 段落出現後，重點詞才開始高亮
const HL_RAMP = 18; // 高亮漸入幀數

// 整行版面保留：各段在最終位置淡入，避免逐段出現時其他字位移
const SEGMENTS = [
  { pre: "身為一位「", word: "角色", post: "」，" },
  { pre: "我想要「", word: "需求", post: "」，" },
  { pre: "為了「", word: "某個目的", post: "」。" },
] as const;

export const Ch3Page2S05Format: React.FC = () => {
  // 開場白底先停留 HOLD 幀：整段往後延（負幀時 spring／interpolate 自動維持初始＝白底）
  const frame = useCurrentFrame() - HOLD;
  const { fps, durationInFrames } = useVideoConfig();

  // 結尾淡出：以實際時間軸（未偏移）反推起訖，末幀維持全白底。
  const fadeOut = interpolate(
    frame + HOLD,
    [
      durationInFrames - FADE_DURATION - TAIL_HOLD,
      durationInFrames - TAIL_HOLD,
    ],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: fadeOut,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: 2,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const at = SEG_FIRST + i * SEG_STEP;
            // 該段進場（純淡入，不做位移以免文字次像素抖動）
            const appear = spring({
              frame: frame - at,
              fps,
              config: { damping: 18, stiffness: 120 },
            });
            // 該段出現後，重點詞才高亮
            const hl = interpolate(
              frame,
              [at + HL_DELAY, at + HL_DELAY + HL_RAMP],
              [0, 1],
              ease,
            );
            return (
              <span
                key={seg.word}
                style={{
                  display: "inline-block",
                  opacity: appear,
                }}
              >
                {seg.pre}
                <HighlightWord show={hl} fromColor={TEXT_DARK}>
                  {seg.word}
                </HighlightWord>
                {seg.post}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
