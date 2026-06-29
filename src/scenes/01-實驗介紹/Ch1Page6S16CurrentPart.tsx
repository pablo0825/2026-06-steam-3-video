import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, BOX_GREY, NEUTRAL_50, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 6 頁・S16：目前正在看第 1 部 Codex（180 幀）
const CONTENT_OUT = [158, 180] as const;
const BOX_W = 340;
const BOX_H = 190;
const ROW_Y = 540;
const CENTERS = [280, 733, 1186, 1639] as const;
const LABELS = ["Codex", "企劃設計", "程式實作", "美術整合"] as const;

export const Ch1Page6S16CurrentPart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const highlight = interpolate(frame, [0, 30], [0, 1], easeOutExpo);
  const dimOthers = interpolate(highlight, [0, 1], [1, 0.28]);
  const codexScale = 1 + 0.12 * highlight;
  const tagIn = spring({
    frame: frame - 18,
    fps,
    config: { damping: 11, stiffness: 130 },
  });

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

            return (
              <g key={index} opacity={dimOthers}>
                <line
                  x1={x1}
                  y1={ROW_Y}
                  x2={x2 - 16}
                  y2={ROW_Y}
                  stroke={TEXT_DARK}
                  strokeWidth={6}
                  strokeLinecap="round"
                />
                <polygon points={`${x2 - 20},${ROW_Y - 13} ${x2},${ROW_Y} ${x2 - 20},${ROW_Y + 13}`} fill={TEXT_DARK} />
              </g>
            );
          })}
        </svg>

        {LABELS.map((label, index) => {
          const isCodex = index === 0;
          const scale = isCodex ? codexScale : 1;
          const itemOpacity = isCodex ? 1 : dimOthers;

          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: CENTERS[index],
                top: ROW_Y,
                width: BOX_W,
                height: BOX_H,
                marginLeft: -BOX_W / 2,
                marginTop: -BOX_H / 2,
                transform: `scale(${scale})`,
                opacity: itemOpacity,
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

              {isCodex && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    background: BLUE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 46,
                    fontWeight: 800,
                    color: WHITE,
                    opacity: highlight,
                    boxShadow: `0 16px 40px ${withAlpha(BLUE, 0.35 * highlight)}`,
                  }}
                >
                  {label}
                </div>
              )}

              {isCodex && tagIn > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: `translateX(-50%) scale(${tagIn})`,
                    marginTop: 28,
                    background: WHITE,
                    border: `3px solid ${BLUE}`,
                    color: BLUE,
                    fontSize: 32,
                    fontWeight: 800,
                    padding: "10px 24px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  第 1 部 ▶ 你正在看
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
