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
  CARD_BORDER,
  GREEN,
  PANEL_BG,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const S10_OUT = [216, 240] as const;
const S11_IN = [240, 268] as const;
const S11_OUT = [600, 630] as const;
const S12_IN = [630, 660] as const;

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

type PPUComparisonCardProps = {
  label: string;
  result: string;
  isGood: boolean;
  frame: number;
  delay: number;
  fps: number;
};

const PPUComparisonCard: React.FC<PPUComparisonCardProps> = ({
  label,
  result,
  isGood,
  frame,
  delay,
  fps,
}) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const referenceEnter = spring({
    frame: frame - delay - 28,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const spriteEnter = spring({
    frame: frame - delay - 56,
    fps,
    config: { damping: 13, stiffness: 145 },
  });
  const resultEnter = spring({
    frame: frame - delay - 88,
    fps,
    config: { damping: 14, stiffness: 135 },
  });
  const color = isGood ? GREEN : RED;
  const spriteSize = isGood ? 178 : 218;

  return (
    <div
      style={{
        width: 650,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          width: 650,
          height: 464,
          borderRadius: 28,
          background: WHITE,
          border: `3px solid ${isGood ? withAlpha(GREEN, 0.42) : CARD_BORDER}`,
          boxShadow: `0 20px 48px ${withAlpha(TEXT_DARK, 0.1)}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [46, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: TEXT_DARK,
            lineHeight: 1,
          }}
        >
          {label}
        </div>

        <div
          style={{
            position: "relative",
            width: 270,
            height: 292,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 178,
              height: 178,
              borderRadius: 22,
              border: `5px dashed ${CARD_BORDER}`,
              background: WHITE,
              opacity: referenceEnter,
              transform: `scale(${interpolate(referenceEnter, [0, 1], [0.82, 1])})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: spriteSize,
              height: spriteSize,
              borderRadius: 22,
              background: withAlpha(isGood ? GREEN : BLUE, 0.22),
              border: `5px solid ${isGood ? GREEN : BLUE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TEXT_DARK,
              fontSize: 34,
              fontWeight: 850,
              letterSpacing: 1,
              opacity: spriteEnter,
              transform: `scale(${interpolate(spriteEnter, [0, 1], [0.74, 1])})`,
            }}
          >
            128 px
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -22,
              color: SUBTLE,
              fontSize: 26,
              fontWeight: 750,
              letterSpacing: 1,
              opacity: referenceEnter,
            }}
          >
            1 unit
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          color,
          fontSize: 36,
          fontWeight: 850,
          whiteSpace: "nowrap",
          opacity: resultEnter,
          transform: `translateY(${interpolate(resultEnter, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `4px solid ${color}`,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {isGood ? "✓" : "×"}
        </div>
        <span>{result}</span>
      </div>
    </div>
  );
};

export const Ch4Page4PPU: React.FC = () => {
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
  const s10Opacity = interpolate(frame, S10_OUT, [1, 0], clamp);

  const s11Opacity =
    interpolate(frame, S11_IN, [0, 1], clamp) *
    interpolate(frame, S11_OUT, [1, 0], clamp);
  const ppuEnter = spring({
    frame: frame - 276,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const ppuText = spring({
    frame: frame - 320,
    fps,
    config: { damping: 15, stiffness: 115 },
  });
  const ppuRule = spring({
    frame: frame - 380,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const ppuUnderline = interpolate(frame, [442, 474], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const s12Opacity = interpolate(frame, S12_IN, [0, 1], clamp);
  const conclusion = spring({
    frame: frame - 890,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {frame < 242 && (
        <AbsoluteFill style={{ opacity: s10Opacity }}>
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
      )}

      {frame >= 236 && frame < 632 && (
        <AbsoluteFill
          style={{
            opacity: s11Opacity,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 38,
              minHeight: 470,
              transform: "translateY(-6px)",
            }}
          >
            <div
              style={{
                color: BLUE,
                fontSize: 134,
                fontWeight: 950,
                lineHeight: 1,
                opacity: ppuEnter,
                transform: `scale(${interpolate(ppuEnter, [0, 1], [0.82, 1])})`,
              }}
            >
              PPU
            </div>
            <div
              style={{
                color: SUBTLE,
                fontSize: 44,
                fontWeight: 750,
                letterSpacing: 1,
                opacity: ppuText,
                transform: `translateY(${interpolate(ppuText, [0, 1], [26, 0])}px)`,
              }}
            >
              (Pixels Per Unit)
            </div>
            <div
              style={{
                position: "relative",
                marginTop: 44,
                color: TEXT_DARK,
                fontSize: 62,
                fontWeight: 900,
                letterSpacing: 1,
                opacity: ppuRule,
                transform: `translateY(${interpolate(ppuRule, [0, 1], [34, 0])}px)`,
              }}
            >
              決定多少 px = 1 unit
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -16,
                  height: 12,
                  borderRadius: 999,
                  background: withAlpha(YELLOW, 0.72),
                  transformOrigin: "left center",
                  transform: `scaleX(${ppuUnderline})`,
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {frame >= 626 && (
        <AbsoluteFill
          style={{
            opacity: s12Opacity,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 104,
              left: 0,
              right: 0,
              textAlign: "center",
              color: TEXT_DARK,
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            128 px 的角色，要怎麼對齊 1 unit？
          </div>

          <div
            style={{
              display: "flex",
              gap: 72,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 38,
            }}
          >
            <PPUComparisonCard
              label="PPU=100"
              result="128 px ≠ 1 unit"
              isGood={false}
              frame={frame}
              delay={670}
              fps={fps}
            />
            <PPUComparisonCard
              label="PPU=128"
              result="128 px = 1 unit"
              isGood
              frame={frame}
              delay={766}
              fps={fps}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 92,
              left: 0,
              right: 0,
              textAlign: "center",
              color: BLUE,
              fontSize: 46,
              fontWeight: 850,
              letterSpacing: 1,
              opacity: conclusion,
              transform: `translateY(${interpolate(conclusion, [0, 1], [28, 0])}px)`,
            }}
          >
            先決定 1 unit 對應多少 px
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
