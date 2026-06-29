import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BLACK,
  BORDER_LIGHT,
  CHIP_BG,
  NEUTRAL_50,
  TEXT_DARK,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 4 頁・S10：原型實機影片置中介紹（150 幀）
const VIDEO = staticFile("01-實驗介紹/prototype-demo.mp4");
const VIDEO_VOLUME = 0.25;
const CONTENT_OUT = [132, 150] as const;
const VIDEO_HEIGHT = 900;
const VIDEO_WIDTH = Math.round((VIDEO_HEIGHT * 714) / 1270);
const VIDEO_Y = 565;

export const Ch1Page4S10PrototypeVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const chipOpacity = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: VIDEO_Y,
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
            marginLeft: -VIDEO_WIDTH / 2,
            marginTop: -VIDEO_HEIGHT / 2,
            transform: "scale(1.06)",
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: `0 24px 60px ${withAlpha(BLACK, 0.18)}`,
            border: `1px solid ${BORDER_LIGHT}`,
            backgroundColor: BLACK,
          }}
        >
          <OffthreadVideo
            src={VIDEO}
            volume={VIDEO_VOLUME}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 960,
            top: VIDEO_Y - VIDEO_HEIGHT / 2 - 55,
            transform: "translateX(-50%)",
            opacity: chipOpacity,
            background: CHIP_BG,
            color: TEXT_DARK,
            fontSize: 34,
            fontWeight: 700,
            padding: "10px 30px",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          我的原型
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
