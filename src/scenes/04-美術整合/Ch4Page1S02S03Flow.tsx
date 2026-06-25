import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  GREEN,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard as ease } from "../../theme/motion";

const ARROW_LEN = 30; // 連線只畫到箭頭底部，由三角形當尖端

// 第 4 集・第 1 頁・S02+S03：AI 生圖的角色 → 連續四節點流程 → 主句「提早讓問題出現」
//   原合併檔的 205–1020 區間已全部 −205 重新基準化為 0 起算（815 幀）。
//   流程圖在 S02 建好後連續上移縮小進入 S03，不重建。

// S02 Beat A：AI 生圖的角色＋左右對比
const S2_IN = [5, 27] as const; // 標題淡入
const TITLE_OUT = [495, 535] as const; // 標題在進入 S03 時淡出
const CONTRAST_IN = [27, 51] as const; // 對比卡淡入
const CONTRAST_OUT = [173, 209] as const; // 對比卡淡出後才建流程
const CONTRAST_EMPH = [110, 145] as const; // 兩卡到位後：左淡、右放大強調
const LEFT_CARD = 39; // 左卡 spring 起點
const RIGHT_CARD = 71; // 右卡 spring 起點

// S02 Beat B / S03：四節點水平流程（連續，不重建）
const NODES = ["AI 生假素材", "匯入 Unity", "驗證規格", "降低重工"] as const;
const NODE_X = [360, 760, 1160, 1560] as const; // 節點中心 x（節點寬 280）
const NODE_Y = 600; // Beat B 時節點中心 y（group transform 之前）
const NODE_FIRST = 225; // 第一個節點 spring 起點
const NODE_STEP = 60; // 每個節點＋箭頭一拍的間隔
const FLOW_IN = [205, 227] as const; // 流程層淡入
const FLOW_RAISE = [535, 581] as const; // S03：流程群組上移縮小（ease-out）
const S3_OUT = [793, 815] as const; // S03 淡出
const HI_LAST = [459, 491] as const; // 「降低重工」高亮
const HI_LAST_OFF = [535, 565] as const; // 進入 S03 時「降低重工」恢復正常

// S03：回饋箭頭、問題卡、主句
const FB_DRAW = [615, 679] as const; // 回饋箭頭 draw-on
const PROBLEM_IN = 595; // 問題卡 spring 起點
const PHRASE_IN = 679; // 主句 spring 起點
const PHRASE_RULE = [699, 735] as const; // 主句黃色底線 wipe

