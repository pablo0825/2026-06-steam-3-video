import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BLACK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { CornerLabel } from "../../components/CornerLabel";

// 第 4 集・第 2 頁・S07：橫式遊戲畫面滿版（150 幀）
//   原合併檔的 540–690 區間已全部 −540 重新基準化為 0 起算。進場淡入 × 結尾淡出到 BLACK。
const LANDSCAPE_IMAGE = staticFile("04-美術整合/screen-size-landscape.png");
const S07_IN = [0, 24] as const;
const ENDING_FADE = [126, 150] as const;

export const Ch4Page2S07Landscape: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity =
    interpolate(frame, S07_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const landscapeScale = interpolate(frame, [0, 150], [1.01, 1], clamp);
  const dimLabelOpacity = interpolate(frame, [30, 50], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: sceneOpacity, overflow: "hidden" }}>
        <Img
          src={LANDSCAPE_IMAGE}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${landscapeScale})`,
          }}
        />
        <CornerLabel text="1920×1080" opacity={dimLabelOpacity} />
        <CornerLabel
          text="Celeste 蔚藍｜僅供教學實驗使用"
          opacity={1}
          placement="bottom"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
