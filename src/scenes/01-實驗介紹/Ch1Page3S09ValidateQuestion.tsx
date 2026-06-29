import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  GREEN,
  HAIRLINE,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 3 頁・S09：不是完成遊戲，而是驗證問題（180 幀）
const CONTENT_OUT = [160, 180] as const;

const ComparisonCard: React.FC<{
  x: number;
  cap: string;
  capColor: string;
  title: string;
  mark: string;
  markColor: string;
  scale: number;
  opacity: number;
  borderColor: string;
}> = ({ x, cap, capColor, title, mark, markColor, scale, opacity, borderColor }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 520,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 700, color: capColor, marginBottom: 24 }}>{cap}</div>
    <div
      style={{
        width: 460,
        height: 300,
        borderRadius: 32,
        background: WHITE,
        border: `5px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.08)}`,
      }}
    >
      <div style={{ fontSize: 110, fontWeight: 900, color: markColor, lineHeight: 1 }}>{mark}</div>
      <div style={{ fontSize: 54, fontWeight: 800, color: TEXT_DARK }}>{title}</div>
    </div>
  </div>
);

export const Ch1Page3S09ValidateQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const leftIn = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  const rightIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const leftDim = interpolate(frame, [45, 75], [1, 0.3], clamp);
  const rightGrow = interpolate(frame, [45, 75], [1, 1.12], easeOutExpo);
  const stamp = spring({
    frame: frame - 52,
    fps,
    config: { damping: 9, stiffness: 140 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <ComparisonCard
          x={620}
          cap="目的不是"
          capColor={SUBTLE}
          title="完成遊戲"
          mark="✗"
          markColor={RED}
          scale={leftIn}
          opacity={leftIn * leftDim}
          borderColor={HAIRLINE}
        />
        <ComparisonCard
          x={1300}
          cap="而是"
          capColor={GREEN}
          title="驗證問題"
          mark="✓"
          markColor={GREEN}
          scale={rightIn * rightGrow}
          opacity={rightIn}
          borderColor={GREEN}
        />

        {stamp > 0 && (
          <div
            style={{
              position: "absolute",
              left: 1500,
              top: 370,
              transform: `translate(-50%, -50%) rotate(-12deg) scale(${stamp})`,
              background: GREEN,
              color: WHITE,
              fontSize: 30,
              fontWeight: 800,
              padding: "10px 22px",
              borderRadius: 12,
            }}
          >
            重點
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
