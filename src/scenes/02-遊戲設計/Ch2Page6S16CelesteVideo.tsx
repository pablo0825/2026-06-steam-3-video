import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  DASH_BORDER,
  NEUTRAL_50,
  PANEL_BG,
  SUBTLE,
  TEXT_DARK,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 2 集・第 6 頁・S16：Celeste 遊戲影片佔位卡（252 幀）
const CONTENT_OUT = [210, 238] as const;
const PLACEHOLDER_IN = [28, 60] as const;

export const Ch2Page6S16CelesteVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const title = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const placeholderIn = interpolate(frame, PLACEHOLDER_IN, [0, 1], easeStandard);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity, alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 145,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: 5,
            color: TEXT_DARK,
            opacity: title,
            transform: `scale(${interpolate(title, [0, 1], [0.94, 1])})`,
          }}
        >
          Celeste 遊戲影片
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 610,
            width: 1040,
            height: 585,
            transform: `translate(-50%, -50%) translateY(${interpolate(
              placeholderIn,
              [0, 1],
              [55, 0],
            )}px)`,
            opacity: placeholderIn,
            borderRadius: 24,
            border: `4px dashed ${DASH_BORDER}`,
            backgroundColor: PANEL_BG,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
            <rect
              x="8"
              y="18"
              width="76"
              height="56"
              rx="10"
              fill="none"
              stroke={SUBTLE}
              strokeWidth="4"
            />
            <path d="M40 34 62 46 40 58Z" fill={SUBTLE} />
          </svg>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: 3,
              color: TEXT_DARK,
            }}
          >
            剪輯時置換影片素材
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 2,
              color: SUBTLE,
            }}
          >
            建議保留約 8 秒
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
