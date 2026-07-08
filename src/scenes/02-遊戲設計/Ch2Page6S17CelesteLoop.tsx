import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
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

// 第 2 集・第 6 頁・S17：Celeste 核心循環對比（620 幀，無標題、迴圈位置對齊 S15-02）
//   整個迴圈直接淡入 → 行進脈衝高亮（跑完回中性）→ 迴圈原地淡出 → 對比資訊置中出現 → 結論。
const EXAMPLE_START = [70, 130, 190, 250] as const;
const HL_RAMP = 14; // 高亮淡入／淡出幀數
const HL_HOLD = 50; // 高亮停留（起點→開始淡出）；與下一個交疊成行進脈衝
const DIAGRAM_OUT = [332, 362] as const; // 高亮回中性後，迴圈原地淡出
const COMPARE_IN = [366, 398] as const; // 對比資訊置中淡入
const COMPARE_OUT = [472, 498] as const;
const CONCLUSION_IN = [508, 540] as const; // 對比完全淡出（498）後留 10 幀空檔再淡入
const CONTENT_OUT = [590, 616] as const;

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "跳躍・衝刺・攀牆", icon: "action" },
  { label: "達成", example: "抵達安全平台", icon: "achievement" },
  { label: "回饋", example: "緊張・刺激感", icon: "feedback" },
  { label: "成長", example: "技術上的突破", icon: "growth" },
];

export const Ch2Page6S17CelesteLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const contentOut = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  // 迴圈：開場淡入 → 高亮跑完、回中性後於 DIAGRAM_OUT 原地淡出
  const diagramOpacity =
    interpolate(frame, [0, 28], [0, 1], clamp) *
    interpolate(frame, DIAGRAM_OUT, [1, 0], clamp);

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

  const compareOpacity =
    interpolate(frame, COMPARE_IN, [0, 1], clamp) *
    interpolate(frame, COMPARE_OUT, [1, 0], clamp);
  const compareY = interpolate(frame, COMPARE_IN, [40, 0], easeStandard);
  const conclusionOpacity =
    interpolate(frame, CONCLUSION_IN, [0, 1], clamp) * contentOut;
  const conclusionY = interpolate(frame, CONCLUSION_IN, [32, 0], easeStandard);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOut }}>
        {/* 迴圈（位置對齊 S15-02，原地淡出、不左移） */}
        <AbsoluteFill
          style={{
            opacity: diagramOpacity,
            transform: "translateY(-62px)",
          }}
        >
          <CoreLoopDiagram
            nodes={NODES}
            nodeProgress={[1, 1, 1, 1]}
            exampleProgress={EXAMPLE_START.map((start) =>
              interpolate(frame, [start, start + 26], [0, 1], easeStandard),
            )}
            arrowProgress={CORE_LOOP_ARROW_PATHS.map(() => 1)}
            highlight={highlight}
            markerPrefix="page6-s17-loop-arrow"
            exampleFontSize={22}
          />
        </AbsoluteFill>

        {/* 對比資訊（置中出現） */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: compareOpacity,
          }}
        >
          <div
            style={{
              width: 760,
              transform: `translateY(${compareY}px)`,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: 3,
                color: SUBTLE,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              兩種不同的成長體驗
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 1fr",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  padding: "38px 26px",
                  border: `2px solid ${BORDER_LIGHT}`,
                  borderRadius: 22,
                  textAlign: "center",
                  backgroundColor: WHITE,
                  boxShadow: `0 12px 28px ${withAlpha(TEXT_DARK, 0.06)}`,
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 700, color: SUBTLE }}>
                  打怪遊戲
                </div>
                <div
                  style={{
                    marginTop: 20,
                    fontSize: 46,
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
                  fontSize: 32,
                  fontWeight: 800,
                  color: SUBTLE,
                }}
              >
                VS
              </div>

              <div
                style={{
                  padding: "38px 26px",
                  border: `3px solid ${YELLOW}`,
                  borderRadius: 22,
                  textAlign: "center",
                  backgroundColor: WHITE,
                  boxShadow: `0 16px 36px ${withAlpha(YELLOW, 0.16)}`,
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 700, color: SUBTLE }}>
                  Celeste
                </div>
                <div
                  style={{
                    marginTop: 20,
                    fontSize: 46,
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

        {/* 結論（置中） */}
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
