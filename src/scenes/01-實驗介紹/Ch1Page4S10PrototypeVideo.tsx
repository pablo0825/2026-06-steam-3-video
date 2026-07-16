import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 4 頁・S10：原型實機影片段落（150 幀）
//   影片改由後製直接疊上，這裡只輸出透明底的頭尾轉場：
//   開場 NEUTRAL_50 淡出（露出底下影片）、中間全透明、結尾 NEUTRAL_50 淡入蓋回。
//   ⚠ 透明 overlay，render 需帶 --prores-profile=4444 --pixel-format=yuva444p10le。
const OPEN_FILL = [4, 30] as const; // 開場 NEUTRAL_50 淡出
const CLOSE_FILL = [124, 149] as const; // 結尾 NEUTRAL_50 淡入

export const Ch1Page4S10PrototypeVideo: React.FC = () => {
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
