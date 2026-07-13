import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLACK, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 6 頁・S17-01：Celeste 實機畫面 overlay（272 幀，alpha overlay）
//   內容同 S11：底部黑底字幕條；開場自米白填底淡出進實機畫面。
//   與 S11 的差別：結尾再淡回米白填底，收乾淨後銜接 S17-02 的循環圖。
const OPEN_FILL = [6, 34] as const;
const END_FILL = [244, 268] as const; // 272 幀的最後格為 271，提前填滿確保收乾淨

export const Ch2Page6S17CelesteLoop01: React.FC = () => {
  const frame = useCurrentFrame();
  // 米白填底：開場淡出讓出實機畫面，結尾淡回來蓋住（含字幕條）
  const fill = Math.max(
    interpolate(frame, OPEN_FILL, [1, 0], clamp),
    interpolate(frame, END_FILL, [0, 1], clamp),
  );

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: withAlpha(BLACK, 0.82),
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          此影片僅用於教學實驗
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          蔚藍 Celeste
        </div>
      </div>

      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: fill }} />
    </AbsoluteFill>
  );
};
