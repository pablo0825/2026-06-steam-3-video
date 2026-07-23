import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 5 頁・S11-02：透明底轉場 overlay（150 幀）
//   後製直接疊素材，這裡只輸出頭尾的白底轉場：
//   開場 NEUTRAL_50 淡出（露出底下素材）、中間全透明、結尾 NEUTRAL_50 淡入蓋回。
//   ⚠ 透明 overlay，用 calculateAlphaOverlayMetadata 註冊（自動帶 prores／yuva444p10le／4444）。
const OPEN_FILL = [4, 30] as const; // 開場 NEUTRAL_50 淡出
const CLOSE_FILL = [124, 149] as const; // 結尾 NEUTRAL_50 淡入

export const Ch3Page5S11Overlay02: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = Math.max(
    interpolate(frame, OPEN_FILL, [1, 0], clamp),
    interpolate(frame, CLOSE_FILL, [0, 1], clamp),
  );

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* 開場淡出 / 結尾淡入的 NEUTRAL_50 覆蓋層；中間全透明 */}
      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: fill }} />
    </AbsoluteFill>
  );
};
