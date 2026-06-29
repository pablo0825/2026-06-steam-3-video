import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CHIP_BG, NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 2 集・第 3 頁・S09：限制設計發想方法（251 幀）
const CON_RISE = [0, 30] as const;
const CON_MOVE = [68, 98] as const;
const ARROW_IN = [102, 126] as const;
const INSPIRE_IN = [124, 156] as const;
const CAP_IN = [164, 190] as const;
const CONTENT_OUT = [229, 251] as const;

const CON_X_CENTER = 960;
const CON_X_LEFT = 720;
const ARROW_X = 970;
const INSPIRE_X = 1200;
const LINE_Y = 505;
const CAP_Y = 615;

export const Ch2Page3S09ConstraintMethod: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  const conRise = interpolate(frame, CON_RISE, [0, 1], clamp);
  const conRiseY = interpolate(frame, CON_RISE, [50, 0], easeStandard);
  const conX = interpolate(frame, CON_MOVE, [CON_X_CENTER, CON_X_LEFT], easeStandard);
  const arrowIn = interpolate(frame, ARROW_IN, [0, 1], clamp);
  const inspireOpacity = interpolate(frame, INSPIRE_IN, [0, 1], clamp);
  const inspireY = interpolate(frame, INSPIRE_IN, [40, 0], easeStandard);
  const captionOpacity = interpolate(frame, CAP_IN, [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: conX,
            top: LINE_Y,
            transform: `translate(-50%, calc(-50% + ${conRiseY}px))`,
            opacity: conRise,
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: 2,
            color: TEXT_DARK,
            background: CHIP_BG,
            padding: "16px 44px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          有約束
        </div>

        <div
          style={{
            position: "absolute",
            left: ARROW_X,
            top: LINE_Y,
            transform: "translate(-50%, -50%)",
            opacity: arrowIn,
            fontSize: 60,
            fontWeight: 800,
            color: SUBTLE,
          }}
        >
          →
        </div>

        <div
          style={{
            position: "absolute",
            left: INSPIRE_X,
            top: LINE_Y,
            transform: `translate(-50%, calc(-50% + ${inspireY}px))`,
            opacity: inspireOpacity,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: 4,
            color: YELLOW,
            whiteSpace: "nowrap",
          }}
        >
          激發靈感
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: CAP_Y,
            transform: "translateX(-50%)",
            opacity: captionOpacity,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          限制設計，是不錯的發想方法
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
