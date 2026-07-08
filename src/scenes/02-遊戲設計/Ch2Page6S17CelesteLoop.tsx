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
  BORDER_LIGHT,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";
import {
  CORE_LOOP_ARROW_PATHS,
  CoreLoopDiagram,
  type CoreLoopNodeData,
} from "./CoreLoopDiagram";

// 第 2 集・第 6 頁・S17：Celeste 核心循環對比（588 幀）
const NODE_START = [30, 60, 90, 120] as const;
const ARROW_START = [48, 78, 108, 138] as const;
const EXAMPLE_START = [198, 258, 318, 378] as const;
const HL_RAMP = 14; // 高亮淡入／淡出幀數
const HL_HOLD = 50; // 高亮停留（起點→開始淡出）；與下一個交疊成行進脈衝
const SHIFT = [416, 454] as const;
const COMPARE_IN = [450, 482] as const;
const COMPARE_OUT = [506, 536] as const;
const CONCLUSION_IN = [534, 566] as const;
const CONTENT_OUT = [566, 587] as const;

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "跳躍・衝刺・攀牆", icon: "action" },
  { label: "達成", example: "抵達安全平台", icon: "achievement" },
  { label: "回饋", example: "緊張・刺激感", icon: "feedback" },
  { label: "成長", example: "技術上的突破", icon: "growth" },
];

export const Ch2Page6S17CelesteLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const contentOut = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  const loopOpacity =
    interpolate(frame, [0, 28], [0, 1], clamp) *
    interpolate(frame, COMPARE_OUT, [1, 0], clamp);
  const titleY = interpolate(frame, [0, 28], [20, 0], easeStandard);
  // 行進脈衝：每個節點/箭頭高亮淡入→停留→淡出（先快後慢），彼此交疊繞行、結束回原色。
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

  const diagramScale = interpolate(frame, SHIFT, [1, 0.72], easeStandard);
  const diagramX = interpolate(frame, SHIFT, [0, -350], easeStandard);
  const compareOpacity =
    interpolate(frame, COMPARE_IN, [0, 1], clamp) *
    interpolate(frame, COMPARE_OUT, [1, 0], clamp);
  const compareX = interpolate(frame, COMPARE_IN, [50, 0], easeStandard);
  const conclusionOpacity = interpolate(frame, CONCLUSION_IN, [0, 1], clamp) * contentOut;
  const conclusionY = interpolate(frame, CONCLUSION_IN, [32, 0], easeStandard);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOut }}>
        <AbsoluteFill style={{ opacity: loopOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 92,
              transform: `translate(-50%, ${titleY}px)`,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 5,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
              zIndex: 4,
            }}
          >
            核心循環：<span style={KEY}>Celeste</span>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${diagramX}px) scale(${diagramScale})`,
              transformOrigin: "960px 590px",
            }}
          >
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
                interpolate(frame, [start, start + 26], [0, 1], easeStandard),
              )}
              arrowProgress={CORE_LOOP_ARROW_PATHS.map((_, index) =>
                interpolate(
                  frame,
                  [ARROW_START[index], ARROW_START[index] + 24],
                  [0, 1],
                  easeStandard,
                ),
              )}
              highlight={highlight}
              markerPrefix="page6-s17-loop-arrow"
              exampleFontSize={22}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 1465,
              top: 560,
              width: 600,
              transform: `translate(-50%, -50%) translateX(${compareX}px)`,
              opacity: compareOpacity,
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 3,
                color: SUBTLE,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              兩種不同的成長體驗
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  padding: "30px 22px",
                  border: `2px solid ${BORDER_LIGHT}`,
                  borderRadius: 20,
                  textAlign: "center",
                  backgroundColor: WHITE,
                  boxShadow: `0 12px 28px ${withAlpha(TEXT_DARK, 0.06)}`,
                }}
              >
                <div style={{ fontSize: 27, fontWeight: 700, color: SUBTLE }}>
                  打怪遊戲
                </div>
                <div
                  style={{
                    marginTop: 18,
                    fontSize: 40,
                    fontWeight: 800,
                    color: TEXT_DARK,
                    whiteSpace: "nowrap",
                  }}
                >
                  角色成長
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                  color: SUBTLE,
                }}
              >
                VS
              </div>

              <div
                style={{
                  padding: "30px 22px",
                  border: `3px solid ${YELLOW}`,
                  borderRadius: 20,
                  textAlign: "center",
                  backgroundColor: WHITE,
                  boxShadow: `0 16px 36px ${withAlpha(YELLOW, 0.16)}`,
                }}
              >
                <div style={{ fontSize: 27, fontWeight: 700, color: SUBTLE }}>
                  Celeste
                </div>
                <div
                  style={{
                    marginTop: 18,
                    fontSize: 40,
                    fontWeight: 800,
                    color: YELLOW,
                    whiteSpace: "nowrap",
                  }}
                >
                  技術突破
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            opacity: conclusionOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              transform: `translateY(${conclusionY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 38,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: 5,
                color: TEXT_DARK,
              }}
            >
              循環設計
            </span>
            <span style={{ fontSize: 68, fontWeight: 800, color: BLUE }}>→</span>
            <span
              style={{
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: 5,
                color: YELLOW,
              }}
            >
              影響遊戲體驗
            </span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
