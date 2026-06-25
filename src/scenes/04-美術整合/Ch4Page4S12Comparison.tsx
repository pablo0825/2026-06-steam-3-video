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
  CARD_BORDER,
  GREEN,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 4 頁・S12：PPU=100 vs 128 對比（450 幀）
//   原合併檔的 630–1080 區間已全部 −630 重新基準化為 0 起算。進場淡入 × 新增結尾淡出到 NEUTRAL_50。
const S12_IN = [0, 30] as const;
const ENDING_FADE = [422, 450] as const;

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

export const Ch4Page4S12Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity =
    interpolate(frame, S12_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const conclusion = spring({
    frame: frame - 260,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: sceneOpacity,
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
            fontSize: 64,
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
            delay={40}
            fps={fps}
          />
          <PPUComparisonCard
            label="PPU=128"
            result="128 px = 1 unit"
            isGood
            frame={frame}
            delay={136}
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
    </AbsoluteFill>
  );
};
