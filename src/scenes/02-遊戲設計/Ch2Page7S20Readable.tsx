import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NEUTRAL_50, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeSoft } from "../../theme/motion";

// 第 2 集・第 7 頁・S20：形式多元，但夥伴看得懂最重要（210 幀）
const CONTENT_IN = [0, 24] as const;
const CONTENT_OUT = [180, 209] as const;
const MAIN_IN = [38, 68] as const;
const KEY_IN = [92, 124] as const;

export const Ch2Page7S20Readable: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity =
    interpolate(frame, CONTENT_IN, [0, 1], clamp) *
    interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const mainOpacity = interpolate(frame, MAIN_IN, [0, 1], clamp);
  const mainY = interpolate(frame, MAIN_IN, [22, 0], easeSoft);
  const keyOpacity = interpolate(frame, KEY_IN, [0, 1], clamp);
  const keyY = interpolate(frame, KEY_IN, [30, 0], easeSoft);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: 4,
            color: TEXT_DARK,
            opacity: mainOpacity,
            transform: `translateY(${mainY}px)`,
          }}
        >
          Storyboard 重點在於
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: 6,
            color: YELLOW,
            opacity: keyOpacity,
            transform: `translateY(${keyY}px)`,
          }}
        >
          其他夥伴要看得懂
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
