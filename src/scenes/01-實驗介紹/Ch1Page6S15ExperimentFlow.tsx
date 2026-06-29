import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BOX_GREY, NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 6 頁・S15：四階段實驗流程（210 幀）
const CONTENT_OUT = [190, 210] as const;
const BOX_W = 340;
const BOX_H = 190;
const ROW_Y = 540;
const CENTERS = [280, 733, 1186, 1639] as const;
const LABELS = ["Codex", "企劃設計", "程式實作", "美術整合"] as const;
const APPEAR = [20, 55, 90, 125] as const;

export const Ch1Page6S15ExperimentFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 160,
            transform: `translate(-50%, -50%) scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`,
            opacity: titleIn,
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 6,
            color: TEXT_DARK,
          }}
        >
          實驗流程
        </div>

        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2].map((index) => {
            const x1 = CENTERS[index] + BOX_W / 2 + 8;
            const x2 = CENTERS[index + 1] - BOX_W / 2 - 8;
            const appear = APPEAR[index + 1];
            const progress = interpolate(frame, [appear, appear + 15], [0, 1], easeOutExpo);
            const tip = interpolate(progress, [0, 1], [x1, x2]);

            return (
              <g key={index} opacity={progress}>
                <line
                  x1={x1}
                  y1={ROW_Y}
                  x2={Math.max(x1, tip - 16)}
                  y2={ROW_Y}
                  stroke={TEXT_DARK}
                  strokeWidth={6}
                  strokeLinecap="round"
                />
                <polygon points={`${tip - 20},${ROW_Y - 13} ${tip},${ROW_Y} ${tip - 20},${ROW_Y + 13}`} fill={TEXT_DARK} />
              </g>
            );
          })}
        </svg>

        {LABELS.map((label, index) => {
          const progress = spring({
            frame: frame - APPEAR[index],
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          const dx = interpolate(progress, [0, 1], [-60, 0]);

          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: CENTERS[index] + dx,
                top: ROW_Y,
                width: BOX_W,
                height: BOX_H,
                marginLeft: -BOX_W / 2,
                marginTop: -BOX_H / 2,
                opacity: progress <= 0 ? 0 : 1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background: BOX_GREY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 46,
                  fontWeight: 800,
                  color: TEXT_DARK,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
