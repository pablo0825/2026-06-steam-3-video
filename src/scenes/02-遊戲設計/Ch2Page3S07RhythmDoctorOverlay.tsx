import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLACK, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

const OPEN_FILL = [6, 34] as const;

export const Ch2Page3S07RhythmDoctorOverlay: React.FC = () => {
  const frame = useCurrentFrame();
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
          節奏醫生 Rhythm Doctor
        </div>
      </div>

      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: openFill }} />
    </AbsoluteFill>
  );
};
