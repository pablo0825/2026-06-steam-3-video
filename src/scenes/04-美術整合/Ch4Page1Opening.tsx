import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  CARD_BORDER,
  withAlpha,
} from "../../theme/colors";

// 第 4 集・第 1 頁開場（連續動畫，四段；30fps，總長 1260 frames＝42 秒）
//   S01：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 4 集・美術整合」
//   S02：AI 生圖的角色 — 先左右對比（不是取代／優化），對比淡出後建四節點流程
//   S03：延續同一張流程圖（縮小上移）＋回饋箭頭「修正規格」＋主句「提早讓問題出現」
//   S04：本次重點三卡（美術規格表／AI 生假素材／Unity 驗證規格）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// ── 四段節奏 ──
// S01：0–210｜S02：210–720（對比 210–410、流程 410–720）｜S03：720–1020｜S04：1020–1260
const A_OUT = [188, 210] as const; // S01 淡出

// S01 內部節奏
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

// S02 Beat A：AI 生圖的角色＋左右對比
const S2_IN = [210, 232] as const; // S02 標題淡入
const TITLE_OUT = [700, 740] as const; // S02 標題在進入 S03 時淡出
const CONTRAST_IN = [232, 256] as const; // 對比卡淡入
const CONTRAST_OUT = [360, 410] as const; // 對比卡淡出後才建流程
const LEFT_CARD = 244; // 左卡 spring 起點
const RIGHT_CARD = 276; // 右卡 spring 起點

// S02 Beat B / S03：四節點水平流程（連續，不重建）
const NODES = ["AI 生假素材", "匯入 Unity", "驗證規格", "降低重工"] as const;
const NODE_X = [360, 760, 1160, 1560] as const; // 節點中心 x（節點寬 280）
const NODE_Y = 600; // Beat B 時節點中心 y（group transform 之前）
const NODE_FIRST = 430; // 第一個節點 spring 起點
const NODE_STEP = 60; // 每個節點＋箭頭一拍的間隔
const FLOW_IN = [410, 432] as const; // 流程層淡入
const FLOW_RAISE = [740, 810] as const; // S03：流程群組上移縮小
const S3_OUT = [998, 1020] as const; // S03 淡出
const HI_LAST = [664, 696] as const; // 「降低重工」高亮

// S03：回饋箭頭、問題卡、主句
const FB_DRAW = [820, 884] as const; // 回饋箭頭 draw-on
const PROBLEM_IN = 800; // 問題卡 spring 起點
const PHRASE_IN = 884; // 主句 spring 起點
const PHRASE_RULE = [904, 940] as const; // 主句黃色底線 wipe

