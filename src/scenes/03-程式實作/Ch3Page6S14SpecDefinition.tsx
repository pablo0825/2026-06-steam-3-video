import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

export const Ch3Page6S14SpecDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, [34, 58], [0, 1], clamp);
  const out = interpolate(frame, [126, 148], [1, 0], clamp);

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
            transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
            opacity: titleIn,
            fontSize: 94,
            fontWeight: 900,
            letterSpacing: 3,
            color: TEXT_DARK,
          }}
        >
          Spec
        </div>

        <div
          style={{
            marginTop: 44,
            opacity: definitionIn,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 2,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          把討論整理成可
          <span style={{ color: YELLOW, fontWeight: 900 }}>長期保存</span>
          的
          <span style={{ color: YELLOW, fontWeight: 900 }}>規格文件</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
