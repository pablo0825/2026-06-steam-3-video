import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 2 頁・S06：轉場提問（210 幀）
const TITLE_IN = [5, 28] as const;
const CONTENT_OUT = [188, 209] as const;
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const Ch2Page2S06Question: React.FC = () => {
  const frame = useCurrentFrame();
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const titleScale = interpolate(titleIn, [0, 1], [0.9, 1]);
  const opacity = titleIn * interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          opacity,
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: 4,
          color: TEXT_DARK,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        在「遊戲」上的限制設計？
      </div>
    </AbsoluteFill>
  );
};