export const Ch4Page1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S01：開場標題 ──────────────────────────────
  const logoIn = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const logoW = interpolate(t2, [0, 1], [560, 220]);
  const logoY = interpolate(t2, [0, 1], [460, 150]);

  const titleScale = spring({
    frame: frame - TITLE_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleOpacity = interpolate(
    frame,
    [TITLE_START, TITLE_START + 18],
    [0, 1],
    clamp,
  );
  const ruleW = interpolate(
    frame,
    [TITLE_START + 10, TITLE_START + 34],
    [0, 380],
    { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );
  const subOpacity = interpolate(
    frame,
    [SUB_START, SUB_START + 18],
    [0, 1],
    clamp,
  );
  const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);

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
    config: { damping: 15, stiffness: 120 },
  });
  const rightCard = spring({
    frame: frame - RIGHT_CARD,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // ── S02 Beat B / S03：流程圖（連續）─────────────
  const flowOpacity =
    interpolate(frame, FLOW_IN, [0, 1], clamp) *
    interpolate(frame, S3_OUT, [1, 0], clamp);
  const flowRaise = interpolate(frame, FLOW_RAISE, [0, 1], clamp);
  const groupTy = interpolate(flowRaise, [0, 1], [0, -150]);
  const groupScale = interpolate(flowRaise, [0, 1], [1, 0.82]);
  const hiLast = interpolate(frame, HI_LAST, [0, 1], clamp);
  const nodeSpring = (i: number) =>
    spring({
      frame: frame - (NODE_FIRST + i * NODE_STEP),
      fps,
      config: { damping: 15, stiffness: 120 },
    });
  const fwdArrowProgress = (i: number) =>
    interpolate(
      frame,
      [NODE_FIRST + i * NODE_STEP + 30, NODE_FIRST + i * NODE_STEP + 54],
      [0, 1],
      clamp,
    );

  // ── S03：回饋＋主句 ────────────────────────────
  const fbDraw = interpolate(frame, FB_DRAW, [0, 1], clamp);
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
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S01：開場標題 ── */}
      {frame < 215 && (
        <AbsoluteFill style={{ opacity: aOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: logoY,
              transform: `translate(-50%, -50%) scale(${logoIn})`,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Img src={LOGO} style={{ width: logoW, height: "auto" }} />
          </div>

          {frame >= TITLE_START && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 500,
                  transform: `translate(-50%, -50%) scale(${interpolate(titleScale, [0, 1], [0.9, 1])})`,
                  opacity: titleOpacity,
                  fontSize: 132,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                }}
              >
                VIBE GAME 教案
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 588,
                  transform: "translateX(-50%)",
                  width: ruleW,
                  height: 8,
                  borderRadius: 999,
                  background: YELLOW,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 960,
                  top: 660,
                  transform: "translateX(-50%)",
                  opacity: subOpacity,
                  fontSize: 56,
                  fontWeight: 500,
                  letterSpacing: 10,
                  color: SUBTLE,
                  whiteSpace: "nowrap",
                }}
              >
                第 4 集・美術整合
              </div>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02 Beat A：AI 生圖的角色＋左右對比 ── */}
      {frame >= 205 && frame < 742 && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 175,
              transform: "translateX(-50%)",
              opacity: s2TitleOpacity,
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            AI 生圖的角色
          </div>

          {frame < 412 && (
            <div
              style={{
                position: "absolute",
                left: 960,
                top: 560,
                transform: "translate(-50%, -50%)",
                opacity: contrastOpacity,
                display: "flex",
                gap: 56,
              }}
            >
              {[
                {
                  s: leftCard,
                  label: "AI 不是",
                  main: "取代美術人員",
                  accent: SUBTLE,
                  border: CARD_BORDER,
                  dir: -1,
                },
                {
                  s: rightCard,
                  label: "而是",
                  main: "優化美術工作",
                  accent: YELLOW,
                  border: withAlpha(YELLOW, 0.7),
                  dir: 1,
                },
              ].map((c) => (
                <div
                  key={c.main}
                  style={{
                    width: 560,
                    padding: "48px 40px",
                    background: WHITE,
                    border: `3px solid ${c.border}`,
                    borderRadius: 28,
                    boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
                    opacity: c.s,
                    transform: `translateX(${interpolate(c.s, [0, 1], [c.dir * 48, 0])}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: c.accent,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: c.accent === YELLOW ? YELLOW : TEXT_DARK,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.main}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ── S02 Beat B / S03：四節點流程（連續，不重建）── */}
      {frame >= 405 && frame < 1022 && (
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
                const p = fwdArrowProgress(i);
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={NODE_Y}
                      x2={x2 - 22}
                      y2={NODE_Y}
                      stroke={BLUE}
                      strokeWidth={6}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - p}
                    />
                    <g
                      opacity={p}
                      transform={`translate(${x2} ${NODE_Y})`}
                    >
                      <path d="M0 0 L-22 -13 L-22 13 Z" fill={BLUE} />
                    </g>
                  </g>
                );
              })}
              {/* 回饋箭頭「修正規格」：驗證規格 → AI 生假素材 */}
              <path
                d={`M ${NODE_X[2]} ${NODE_Y + 60} C ${NODE_X[2]} 810, ${NODE_X[0]} 810, ${NODE_X[0]} ${NODE_Y + 66}`}
                fill="none"
                stroke={YELLOW}
                strokeWidth={6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - fbDraw}
              />
              <g
                opacity={fbDraw}
                transform={`translate(${NODE_X[0]} ${NODE_Y + 62})`}
              >
                <path d="M0 0 L-13 22 L13 22 Z" fill={YELLOW} />
              </g>
              <text
                x={(NODE_X[0] + NODE_X[2]) / 2}
                y={808}
                textAnchor="middle"
                fill={YELLOW}
                fontSize={30}
                fontWeight={800}
                fontFamily={FONT}
                opacity={fbDraw}
              >
                修正規格
              </text>
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
          </div>
        </AbsoluteFill>
      )}

      {/* ── S03：主句「提早讓問題出現」── */}
      {frame >= 790 && frame < 1022 && (
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

      {/* ── S04：本次重點三卡 ── (added in Task 5) */}
    </AbsoluteFill>
  );
};
