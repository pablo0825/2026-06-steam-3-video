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
import { BLACK, NEUTRAL_50, SUBTLE, TEXT_DARK, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 10 頁・S25：感謝聆聽（90 幀，依既有實作節奏）
const CONTENT_OUT = [70, 89] as const;
const HOST_PHOTO = staticFile("01-實驗介紹/host-yujia.jpg");

export const Ch1Page10S25Thanks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const introIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 210,
            transform: `translateX(-50%) scale(${interpolate(introIn, [0, 1], [0.92, 1])})`,
            opacity: introIn,
            width: 1120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Img
            src={HOST_PHOTO}
            style={{
              width: 600,
              height: "auto",
              borderRadius: 12,
              boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.12)}`,
            }}
            from={-13}
          />

          <div
            style={{
              marginTop: 44,
              fontSize: 100,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            感謝各位聆聽！
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 46,
              fontWeight: 500,
              letterSpacing: 4,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            祝大家開發順利
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
