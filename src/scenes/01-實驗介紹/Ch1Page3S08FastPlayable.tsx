import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, BLUE, NEUTRAL_50, SUBTLE, TEXT_DARK, WHITE, withAlpha, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 3 頁・S08：最快的方法做出可玩版本（180 幀）
const CONTENT_OUT = [160, 179] as const;
const LEFT = { x: 360, y: 520 };
const RIGHT = { x: 1560, y: 520 };
const NODE_R = 92;
const GAP = 44;

const PrototypeNode: React.FC<{
  x: number;
  emoji: string;
  label: string;
  color: string;
  scale: number;
}> = ({ x, emoji, label, color, scale }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: LEFT.y,
      marginLeft: -NODE_R,
      marginTop: -NODE_R,
      width: NODE_R * 2,
      height: NODE_R * 2,
      transform: `scale(${scale})`,
      opacity: scale <= 0 ? 0 : 1,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: WHITE,
        border: `5px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 80,
        boxShadow: `0 12px 30px ${withAlpha(BLACK, 0.08)}`,
      }}
    >
      {emoji}
    </div>
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: 18,
        fontSize: 38,
        fontWeight: 700,
        color: TEXT_DARK,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  </div>
);

export const Ch1Page3S08FastPlayable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const ideaIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const playIn = spring({
    frame: frame - 48,
    fps,
    config: { damping: 11, stiffness: 130 },
  });
  const lineStartX = LEFT.x + NODE_R + GAP;
  const lineEndX = RIGHT.x - NODE_R - GAP;
  const lineProgress = interpolate(frame, [22, 56], [0, 1], easeOutExpo);
  const tipX = interpolate(lineProgress, [0, 1], [lineStartX, lineEndX]);
  const midX = (lineStartX + lineEndX) / 2;
  const labelOpacity = interpolate(frame, [28, 48], [0, 1], clamp);
  const skipOpacity = interpolate(frame, [58, 78], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {lineProgress > 0 && (
            <line
              x1={lineStartX}
              y1={LEFT.y}
              x2={tipX}
              y2={LEFT.y}
              stroke={BLUE}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray="20 16"
            />
          )}
          {lineProgress > 0.05 && (
            <polygon points={`${tipX},${LEFT.y - 16} ${tipX + 26},${LEFT.y} ${tipX},${LEFT.y + 16}`} fill={BLUE} />
          )}
        </svg>

        <PrototypeNode x={LEFT.x} emoji="💡" label="想法" color={YELLOW} scale={ideaIn} />
        <PrototypeNode x={RIGHT.x} emoji="🎮" label="可玩的版本" color={BLUE} scale={playIn} />

        <div
          style={{
            position: "absolute",
            left: midX,
            top: LEFT.y - 96,
            transform: "translate(-50%, -50%)",
            opacity: labelOpacity,
            color: BLUE,
            fontSize: 40,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          最快的方法
        </div>

        <div
          style={{
            position: "absolute",
            left: midX,
            top: LEFT.y + 92,
            transform: "translate(-50%, -50%)",
            opacity: skipOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: SUBTLE, fontSize: 30 }}>略過</span>
          <span style={{ color: SUBTLE, fontSize: 34, fontWeight: 600 }}>完整製作</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
