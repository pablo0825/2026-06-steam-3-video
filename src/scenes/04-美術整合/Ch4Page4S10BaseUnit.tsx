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
  PANEL_BG,
  SUBTLE,
  TEXT_DARK,
  NEUTRAL_50,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 4 頁・S10：素材大小的基礎單位（240 幀，結尾淡出到 NEUTRAL_50）
const ENDING_FADE = [216, 240] as const;

type UnitLabelProps = {
  main: string;
  caption: string;
  color: string;
  x: number;
  enter: number;
};

const UnitLabel: React.FC<UnitLabelProps> = ({
  main,
  caption,
  color,
  x,
  enter,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 524,
      width: 420,
      height: 210,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      opacity: enter,
      transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px)`,
    }}
  >
    <div
      style={{
        color,
        fontSize: 138,
        fontWeight: 950,
        letterSpacing: 1,
        lineHeight: 1,
      }}
    >
      {main}
    </div>
    <div
      style={{
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

type DrawArrowProps = {
  direction: "right" | "left";
  y: number;
  progress: number;
  color: string;
};

const DrawArrow: React.FC<DrawArrowProps> = ({
  direction,
  y,
  progress,
  color,
}) => {
  const isRight = direction === "right";
  const tailX = isRight ? 760 : 1160;
  const headX = isRight ? 1160 : 760;
  const lineEndX = isRight ? headX - 30 : headX + 30;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        overflow: "visible",
      }}
    >
      <line
        x1={tailX}
        y1={y}
        x2={lineEndX}
        y2={y}
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      <g
        transform={`translate(${headX} ${y}) rotate(${isRight ? 0 : 180})`}
        opacity={interpolate(progress, [0.78, 1], [0, 1], clamp)}
      >
        <path d="M0 0 L-28 -16 L-28 16 Z" fill={color} />
      </g>
    </svg>
  );
};

export const Ch4Page4S10BaseUnit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  const unitEnter = spring({
    frame: frame - 54,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const pxEnter = spring({
    frame: frame - 72,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const arrowRight = interpolate(frame, [92, 124], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });
  const arrowLeft = interpolate(frame, [112, 144], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });
  const question = spring({
    frame: frame - 146,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            top: 166,
            left: 0,
            right: 0,
            textAlign: "center",
            color: TEXT_DARK,
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [32, 0])}px)`,
          }}
        >
          素材大小的基礎單位
        </div>

        <UnitLabel
          main="unit"
          caption="Unity 單位"
          color={BLUE}
          x={320}
          enter={unitEnter}
        />
        <UnitLabel
          main="px"
          caption="美術圖單位"
          color={YELLOW}
          x={1180}
          enter={pxEnter}
        />

        <DrawArrow
          direction="right"
          y={564}
          progress={arrowRight}
          color={BLUE}
        />
        <DrawArrow
          direction="left"
          y={644}
          progress={arrowLeft}
          color={YELLOW}
        />

        <div
          style={{
            position: "absolute",
            left: 908,
            top: 566,
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: PANEL_BG,
            border: `3px solid ${withAlpha(BLUE, 0.18)}`,
            color: TEXT_DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 78,
            fontWeight: 900,
            opacity: question,
            transform: `scale(${interpolate(question, [0, 1], [0.55, 1])})`,
          }}
        >
          ?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
