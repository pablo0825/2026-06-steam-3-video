import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 4 頁・S08：Context 定義（240 幀）
const CONTENT_OUT = [212, 238] as const;
const DEFINITION_IN = [44, 68] as const;

export const Ch3Page4S08Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, DEFINITION_IN, [0, 1], easeStandard);
  const out = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: out,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: 3,
            color: TEXT_DARK,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
            opacity: titleIn,
          }}
        >
          Context
        </div>
        <div
          style={{
            marginTop: 44,
            maxWidth: 1540,
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.6,
            letterSpacing: 1,
            textAlign: "center",
            color: SUBTLE,
            opacity: definitionIn,
          }}
        >
          Context 是 AI 的
          <span style={{ color: YELLOW, fontWeight: 800 }}>短期記憶</span>
          ，我們和 AI 的對話，會
          <span style={{ color: YELLOW, fontWeight: 800 }}>暫時存在</span>{" "}
          Context 裡
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
