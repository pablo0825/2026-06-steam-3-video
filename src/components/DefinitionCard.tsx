import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, SUBTLE, TEXT_DARK } from "../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../theme/motion";
import { HighlightWord } from "./HighlightWord";

// 結尾淡出：淡出 28 幀後再留 12 幀白底（NEUTRAL_50）。
// 依 durationInFrames 反推起訖，duration=240 時即還原成 [200, 228]。
const FADE_DURATION = 28; // 淡出花幾幀
const TAIL_HOLD = 12; // 結尾留幾幀

// 第一個高亮詞於第 90 幀亮起，之後每個 +30 幀錯開；每個漸變 22 幀。
const HL_START = 90;
const HL_STAGGER = 30;
const HL_RAMP = 22;

// 定義卡：大標題（術語）＋ 一句定義（中間穿插高亮詞）＋ 結尾淡出。
//   segments 描述整句：純文字段落直接印，highlight: true 的段落渲染為
//   HighlightWord，並依「第幾個高亮詞」自動算出錯開的亮起時序。
export type DefinitionSegment = { text: string; highlight?: boolean };

export const DefinitionCard: React.FC<{
  title: string;
  segments: DefinitionSegment[];
  titleSize?: number;
  /** 定義句最大寬度；給定時才換行置中（長句用），預設不限寬＝單行。 */
  defMaxWidth?: number;
  /** 第一個高亮詞亮起的幀，預設 90；短場景可提前。 */
  hlStart?: number;
  /** 高亮詞之間的錯開幀數，預設 30；短場景可壓縮。 */
  hlStagger?: number;
  /** 開場白底停留幀數；停留期間只顯示背景，不推進卡片動畫。 */
  openingHoldFrames?: number;
}> = ({
  title,
  segments,
  titleSize = 150,
  defMaxWidth,
  hlStart = HL_START,
  hlStagger = HL_STAGGER,
  openingHoldFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const localFrame = frame - openingHoldFrames;

  const fadeOut = interpolate(
    frame,
    [
      durationInFrames - FADE_DURATION - TAIL_HOLD,
      durationInFrames - TAIL_HOLD,
    ],
    [1, 0],
    clamp,
  ); // 透明度 1 → 0，做結尾淡出
  // 標題的彈簧進場
  const titleSpring = spring({
    frame: localFrame - 8, // 延後 8 幀進場
    fps,
    config: { damping: 14, stiffness: 120 }, // stiffness (剛性), damping (阻尼)
  });
  const defLine = interpolate(localFrame, [44, 70], [0, 1], ease);

  // 第 k 個高亮詞的亮起進度（0→1）
  const highlightShow = (k: number) =>
    interpolate(
      localFrame,
      [hlStart + k * hlStagger, hlStart + k * hlStagger + HL_RAMP],
      [0, 1],
      ease,
    );

  let highlightIndex = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: fadeOut,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 2,
            lineHeight: 1,
            opacity: titleSpring,
            transform: `scale(${interpolate(titleSpring, [0, 1], [0.9, 1])})`,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 46,
            fontWeight: 600,
            color: SUBTLE,
            letterSpacing: 1,
            opacity: defLine,
            transform: `translateY(${interpolate(defLine, [0, 1], [28, 0])}px)`,
            ...(defMaxWidth
              ? { maxWidth: defMaxWidth, textAlign: "center", lineHeight: 1.6 }
              : {}),
          }}
        >
          {segments.map((seg, i) =>
            seg.highlight ? (
              <HighlightWord key={i} show={highlightShow(highlightIndex++)}>
                {seg.text}
              </HighlightWord>
            ) : (
              <React.Fragment key={i}>{seg.text}</React.Fragment>
            ),
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
