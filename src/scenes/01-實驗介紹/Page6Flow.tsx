import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, BOX_GREY, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";

// 第 6 頁：實驗流程
//   S15：四方塊 Codex → 企劃設計 → 程式實作 → 美術整合 依序滑入、箭頭畫出
//   S16：Codex 方塊高亮放大變藍、標「第 1 部 ▶ 你正在看」，其餘變灰

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const BOX_W = 340;
const BOX_H = 190;
const ROW_Y = 540;
const CENTERS = [280, 733, 1186, 1639];
const LABELS = ["Codex", "企劃設計", "程式實作", "美術整合"];
const APPEAR = [20, 55, 90, 125]; // 各方塊進場 frame

const HILITE_START = 210; // S16：Codex 高亮、其餘變灰
const HILITE_END = 240;
const TAG_START = 228; // 「第 1 部」標籤

export const Page6Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  const t16 = interpolate(frame, [HILITE_START, HILITE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const dimOthers = interpolate(t16, [0, 1], [1, 0.28]);
  const codexScale = 1 + 0.12 * t16;
  const tagIn = spring({ frame: frame - TAG_START, fps, config: { damping: 11, stiffness: 130 } });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 標題 */}
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

      {/* 箭頭 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((i) => {
          const x1 = CENTERS[i] + BOX_W / 2 + 8;
          const x2end = CENTERS[i + 1] - BOX_W / 2 - 8;
          const appear = APPEAR[i + 1];
          const p = interpolate(frame, [appear, appear + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          });
          const tip = interpolate(p, [0, 1], [x1, x2end]);
          return (
            <g key={i} opacity={p * dimOthers}>
              <line x1={x1} y1={ROW_Y} x2={Math.max(x1, tip - 16)} y2={ROW_Y} stroke={TEXT_DARK} strokeWidth={6} strokeLinecap="round" />
              <polygon points={`${tip - 20},${ROW_Y - 13} ${tip},${ROW_Y} ${tip - 20},${ROW_Y + 13}`} fill={TEXT_DARK} />
            </g>
          );
        })}
      </svg>

      {/* 四方塊 */}
      {LABELS.map((label, i) => {
        const isCodex = i === 0;
        const s = spring({ frame: frame - APPEAR[i], fps, config: { damping: 14, stiffness: 120 } });
        const dx = interpolate(s, [0, 1], [-60, 0]);
        const scale = isCodex ? codexScale : 1;
        const opacity = (isCodex ? 1 : dimOthers) * (s <= 0 ? 0 : 1);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: CENTERS[i] + dx,
              top: ROW_Y,
              width: BOX_W,
              height: BOX_H,
              marginLeft: -BOX_W / 2,
              marginTop: -BOX_H / 2,
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {/* 基底（灰） */}
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

            {/* Codex 高亮層（藍），S16 淡入覆蓋 */}
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
                  opacity: t16,
                  boxShadow: `0 16px 40px ${withAlpha(BLUE, 0.35 * t16)}`,
                }}
              >
                {label}
              </div>
            )}

            {/* 第 1 部 ▶ 你正在看 */}
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
  );
};
