import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BORDER_LIGHT,
  FIGURE,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";

// 第 2 集・第 7 頁・S21：用分鏡圖凝聚團隊共識（230 幀）
//   分鏡：三個剪影人像進場 → 分鏡圖卡片在上方淡入（人像整組下移讓位）→
//   隔一段時間，每個頭上逐一彈出打勾徽章（達成共識）。
//   結尾沿用 CONTENT_OUT 淡出慣例（ch2-end-fades 測試會檢查結尾幀）。
const CONTENT_OUT = [200, 229] as const;

// 三個人像的水平中心（1920 置中、間距 400）與頂端 y。
const CENTERS = [560, 960, 1360] as const;
const FIG_TOP = 560;

// 人像尺寸
const HEAD_R = 40;
const BODY_W = 150;
const BODY_H = 132;
const HEAD_GAP = 22; // 頭與身體間距

// 頭上打勾徽章
const BADGE_D = 68; // 徽章圓徑
const BADGE_GAP = 40; // 徽章「底部」與「頭頂」的垂直間距（px）
const CARD_PUSH_DOWN = 128; // 分鏡圖出現時人像整組下移距離（px）— 再拉開圖片與打勾的間距

// 分鏡圖卡片幾何（置中於人像上方）
const CARD_W = 620;
const CARD_H = 350;
const CARD_TOP = 140;

// 時序
const FIG_IN = [6, 34] as const; // 人像進場
const CARD_IN = [40, 74] as const; // 分鏡圖淡入
const CHECK_START = 100; // 第一個打勾（分鏡圖落定後隨即開始）
const CHECK_STAGGER = 24; // 俐落的一二三連續打勾；三個約於 f≈170 全部落定

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

export const Ch2Page7S21Consensus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  // 人像進場（整組淡入＋微上移），分鏡圖出現時整組再微降讓出上方空間。
  const figIn = interpolate(frame, FIG_IN, [0, 1], ease);
  const cardIn = interpolate(frame, CARD_IN, [0, 1], ease);
  const groupShift =
    interpolate(figIn, [0, 1], [24, 0]) +
    interpolate(cardIn, [0, 1], [0, CARD_PUSH_DOWN]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NEUTRAL_50,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={{ opacity }}>
        {/* 人像＋打勾群組 */}
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

          {/* 分鏡圖寫完後，頭上打勾徽章逐一彈入（達成共識） */}
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

        {/* 分鏡圖卡片：置中於人像上方，淡入＋微放大 */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: CARD_TOP,
            width: CARD_W,
            height: CARD_H,
            transform: `translateX(-50%) translateY(${interpolate(
              cardIn,
              [0, 1],
              [28, 0],
            )}px) scale(${interpolate(cardIn, [0, 1], [0.94, 1])})`,
            transformOrigin: "top center",
            opacity: cardIn,
            overflow: "hidden",
            borderRadius: 24,
            border: `3px solid ${BORDER_LIGHT}`,
            backgroundColor: WHITE,
            boxShadow: `0 20px 50px ${withAlpha(TEXT_DARK, 0.12)}`,
          }}
        >
          <Img
            src={staticFile("02-遊戲設計/storyboard-sample-3.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 18%",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
