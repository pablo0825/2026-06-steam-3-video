import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CHIP_BG, NEUTRAL_50, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 1 頁・S01：知點 logo 與主講人（120 幀）
const LOGO = staticFile("知點LOGO_FIN-03.png");
const CONTENT_OUT = [104, 120] as const;

export const Ch1Page1S01Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const logoIn = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const chipIn = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 460,
            transform: `translate(-50%, -50%) scale(${logoIn})`,
            opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          }}
        >
          <Img src={LOGO} style={{ width: 620, height: "auto" }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 720,
            transform: `translate(-50%, ${interpolate(chipIn, [0, 1], [40, 0])}px)`,
            opacity: chipIn,
            background: CHIP_BG,
            color: TEXT_DARK,
            fontSize: 40,
            fontWeight: 600,
            padding: "16px 40px",
            borderRadius: 999,
            letterSpacing: 2,
          }}
        >
          主講人：育嘉
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
