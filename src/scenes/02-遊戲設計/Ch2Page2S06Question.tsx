import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLUE, NEUTRAL_50, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 2 頁・S06：轉場提問（210 幀）
const CONTENT_IN = [6, 42] as const;
const CONTENT_OUT = [188, 209] as const;
const ARROW_START = 104;
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

export const Ch2Page2S06Question: React.FC = () => {
  const frame = useCurrentFrame();
  const contentIn = interpolate(frame, CONTENT_IN, [0, 1], clamp);
  const opacity = contentIn * interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const arrowOpacity = interpolate(frame, [ARROW_START, ARROW_START + 20], [0, 1], clamp);
  const arrowNudge = frame >= ARROW_START ? ((1 - Math.cos((frame - ARROW_START) / 7)) / 2) * 8 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 4,
            color: TEXT_DARK,
            transform: `scale(${interpolate(contentIn, [0, 1], [0.94, 1])})`,
            whiteSpace: "nowrap",
          }}
        >
          <span style={KEY}>「遊戲本體」</span>的限制設計呢？
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 3,
            color: BLUE,
            opacity: arrowOpacity,
          }}
        >
          來看下一個案例{" "}
          <span style={{ display: "inline-block", transform: `translateX(${arrowNudge}px)` }}>→</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
