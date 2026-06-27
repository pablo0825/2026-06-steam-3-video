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
  SUBTLE,
  TEXT_DARK,
  NEUTRAL_50,
  YELLOW,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 4 頁・S10：素材大小的基礎單位（240 幀，結尾淡出到 NEUTRAL_50）
const ENDING_FADE = [216, 240] as const;

// unit / px：以 flex 整組置中，故各自只需「主字 + 置中於其下的副標」，
//   寬度 = 主字寬（caption 為 absolute 不撐寬），整組由外層 flex 置中、自動左右平衡。
type UnitLabelProps = {
  main: string;
  caption: string;
  color: string;
  enter: number;
};

const UnitLabel: React.FC<UnitLabelProps> = ({ main, caption, color, enter }) => (
  <div
    style={{
      position: "relative",
      flexShrink: 0,
      opacity: enter,
      transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px)`,
    }}
  >
    <div
      style={{
        color,
        fontSize: 168,
        fontWeight: 950,
        letterSpacing: 1,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {main}
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 196,
        textAlign: "center",
        color: SUBTLE,
        fontSize: 38,
        fontWeight: 760,
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {caption}
    </div>
  </div>
);

// 雙向箭頭：固定寬度的中間區塊，於 flex 中介於 unit / px 之間（本地座標、可動畫畫出）
const ARROW_W = 420;
const ARROW_TOP_Y = 94; // 上方藍箭頭（unit → px）本地 y
const ARROW_BOT_Y = 174; // 下方黃箭頭（px → unit）本地 y

const Arrows: React.FC<{ right: number; left: number }> = ({ right, left }) => (
  <svg
    width={ARROW_W}
    height={210}
    style={{ flexShrink: 0, overflow: "visible" }}
  >
    <line
      x1={0}
      y1={ARROW_TOP_Y}
      x2={ARROW_W - 30}
      y2={ARROW_TOP_Y}
      stroke={BLUE}
      strokeWidth={7}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - right}
    />
    <g
      transform={`translate(${ARROW_W} ${ARROW_TOP_Y})`}
      opacity={interpolate(right, [0.78, 1], [0, 1], clamp)}
    >
      <path d="M0 0 L-28 -16 L-28 16 Z" fill={BLUE} />
    </g>
    <line
      x1={ARROW_W}
      y1={ARROW_BOT_Y}
      x2={30}
      y2={ARROW_BOT_Y}
      stroke={YELLOW}
      strokeWidth={7}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - left}
    />
    <g
      transform={`translate(0 ${ARROW_BOT_Y}) rotate(180)`}
      opacity={interpolate(left, [0.78, 1], [0, 1], clamp)}
    >
      <path d="M0 0 L-28 -16 L-28 16 Z" fill={YELLOW} />
    </g>
  </svg>
);

export const Ch4Page4S10BaseUnit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const unitEnter = spring({
    frame: frame - 18,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const pxEnter = spring({
    frame: frame - 36,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const arrowRight = interpolate(frame, [56, 88], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });
  const arrowLeft = interpolate(frame, [76, 108], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });
  // 箭頭跑完後出現的提問「怎麼轉換？」
  const ask = spring({
    frame: frame - 116,
    fps,
    config: { damping: 15, stiffness: 130 },
  });
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            top: 346,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 104,
          }}
        >
          <UnitLabel
            main="unit"
            caption="Unity 單位"
            color={BLUE}
            enter={unitEnter}
          />
          <Arrows right={arrowRight} left={arrowLeft} />
          <UnitLabel
            main="px"
            caption="美術圖單位"
            color={YELLOW}
            enter={pxEnter}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 840,
            textAlign: "center",
            opacity: ask,
            transform: `translateY(${interpolate(ask, [0, 1], [28, 0])}px)`,
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
              color: TEXT_DARK,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            怎麼轉換？
            
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
