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
import { NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

// 第 1 集・第 1 頁・S02：課程標題（150 幀）
const LOGO = staticFile("知點LOGO_FIN-03.png");
const TITLE_START = 30;
const SUB_START = 56;
const CONTENT_OUT = [132, 150] as const;
const SUBTITLE = "用 AI 開發遊戲原型";

export const Ch1Page1S02Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const logoTransition = interpolate(frame, [0, 30], [0, 1], easeStandard);
  const logoWidth = interpolate(logoTransition, [0, 1], [620, 260]);
  const logoY = interpolate(logoTransition, [0, 1], [460, 175]);
  const titleScale = spring({
    frame: frame - TITLE_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleOpacity = interpolate(frame, [TITLE_START, TITLE_START + 18], [0, 1], clamp);
  const ruleWidth = interpolate(frame, [TITLE_START + 10, TITLE_START + 34], [0, 360], easeOutExpo);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: logoY,
            transform: "translate(-50%, -50%)",
            opacity: 1,
          }}
        >
          <Img src={LOGO} style={{ width: logoWidth, height: "auto" }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 500,
            transform: `translate(-50%, -50%) scale(${interpolate(titleScale, [0, 1], [0.9, 1])})`,
            opacity: titleOpacity,
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: 6,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          VIBE GAME 教案
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 588,
            transform: "translateX(-50%)",
            width: ruleWidth,
            height: 8,
            borderRadius: 999,
            background: YELLOW,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 660,
            transform: "translateX(-50%)",
            display: "flex",
            fontSize: 52,
            fontWeight: 500,
            color: SUBTLE,
            letterSpacing: 4,
            whiteSpace: "nowrap",
          }}
        >
          {SUBTITLE.split("").map((char, index) => {
            const start = SUB_START + index * 3;
            const charOpacity = interpolate(frame, [start, start + 8], [0, 1], clamp);
            const dy = interpolate(charOpacity, [0, 1], [10, 0]);

            return (
              <span
                key={index}
                style={{
                  opacity: charOpacity,
                  transform: `translateY(${dy}px)`,
                  whiteSpace: "pre",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
