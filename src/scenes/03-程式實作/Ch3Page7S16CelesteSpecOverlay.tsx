import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLACK, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 7 頁・S16：Celeste 出處條透明 Overlay（240 幀）
//   開場先滿版 NEUTRAL_50 白底，停留後淡出化開到透明底；
//   貼底滿寬實心黑條全程常駐：左＝教學用途免責，右＝蔚藍出處。
const OPEN_FILL = [6, 34] as const; // 開場白底：前 6 幀純白，之後淡出露出透明底

export const Ch3Page7S16CelesteSpecOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  // 開場滿版白底停留後淡出（第 0 幀純白，無縫承接前一支白底）
  const openFill = interpolate(frame, OPEN_FILL, [1, 0], clamp);

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
          此影片僅用於教學實驗上
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

      {/* 開場滿版白底：停留後淡出化開到透明底 */}
      <AbsoluteFill
        style={{ backgroundColor: NEUTRAL_50, opacity: openFill }}
      />
    </AbsoluteFill>
  );
};
