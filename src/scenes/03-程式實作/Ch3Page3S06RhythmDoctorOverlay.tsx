import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLACK, WHITE, YELLOW, withAlpha } from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 3 頁・S06：Rhythm Doctor 案例標題透明 Overlay（240 幀）
const GLOW_IN = [0, 18] as const;
const TITLE_IN = [10, 38] as const;
const TITLE_OUT = [196, 222] as const;

export const Ch3Page3S06RhythmDoctorOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const titleIn = interpolate(frame, TITLE_IN, [0, 1], easeStandard);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], easeStandard);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1120,
            height: 620,
            borderRadius: "50%",
            opacity: glowOpacity,
            background: `radial-gradient(ellipse, ${withAlpha(BLACK, 0.7)} 0%, ${withAlpha(BLACK, 0.44)} 38%, ${withAlpha(BLACK, 0)} 72%)`,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${titleY}px)`,
            textShadow: `0 4px 24px ${withAlpha(BLACK, 0.5)}`,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 8,
              color: YELLOW,
            }}
          >
            User Story 案例
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 104,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 12,
              color: WHITE,
            }}
          >
            節奏醫生
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: 6,
              color: withAlpha(WHITE, 0.78),
            }}
          >
            Rhythm Doctor
          </div>
          <div
            style={{
              marginTop: 30,
              width: 112,
              height: 6,
              borderRadius: 999,
              backgroundColor: YELLOW,
              boxShadow: `0 0 22px ${withAlpha(YELLOW, 0.42)}`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
