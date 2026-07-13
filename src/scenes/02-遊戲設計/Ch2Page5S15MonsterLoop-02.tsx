import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";
import {
  CORE_LOOP_ARROW_PATHS,
  CoreLoopDiagram,
  type CoreLoopNodeData,
} from "./CoreLoopDiagram";

// 第 2 集・第 5 頁・S15-02：打怪遊戲核心循環（650 幀，無標題、迴圈位置對齊 S14）
const OPENING_IN = [0, 24] as const; // 開場整體淡入
const EXAMPLE_START = [46, 166, 286, 406] as const;
const HL_RAMP = 16; // 高亮淡入／淡出幀數
const HL_HOLD = 110; // 高亮停留（起點→開始淡出）；與下一個交疊成行進脈衝
const CONTENT_OUT = [626, 649] as const;

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "打怪・解謎", icon: "action" },
  { label: "達成", example: "抵達終點", icon: "achievement" },
  { label: "回饋", example: "經驗值・錢", icon: "feedback" },
  { label: "成長", example: "升級・買裝備", icon: "growth" },
];

export const Ch2Page5S15MonsterLoop02: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity =
    interpolate(frame, OPENING_IN, [0, 1], clamp) *
    interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  // 行進脈衝：每個節點/箭頭高亮淡入→停留→淡出（先快後慢），彼此交疊繞行；
  // 最後一個也淡回原色。
  const highlight = EXAMPLE_START.map(
    (start) =>
      interpolate(frame, [start, start + HL_RAMP], [0, 1], easeOutExpo) *
      interpolate(
        frame,
        [start + HL_HOLD, start + HL_HOLD + HL_RAMP],
        [1, 0],
        easeOutExpo,
      ),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity, transform: "translateY(-62px)" }}>
        <CoreLoopDiagram
          nodes={NODES}
          nodeProgress={[1, 1, 1, 1]}
          swapProgress={EXAMPLE_START.map((start) =>
            interpolate(frame, [start, start + 26], [0, 1], easeStandard),
          )}
          arrowProgress={CORE_LOOP_ARROW_PATHS.map(() => 1)}
          highlight={highlight}
          markerPrefix="page5-s15-loop-arrow"
          exampleFontSize={28}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