export const Ch4Page1S02S03Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S02 Beat A：AI 生圖的角色＋對比 ─────────────
  const s2TitleOpacity =
    interpolate(frame, S2_IN, [0, 1], clamp) *
    interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const contrastOpacity =
    interpolate(frame, CONTRAST_IN, [0, 1], clamp) *
    interpolate(frame, CONTRAST_OUT, [1, 0], clamp);
  const leftCard = spring({
    frame: frame - LEFT_CARD,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const rightCard = spring({
    frame: frame - RIGHT_CARD,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const leftDim = interpolate(frame, CONTRAST_EMPH, [1, 0.35], clamp);
  const rightGrow = interpolate(frame, CONTRAST_EMPH, [1, 1.12], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ── S02 Beat B / S03：流程圖（連續）─────────────
  const flowOpacity =
    interpolate(frame, FLOW_IN, [0, 1], clamp) *
    interpolate(frame, S3_OUT, [1, 0], clamp);
  const flowRaise = interpolate(frame, FLOW_RAISE, [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const groupTy = interpolate(flowRaise, [0, 1], [0, -150]);
  const groupScale = interpolate(flowRaise, [0, 1], [1, 0.82]);
  const hiLast =
    interpolate(frame, HI_LAST, [0, 1], {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }) * interpolate(frame, HI_LAST_OFF, [1, 0], clamp);
  const nodeSpring = (i: number) =>
    spring({
      frame: frame - (NODE_FIRST + i * NODE_STEP),
      fps,
      config: { damping: 15, stiffness: 120 },
    });
  const fwdLine = (i: number) =>
    interpolate(
      frame,
      [NODE_FIRST + i * NODE_STEP + 30, NODE_FIRST + i * NODE_STEP + 58],
      [0, 1],
      ease,
    );
  const fwdArrow = (i: number) =>
    interpolate(
      frame,
      [NODE_FIRST + i * NODE_STEP + 52, NODE_FIRST + i * NODE_STEP + 64],
      [0, 1],
      clamp,
    );

  // ── S03：回饋＋主句 ────────────────────────────
  const fbDraw = interpolate(frame, FB_DRAW, [0, 1], ease);
  const fbArrow = interpolate(
    frame,
    [FB_DRAW[1] - 12, FB_DRAW[1]],
    [0, 1],
    clamp,
  );
  const fbLabel = interpolate(
    frame,
    [FB_DRAW[1] - 28, FB_DRAW[1] - 6],
    [0, 1],
    clamp,
  );
  const problemSpring = spring({
    frame: frame - PROBLEM_IN,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const phraseSpring = spring({
    frame: frame - PHRASE_IN,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const phraseRuleW = interpolate(frame, PHRASE_RULE, [0, 360], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const s3Out = interpolate(frame, S3_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* ── S02 Beat A：AI 生圖的角色＋左右對比 ── */}
      {frame < 537 && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 175,
              transform: "translateX(-50%)",
              opacity: s2TitleOpacity,
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            AI 生圖的角色
          </div>

          {frame < 211 && (
            <div
              style={{
                position: "absolute",
                left: 960,
                top: 560,
                transform: "translate(-50%, -50%)",
                opacity: contrastOpacity,
                display: "flex",
                gap: 160,
              }}
            >
              {[
                {
                  s: leftCard,
                  cap: "AI 不是",
                  capColor: SUBTLE,
                  mark: "✗",
                  markColor: RED,
                  title: "取代美術人員",
                  border: CARD_BORDER,
                },
                {
                  s: rightCard,
                  cap: "而是",
                  capColor: GREEN,
                  mark: "✓",
                  markColor: GREEN,
                  title: "優化美術工作",
                  border: GREEN,
                },
              ].map((c, i) => (
                <div
                  key={c.title}
                  style={{
                    opacity: c.s * (i === 0 ? leftDim : 1),
                    transform: `scale(${c.s * (i === 1 ? rightGrow : 1)})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: c.capColor,
                      marginBottom: 18,
                    }}
                  >
                    {c.cap}
                  </div>
                  <div
                    style={{
                      width: 480,
                      height: 280,
                      background: WHITE,
                      border: `5px solid ${c.border}`,
                      borderRadius: 28,
                      boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 18,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 110,
                        fontWeight: 900,
                        lineHeight: 1,
                        color: c.markColor,
                      }}
                    >
                      {c.mark}
                    </div>
                    <div
                      style={{
                        fontSize: 52,
                        fontWeight: 800,
                        letterSpacing: 2,
                        color: TEXT_DARK,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02 Beat B / S03：四節點流程（連續，不重建）── */}
      {frame >= 200 && frame < 817 && (
        <AbsoluteFill style={{ opacity: flowOpacity }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${groupTy}px) scale(${groupScale})`,
              transformOrigin: "960px 600px",
            }}
          >
            <svg
              width="1920"
              height="1080"
              viewBox="0 0 1920 1080"
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              {[0, 1, 2].map((i) => {
                const x1 = NODE_X[i] + 140; // 左節點右緣
                const x2 = NODE_X[i + 1] - 140; // 右節點左緣
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={NODE_Y}
                      x2={x2 - ARROW_LEN}
                      y2={NODE_Y}
                      stroke={BLUE}
                      strokeWidth={6}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - fwdLine(i)}
                    />
                    <g
                      opacity={fwdArrow(i)}
                      transform={`translate(${x2} ${NODE_Y})`}
                    >
                      <path d="M0 0 L-30 -16 L-30 16 Z" fill={BLUE} />
                    </g>
                  </g>
                );
              })}
              {/* 回饋箭頭「修正規格」：驗證規格 → AI 生假素材 */}
              <path
                d={`M ${NODE_X[2]} ${NODE_Y + 60} C ${NODE_X[2]} 810, ${NODE_X[0]} 810, ${NODE_X[0]} ${NODE_Y + 60 + ARROW_LEN}`}
                fill="none"
                stroke={YELLOW}
                strokeWidth={6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - fbDraw}
              />
              <g
                opacity={fbArrow}
                transform={`translate(${NODE_X[0]} ${NODE_Y + 60}) rotate(-90)`}
              >
                <path d="M0 0 L-30 -16 L-30 16 Z" fill={YELLOW} />
              </g>
            </svg>

            {NODES.map((label, i) => {
              const s = nodeSpring(i);
              const isLast = i === 3;
              const hi = isLast ? hiLast : 0;
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    left: NODE_X[i],
                    top: NODE_Y,
                    width: 280,
                    height: 120,
                    transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.84, isLast ? 1 + hi * 0.05 : 1])})`,
                    opacity: s,
                    borderRadius: 22,
                    background: WHITE,
                    border: `3px solid ${interpolateColors(hi, [0, 1], [CARD_BORDER, YELLOW])}`,
                    boxShadow:
                      hi > 0
                        ? `0 16px 38px ${withAlpha(YELLOW, 0.22 * hi)}`
                        : `0 14px 32px ${withAlpha(TEXT_DARK, 0.08)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: interpolateColors(hi, [0, 1], [TEXT_DARK, YELLOW]),
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </div>
              );
            })}

            <div
              style={{
                position: "absolute",
                left: NODE_X[2],
                top: NODE_Y - 150,
                transform: `translate(-50%, -50%) scale(${interpolate(problemSpring, [0, 1], [0.8, 1])})`,
                opacity: problemSpring,
                padding: "16px 30px",
                background: withAlpha(RED, 0.1),
                border: `3px solid ${withAlpha(RED, 0.7)}`,
                borderRadius: 16,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: 1,
                color: RED,
                whiteSpace: "nowrap",
              }}
            >
              規格不符？
            </div>

            {/* 修正規格 標籤：白底黃框深字，壓在回饋線上斷開連線 */}
            <div
              style={{
                position: "absolute",
                left: (NODE_X[0] + NODE_X[2]) / 2,
                top: 776,
                transform: "translate(-50%, -50%)",
                opacity: fbLabel,
                padding: "8px 22px",
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 800,
                color: TEXT_DARK,
                backgroundColor: WHITE,
                border: `2px solid ${withAlpha(YELLOW, 0.7)}`,
                boxShadow: `0 6px 16px ${withAlpha(TEXT_DARK, 0.08)}`,
                whiteSpace: "nowrap",
              }}
            >
              修正規格
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── S03：主句「提早讓問題出現」── */}
      {frame >= 585 && frame < 817 && (
        <AbsoluteFill style={{ opacity: s3Out }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 880,
              transform: `translate(-50%, -50%) scale(${interpolate(phraseSpring, [0, 1], [0.9, 1])})`,
              opacity: phraseSpring,
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: YELLOW }}>提早</span>讓問題出現
          </div>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 938,
              transform: "translateX(-50%)",
              width: phraseRuleW,
              height: 8,
              borderRadius: 999,
              background: YELLOW,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
