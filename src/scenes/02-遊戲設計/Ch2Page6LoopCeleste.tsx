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
  BLUE,
  BORDER_LIGHT,
  DASH_BORDER,
  PANEL_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import {
  CORE_LOOP_ARROW_PATHS,
  CoreLoopDiagram,
  type CoreLoopNodeData,
} from "./CoreLoopDiagram";

// 第 2 集・第 6 頁：Celeste 核心循環
//   S16：剪輯軟體置換用的影片佔位卡
//   S17：沿用 Page 5 循環圖，套用 Celeste → 對比角色成長／技術突破 → 結論

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// 節奏（30 fps；總長 840 frames）
const PLACEHOLDER_OUT = [210, 238] as const;
const LOOP_START = 252;
const NODE_START = [282, 312, 342, 372] as const;
const ARROW_START = [300, 330, 360, 390] as const;
const EXAMPLE_START = [450, 510, 570, 630] as const;
const SHIFT = [668, 706] as const;
const COMPARE_IN = [702, 734] as const;
const COMPARE_OUT = [758, 788] as const;
const CONCLUSION_IN = [786, 818] as const;

const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const NODES: CoreLoopNodeData[] = [
  { label: "動作", example: "跳躍・衝刺・攀牆", icon: "action" },
  { label: "達成", example: "抵達安全平台", icon: "achievement" },
  { label: "回饋", example: "緊張・刺激感", icon: "feedback" },
  { label: "成長", example: "技術上的突破", icon: "growth" },
];

export const Ch2Page6LoopCeleste: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const ease = { ...clamp, easing: EASE };

  // S16：影片佔位卡
  const placeholderOut = interpolate(frame, PLACEHOLDER_OUT, [1, 0], clamp);
  const placeholderTitle = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const placeholderIn = interpolate(frame, [28, 60], [0, 1], ease);

  // S17：Celeste 循環
  const loopOp =
    interpolate(frame, [LOOP_START, LOOP_START + 28], [0, 1], clamp) *
    interpolate(frame, [COMPARE_OUT[0], COMPARE_OUT[1]], [1, 0], clamp);
  const titleY = interpolate(frame, [LOOP_START, LOOP_START + 28], [20, 0], ease);
  const activeIndex =
    frame >= SHIFT[0]
      ? -1
      : frame >= EXAMPLE_START[3]
        ? 3
        : frame >= EXAMPLE_START[2]
          ? 2
          : frame >= EXAMPLE_START[1]
            ? 1
            : frame >= EXAMPLE_START[0]
              ? 0
              : -1;

  const diagramScale = interpolate(frame, SHIFT, [1, 0.72], ease);
  const diagramX = interpolate(frame, SHIFT, [0, -350], ease);

  // 對比與結論
  const compareOp =
    interpolate(frame, COMPARE_IN, [0, 1], clamp) *
    interpolate(frame, COMPARE_OUT, [1, 0], clamp);
  const compareX = interpolate(frame, COMPARE_IN, [50, 0], ease);
  const conclusionOp = interpolate(frame, CONCLUSION_IN, [0, 1], clamp);
  const conclusionY = interpolate(frame, CONCLUSION_IN, [32, 0], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* S16：後製剪輯用影片佔位卡 */}
      {frame < LOOP_START && (
        <AbsoluteFill
          style={{
            opacity: placeholderOut,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 145,
              fontSize: 70,
              fontWeight: 800,
              letterSpacing: 5,
              color: TEXT_DARK,
              opacity: placeholderTitle,
              transform: `scale(${interpolate(
                placeholderTitle,
                [0, 1],
                [0.94, 1],
              )})`,
            }}
          >
            Celeste 遊戲影片
          </div>

          <div
            style={{
              position: "absolute",
              left: 960,
              top: 610,
              width: 1040,
              height: 585,
              transform: `translate(-50%, -50%) translateY(${interpolate(
                placeholderIn,
                [0, 1],
                [55, 0],
              )}px)`,
              opacity: placeholderIn,
              borderRadius: 24,
              border: `4px dashed ${DASH_BORDER}`,
              backgroundColor: PANEL_BG,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
              <rect
                x="8"
                y="18"
                width="76"
                height="56"
                rx="10"
                fill="none"
                stroke={SUBTLE}
                strokeWidth="4"
              />
              <path d="M40 34 62 46 40 58Z" fill={SUBTLE} />
            </svg>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: 3,
                color: TEXT_DARK,
              }}
            >
              剪輯時置換影片素材
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 2,
                color: SUBTLE,
              }}
            >
              建議保留約 8 秒
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* S17：Celeste 核心循環 */}
      {frame >= LOOP_START && (
        <AbsoluteFill style={{ opacity: loopOp }}>
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
                interpolate(frame, [start, start + 26], [0, 1], ease),
              )}
              arrowProgress={CORE_LOOP_ARROW_PATHS.map((_, index) =>
                interpolate(
                  frame,
                  [ARROW_START[index], ARROW_START[index] + 24],
                  [0, 1],
                  ease,
                ),
              )}
              activeIndex={activeIndex}
              markerPrefix="page6-loop-arrow"
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
              opacity: compareOp,
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
      )}

      {/* S17 收尾結論 */}
      {frame >= CONCLUSION_IN[0] && (
        <AbsoluteFill
          style={{
            opacity: conclusionOp,
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
      )}
    </AbsoluteFill>
  );
};
