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
  BLUE,
  CAT_ART,
  CAT_CODE,
  CAT_PLAN,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 2 頁・S04：AI 連到程式、企劃、美術（150 幀）
const CONTENT_OUT = [132, 150] as const;
const AI = { x: 960, y: 300 };
const AI_R = 95;
const NODE_R = 78;

type Domain = {
  label: string;
  emoji: string;
  color: string;
  x: number;
  y: number;
  lineStart: number;
  iconStart: number;
};

const DOMAINS: Domain[] = [
  { label: "程式", emoji: "💻", color: CAT_CODE, x: 480, y: 760, lineStart: 25, iconStart: 42 },
  { label: "企劃", emoji: "📋", color: CAT_PLAN, x: 960, y: 760, lineStart: 60, iconStart: 77 },
  { label: "美術", emoji: "🎨", color: CAT_ART, x: 1440, y: 760, lineStart: 95, iconStart: 112 },
];

export const Ch1Page2S04Domains: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const aiIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {DOMAINS.map((domain) => {
            const x1 = AI.x;
            const y1 = AI.y + AI_R;
            const x2 = domain.x;
            const y2 = domain.y - NODE_R;
            const len = Math.hypot(x2 - x1, y2 - y1);
            const progress = interpolate(frame, [domain.lineStart, domain.lineStart + 18], [0, 1], easeOutExpo);

            return (
              <line
                key={domain.label}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={domain.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - progress)}
                opacity={0.6}
              />
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            left: AI.x,
            top: AI.y,
            width: AI_R * 2,
            height: AI_R * 2,
            marginLeft: -AI_R,
            marginTop: -AI_R,
            borderRadius: "50%",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WHITE,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: 2,
            transform: `scale(${aiIn})`,
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
            boxShadow: `0 20px 50px ${withAlpha(BLUE, 0.35)}`,
          }}
        >
          AI
        </div>

        {DOMAINS.map((domain) => {
          const built = spring({
            frame: frame - domain.iconStart,
            fps,
            config: { damping: 11, stiffness: 130 },
          });

          return (
            <div
              key={domain.label}
              style={{
                position: "absolute",
                left: domain.x,
                top: domain.y,
                width: NODE_R * 2,
                height: NODE_R * 2,
                marginLeft: -NODE_R,
                marginTop: -NODE_R,
                transform: `scale(${built})`,
                opacity: built <= 0 ? 0 : 1,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: WHITE,
                  border: `5px solid ${domain.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 68,
                  boxShadow: `0 12px 30px ${withAlpha(BLACK, 0.08)}`,
                }}
              >
                {domain.emoji}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 18,
                  fontSize: 40,
                  fontWeight: 700,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                }}
              >
                {domain.label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
