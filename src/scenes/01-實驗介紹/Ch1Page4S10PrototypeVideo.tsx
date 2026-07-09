import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BLACK, NEUTRAL_50 } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 4 頁・S10：原型實機影片（直式，放到滿版、兩側黑邊）（150 幀）
//   開場 NEUTRAL_50 覆蓋淡出露出影片、結尾 NEUTRAL_50 淡入蓋回（仿 S07 開頭）。
const VIDEO = staticFile("01-實驗介紹/prototype-demo.mp4");
const VIDEO_VOLUME = 0.25;
const VIDEO_HEIGHT = 1080; // 滿版高度
const VIDEO_WIDTH = Math.round((VIDEO_HEIGHT * 714) / 1270); // 依原比例 → 607
const OPEN_FILL = [4, 30] as const; // 開場 NEUTRAL_50 淡出
const CLOSE_FILL = [124, 149] as const; // 結尾 NEUTRAL_50 淡入

export const Ch1Page4S10PrototypeVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = Math.max(
    interpolate(frame, OPEN_FILL, [1, 0], clamp),
    interpolate(frame, CLOSE_FILL, [0, 1], clamp),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, fontFamily: FONT }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT, overflow: "hidden" }}>
          <OffthreadVideo
            src={VIDEO}
            volume={VIDEO_VOLUME}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>

      {/* 開場淡出 / 結尾淡入的 NEUTRAL_50 覆蓋層 */}
      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: fill }} />
    </AbsoluteFill>
  );
};
