import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, easeStandard } from "../../theme/motion";
import {
  CORE_LOOP_ARROW_PATHS,
  CoreLoopDiagram,
  type CoreLoopNodeData,
} from "./CoreLoopDiagram";

// 第 2 集・第 5 頁・S14：核心循環框架建立（234 幀，結尾不淡出、保持原樣到最後）
const NODE_START = [48, 84, 120, 156] as const;
const ARROW_START = [72, 108, 144, 180] as const;

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "打怪・解謎", icon: "action" },
  { label: "達成", example: "抵達終點", icon: "achievement" },
  { label: "回饋", example: "經驗值・錢", icon: "feedback" },
  { label: "成長", example: "升級・買裝備", icon: "growth" },
];

export const Ch2Page5S14LoopFramework: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ transform: "translateY(-62px)" }}>
        <CoreLoopDiagram
          nodes={NODES}
          nodeProgress={NODE_START.map((start) =>
            spring({
              frame: frame - start,
              fps,
              config: { damping: 15, stiffness: 125 },
            }),
          )}
          exampleProgress={[0, 0, 0, 0]}
          arrowProgress={CORE_LOOP_ARROW_PATHS.map((_, index) =>
            interpolate(
              frame,
              [ARROW_START[index], ARROW_START[index] + 30],
              [0, 1],
              easeStandard,
            ),
          )}
          activeIndex={-1}
          markerPrefix="page5-s14-loop-arrow"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
