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
  FIGURE,
  NEUTRAL_50,
  NEUTRAL_300,
  NEUTRAL_400,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";

// 第 3 集・第 2 頁・S04-02：User Story 視覺動態（取代原本的文字旁白版）
//   分鏡：三個人像進場 → 頭上問號逐一冒出（一直猜的困惑）→ 問號消失 →
//   User Story 視窗淡入、內文灰條由左逐條寫出（用文字具體化）。
//   結尾沿用定義卡的淡出慣例（淡出 28 幀後再留 12 幀白底）。
const FADE_DURATION = 28;
const TAIL_HOLD = 12;

// 三個人像的水平中心（1920 置中、間距 400）與頂端 y。
const CENTERS = [560, 960, 1360] as const;
const FIG_TOP = 540;

// 人像尺寸
const HEAD_R = 40;
const BODY_W = 150;
const BODY_H = 132;
const HEAD_GAP = 22; // 頭與身體間距

// 頭上徽章（問號／打勾共用）
const BADGE_D = 68; // 徽章圓徑
const BADGE_GAP = 40; // 徽章「底部」與「頭頂」的垂直間距（px）— 想更遠就調大
const CARD_PUSH_DOWN = 72; // 視窗出現時人像整組下移距離（px）

// 時序
const FIG_IN = [6, 34] as const; // 人像進場
const Q_START = 46; // 第一顆問號
const Q_STAGGER = 26; // 問號之間錯開
const Q_OUT = [158, 182] as const; // 問號消失
const CARD_IN = [182, 216] as const; // 視窗淡入
const BAR_START = 214; // 第一條灰條開始寫
const BAR_STAGGER = 12;
const BAR_RAMP = 22;

// 灰條全部寫完後，頭上冒出打勾徽章（達成共識）
const CHECK_START = 286;
const CHECK_STAGGER = 18;

// 視窗內灰條寬度（占內文寬比例，長短交錯像真的段落）
const BARS = [0.62, 0.82, 0.5, 0.68] as const;

// 單個人像剪影（圓頭＋拱形身體），置於 (cx, FIG_TOP)。
const Figure: React.FC<{ cx: number }> = ({ cx }) => {
  const w = BODY_W;
  const h = HEAD_R * 2 + HEAD_GAP + BODY_H;
  const bodyTop = HEAD_R * 2 + HEAD_GAP;
  const r = 16; // 身體底部圓角
  const bodyPath = `M 0 ${bodyTop + w / 2}
    A ${w / 2} ${w / 2} 0 0 1 ${w} ${bodyTop + w / 2}
    L ${w} ${bodyTop + BODY_H - r}
    A ${r} ${r} 0 0 1 ${w - r} ${bodyTop + BODY_H}
    L ${r} ${bodyTop + BODY_H}
    A ${r} ${r} 0 0 1 0 ${bodyTop + BODY_H - r} Z`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: FIG_TOP,
      }}
    >
      <circle cx={w / 2} cy={HEAD_R} r={HEAD_R} fill={FIGURE} />
      <path d={bodyPath} fill={FIGURE} />
    </svg>
  );
};

export const Ch3Page2S04UserStory02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_DURATION - TAIL_HOLD, durationInFrames - TAIL_HOLD],
    [1, 0],
    clamp,
  );

  // 人像進場（整組淡入＋微上移），視窗出現時整組再微降讓出上方空間。
  const figIn = interpolate(frame, FIG_IN, [0, 1], ease);
  const cardIn = interpolate(frame, CARD_IN, [0, 1], ease);
  const groupShift =
    interpolate(figIn, [0, 1], [24, 0]) +
    interpolate(cardIn, [0, 1], [0, CARD_PUSH_DOWN]);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* 人像＋問號群組 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: figIn,
            transform: `translateY(${groupShift}px)`,
          }}
        >
          {CENTERS.map((cx) => (
            <Figure key={cx} cx={cx} />
          ))}

          {/* 頭上問號徽章：逐一 spring 彈入、於 Q_OUT 一起消失 */}
          {CENTERS.map((cx, i) => {
            const pop = spring({
              frame: frame - (Q_START + i * Q_STAGGER),
              fps,
              config: { damping: 12, stiffness: 170 },
            });
            const out = interpolate(frame, Q_OUT, [1, 0], ease);
            const scale = pop * out;
            return (
              <div
                key={cx}
                style={{
                  position: "absolute",
                  left: cx - BADGE_D / 2,
                  top: FIG_TOP - BADGE_GAP - BADGE_D,
                  width: BADGE_D,
                  height: BADGE_D,
                  borderRadius: 999,
                  background: WHITE,
                  boxShadow: `0 8px 22px ${withAlpha(TEXT_DARK, 0.12)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: out,
                  transform: `scale(${scale})`,
                }}
              >
                <span
                  style={{ fontSize: 38, fontWeight: 900, color: YELLOW }}
                >
                  ?
                </span>
              </div>
            );
          })}

          {/* 灰條寫完後，頭上打勾徽章逐一彈入（達成共識） */}
          {CENTERS.map((cx, i) => {
            const pop = spring({
              frame: frame - (CHECK_START + i * CHECK_STAGGER),
              fps,
              config: { damping: 12, stiffness: 170 },
            });
            return (
              <div
                key={`chk-${cx}`}
                style={{
                  position: "absolute",
                  left: cx - BADGE_D / 2,
                  top: FIG_TOP - BADGE_GAP - BADGE_D,
                  width: BADGE_D,
                  height: BADGE_D,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${pop})`,
                }}
              >
                <VerdictBadge kind="pass" size={BADGE_D} shadow />
              </div>
            );
          })}
        </div>

        {/* User Story 視窗：淡入＋微放大，灰條由左逐條寫出 */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 176,
            transform: `translateX(-50%) scale(${interpolate(
              cardIn,
              [0, 1],
              [0.96, 1],
            )})`,
            transformOrigin: "top center",
            opacity: cardIn,
            width: 440,
            boxSizing: "border-box",
            padding: "30px 34px 34px",
            background: WHITE,
            borderRadius: 18,
            border: `1px solid ${NEUTRAL_300}`,
            boxShadow: `0 24px 60px ${withAlpha(TEXT_DARK, 0.14)}`,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: 1,
              color: BLUE,
              marginBottom: 26,
            }}
          >
            User Story
          </div>
          {BARS.map((wRatio, i) => {
            const p = interpolate(
              frame,
              [BAR_START + i * BAR_STAGGER, BAR_START + i * BAR_STAGGER + BAR_RAMP],
              [0, 1],
              ease,
            );
            return (
              <div
                key={i}
                style={{
                  height: 14,
                  width: `${wRatio * 100}%`,
                  marginTop: i === 0 ? 0 : 18,
                  borderRadius: 7,
                  background: NEUTRAL_400,
                  transform: `scaleX(${p})`,
                  transformOrigin: "left center",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
