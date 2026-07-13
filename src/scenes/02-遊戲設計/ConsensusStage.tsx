import React from "react";
import { Img, staticFile } from "remotion";
import {
  BORDER_LIGHT,
  FIGURE,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";

// S21 系列共用的舞台零件與座標。
//   S21-02（有確認）與 S21-03（沒確認）必須是同一個構圖、只差「分鏡有沒有傳出去」，
//   對比才成立，所以構圖常數集中在這裡，兩段各自只排時間軸。
//   S21-01 沿用 Figure（人像位置與尺寸不同，由呼叫端傳 top）。

// 人像尺寸
export const HEAD_R = 40;
export const BODY_W = 150;
export const BODY_H = 132;
const HEAD_GAP = 22; // 頭與身體間距

// 三人站位：確認者在左，兩位夥伴在右（中間留白給卡片飛行的弧線）
export const CONFIRMER_X = 420;
export const PARTNER_X = [1200, 1580] as const;
export const FIG_TOP = 620;

// 頭上的畫格：分鏡小卡與虛線問號框共用同一組幾何，換上去才會嚴絲合縫
export const CARD_W = 300;
export const CARD_H = 170;
const CARD_GAP = 44; // 卡片底邊與頭頂的距離
export const CARD_TOP = FIG_TOP - CARD_GAP - CARD_H;
export const CARD_MID_Y = CARD_TOP + CARD_H / 2;

// 三張分鏡樣張：02 讓三人共用 [0]；03 讓夥伴各自想成 [1]、[2]
export const STORYBOARDS = [
  "02-遊戲設計/storyboard-sample-1.png",
  "02-遊戲設計/storyboard-sample-2.png",
  "02-遊戲設計/storyboard-sample-3.png",
] as const;

// 畫格的絕對定位（以 cx 為水平中心）
export const slotStyle = (cx: number): React.CSSProperties => ({
  position: "absolute",
  left: cx - CARD_W / 2,
  top: CARD_TOP,
  width: CARD_W,
  height: CARD_H,
});

// 單個人像剪影（圓頭＋拱形身體），置於 (cx, top)。
export const Figure: React.FC<{ cx: number; top?: number }> = ({
  cx,
  top = FIG_TOP,
}) => {
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
      style={{ position: "absolute", left: cx - w / 2, top }}
    >
      <circle cx={w / 2} cy={HEAD_R} r={HEAD_R} fill={FIGURE} />
      <path d={bodyPath} fill={FIGURE} />
    </svg>
  );
};

// 頭上的分鏡小卡（白底圓角＋實線外框）。定位與動畫交給呼叫端的 style。
export const StoryboardCard: React.FC<{
  src: string;
  style?: React.CSSProperties;
}> = ({ src, style }) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      overflow: "hidden",
      borderRadius: 18,
      border: `3px solid ${BORDER_LIGHT}`,
      backgroundColor: WHITE,
      boxShadow: `0 16px 36px ${withAlpha(TEXT_DARK, 0.12)}`,
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "50% 18%",
      }}
    />
  </div>
);

// 還沒對過的想法：虛線框＋問號，尺寸與 StoryboardCard 完全相同。
export const QuestionBox: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 18,
      border: `3px dashed ${SUBTLE}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 76,
      fontWeight: 800,
      color: SUBTLE,
      ...style,
    }}
  >
    ?
  </div>
);
