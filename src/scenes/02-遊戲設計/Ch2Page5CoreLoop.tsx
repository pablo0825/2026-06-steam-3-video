import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
} from "../../theme/colors";
import {
  CORE_LOOP_ARROW_PATHS,
  CoreLoopDiagram,
  type CoreLoopNodeData,
} from "./CoreLoopDiagram";

// 第 2 集・第 5 頁：核心循環
//   S13：標題＋定義＋提示膠囊
//   S14：動作 → 達成 → 回饋 → 成長，四節點與箭頭依序建立
//   S15：以打怪遊戲套用框架，逐項填入內容並高亮，最後帶出下一個案例

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// 節奏（30 fps；總長 1170 frames）
const S13_OUT = [238, 268] as const;
const S14_START = 286;
const NODE_START = [334, 370, 406, 442] as const;
const ARROW_START = [358, 394, 430, 466] as const;
const S15_START = 520;
const EXAMPLE_START = [566, 686, 806, 926] as const;
const NEXT_IN = [1080, 1110] as const;

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };
const DEFINITION = "玩家不斷重複的行為，構成遊戲的主要體驗";

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "打怪・解謎", icon: "action" },
  { label: "達成", example: "抵達終點", icon: "achievement" },
  { label: "回饋", example: "經驗值・錢", icon: "feedback" },
  { label: "成長", example: "升級・買裝備", icon: "growth" },
];

export const Ch2Page5CoreLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { ...clamp, easing: EASE };

  // S13：概念定義頁（沿用 S4／S10 三層結構）
  const s13Out = interpolate(frame, S13_OUT, [1, 0], clamp);
  const introTitle = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const definitionOp = interpolate(frame, [32, 62], [0, 1], clamp);
  const promptOp = interpolate(frame, [104, 128], [0, 1], clamp);
  const promptY = interpolate(frame, [104, 126], [30, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // S14／S15：循環圖持續存在，只更新標題、節點內容與高亮
  const diagramOp = interpolate(frame, [S14_START, S14_START + 28], [0, 1], clamp);
  const frameworkTitleOp =
    interpolate(frame, [S14_START, S14_START + 28], [0, 1], clamp) *
    interpolate(frame, [S15_START - 24, S15_START + 4], [1, 0], clamp);
  const exampleTitleOp = interpolate(frame, [S15_START, S15_START + 28], [0, 1], clamp);
  const exampleTitleY = interpolate(frame, [S15_START, S15_START + 28], [20, 0], ease);

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

  const nextOp = interpolate(frame, NEXT_IN, [0, 1], clamp);
  const nextX =
    frame >= NEXT_IN[0] ? ((1 - Math.cos((frame - NEXT_IN[0]) / 7)) / 2) * 8 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* S13：標題、定義、提示 */}
      {frame < S14_START && (
        <AbsoluteFill
          style={{
            opacity: s13Out,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            aria-label={DEFINITION}
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEXT_DARK,
              transform: `scale(${interpolate(introTitle, [0, 1], [0.92, 1])})`,
              opacity: introTitle,
            }}
          >
            核心循環
          </div>

          <div
            style={{
              marginTop: 56,
              fontSize: 50,
              fontWeight: 500,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: definitionOp,
              whiteSpace: "nowrap",
            }}
          >
            玩家<span style={KEY}>不斷重複的行為</span>，構成遊戲的主要體驗
          </div>

          <div
            style={{
              marginTop: 64,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 2,
              color: TEXT_DARK,
              background: CHIP_BG,
              padding: "18px 44px",
              borderRadius: 999,
              opacity: promptOp,
              transform: `translateY(${promptY}px)`,
              whiteSpace: "nowrap",
            }}
          >
            用框架來了解循環
          </div>
        </AbsoluteFill>
      )}

      {/* S14／S15：核心循環框架 */}
      {frame >= S14_START && (
        <AbsoluteFill style={{ opacity: diagramOp }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 112,
              transform: "translateX(-50%)",
              opacity: frameworkTitleOp,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 5,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            核心循環
          </div>

          <div
            style={{
              position: "absolute",
              left: 960,
              top: 112,
              transform: `translate(-50%, ${exampleTitleY}px)`,
              opacity: exampleTitleOp,
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
            nodeProgress={NODE_START.map((start) =>
              spring({
                frame: frame - start,
                fps,
                config: { damping: 15, stiffness: 125 },
              }),
            )}
            exampleProgress={EXAMPLE_START.map((start) =>
              interpolate(frame, [start, start + 26], [0, 1], ease),
            )}
            arrowProgress={CORE_LOOP_ARROW_PATHS.map((_, index) =>
              interpolate(
                frame,
                [ARROW_START[index], ARROW_START[index] + 30],
                [0, 1],
                ease,
              ),
            )}
            activeIndex={activeIndex}
            markerPrefix="page5-loop-arrow"
          />

          <div
            style={{
              position: "absolute",
              left: 960,
              top: 1005,
              transform: "translateX(-50%)",
              opacity: nextOp,
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
      )}
    </AbsoluteFill>
  );
};
