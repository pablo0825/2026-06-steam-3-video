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

// 第 1 集・第 6 頁・S15：四階段實驗流程，並標出目前在看第 1 部 Codex（390 幀）
//   原本被拆成 S15(四階段流程)/S16(高亮 Codex＋「你正在看」) 兩顆，此處合併回單一連續鏡頭：
//   標題＋四方塊由左至右滑入 → 約 f=210 Codex 藍色高亮放大、其餘變暗、彈出「第 1 部」標籤。
const CONTENT_OUT = [368, 389] as const;
const BOX_W = 340;
const BOX_H = 190;
const ROW_Y = 540;
const CENTERS = [280, 733, 1186, 1639] as const;
const LABELS = ["Codex", "企劃設計", "程式實作", "美術整合"] as const;
const APPEAR = [20, 55, 90, 125] as const;

// 高亮 Codex（第二拍）於四方塊建完後開始。
const HIGHLIGHT = [210, 240] as const;
const TAG_START = 228;

export const Ch1Page6S15ExperimentFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // 第二拍：Codex 高亮、其餘變暗、標籤彈出。
  const highlight = interpolate(frame, HIGHLIGHT, [0, 1], easeOutExpo);
  const dimOthers = interpolate(highlight, [0, 1], [1, 0.28]);
  const codexScale = 1 + 0.12 * highlight;
  const tagIn = spring({ frame: frame - TAG_START, fps, config: { damping: 11, stiffness: 130 } });

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
              <g key={index} opacity={progress * dimOthers}>
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
          const appearProgress = spring({
            frame: frame - APPEAR[index],
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          const dx = interpolate(appearProgress, [0, 1], [-60, 0]);
          const isCodex = index === 0;
          const scale = isCodex ? codexScale : 1;
          const itemOpacity =
            appearProgress <= 0 ? 0 : isCodex ? 1 : dimOthers;

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
