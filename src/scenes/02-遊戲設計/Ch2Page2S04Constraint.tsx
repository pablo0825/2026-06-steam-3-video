import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CHIP_BG,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  YELLOW,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 2 頁・S04：限制設計定義（240 幀）
const DEF_START = 40;
const GAMEJAM_TAG_START = 150;
const CONTENT_OUT = [196, 224] as const;
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

export const Ch2Page2S04Constraint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const defOpacity = interpolate(frame, [DEF_START, DEF_START + 18], [0, 1], clamp);
  const tagProgress = spring({
    frame: frame - GAMEJAM_TAG_START,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

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
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: 8,
            color: TEXT_DARK,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
            opacity: titleIn,
          }}
        >
          限制設計
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 52,
            fontWeight: 500,
            letterSpacing: 2,
            color: SUBTLE,
            opacity: defOpacity,
            whiteSpace: "nowrap",
          }}
        >
          就是在<span style={KEY}>有限的條件</span>下，去做設計
        </div>

        <div
          style={{
            marginTop: 64,
            fontSize: 34,
            fontWeight: 700,
            color: TEXT_DARK,
            background: CHIP_BG,
            padding: "16px 40px",
            borderRadius: 999,
            letterSpacing: 2,
            opacity: tagProgress,
            transform: `translateY(${interpolate(tagProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          💡 大家都知道的例子：Game Jam
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
