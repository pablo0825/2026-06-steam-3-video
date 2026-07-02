import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";
import {
  CORE_LOOP_ARROW_PATHS,
  CoreLoopDiagram,
  type CoreLoopNodeData,
} from "./CoreLoopDiagram";

// 第 2 集・第 5 頁・S15：打怪遊戲核心循環（650 幀）
const TITLE_IN = [0, 28] as const;
const EXAMPLE_START = [46, 166, 286, 406] as const;
const NEXT_IN = [560, 590] as const;
const CONTENT_OUT = [626, 649] as const;
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "打怪・解謎", icon: "action" },
  { label: "達成", example: "抵達終點", icon: "achievement" },
  { label: "回饋", example: "經驗值・錢", icon: "feedback" },
  { label: "成長", example: "升級・買裝備", icon: "growth" },
];

export const Ch2Page5S15MonsterLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleOpacity = interpolate(frame, TITLE_IN, [0, 1], clamp);
  const titleY = interpolate(frame, TITLE_IN, [20, 0], easeStandard);

  const activeIndex =
    frame >= EXAMPLE_START[3]
      ? 3
      : frame >= EXAMPLE_START[2]
        ? 2
        : frame >= EXAMPLE_START[1]
          ? 1
          : frame >= EXAMPLE_START[0]
            ? 0
            : -1;

  const nextOpacity = interpolate(frame, NEXT_IN, [0, 1], clamp);
  const nextX =
    frame >= NEXT_IN[0] ? ((1 - Math.cos((frame - NEXT_IN[0]) / 7)) / 2) * 8 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 112,
            transform: `translate(-50%, ${titleY}px)`,
            opacity: titleOpacity,
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: 5,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          核心循環：<span style={KEY}>打怪遊戲</span>
        </div>

        <CoreLoopDiagram
          nodes={NODES}
          nodeProgress={[1, 1, 1, 1]}
          exampleProgress={EXAMPLE_START.map((start) =>
            interpolate(frame, [start, start + 26], [0, 1], easeStandard),
          )}
          arrowProgress={CORE_LOOP_ARROW_PATHS.map(() => 1)}
          activeIndex={activeIndex}
          markerPrefix="page5-s15-loop-arrow"
        />

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 1005,
            transform: "translateX(-50%)",
            opacity: nextOpacity,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 3,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          換一個遊戲看看{" "}
          <span
            style={{
              display: "inline-block",
              color: YELLOW,
              transform: `translateX(${nextX}px)`,
            }}
          >
            →
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
