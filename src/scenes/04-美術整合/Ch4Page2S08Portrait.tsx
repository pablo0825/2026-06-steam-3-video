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

// 第 4 集・第 2 頁・S08：直式遊戲畫面置中，黑底補兩側（150 幀）
//   原合併檔的 690–840 區間已全部 −690 重新基準化為 0 起算。進場淡入 × 結尾淡出到 BLACK。
const PORTRAIT_IMAGE = staticFile("04-美術整合/screen-size-portrait.png");
const S08_IN = [0, 24] as const;
const ENDING_FADE = [124, 150] as const;

export const Ch4Page2S08Portrait: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity =
    interpolate(frame, S08_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const dimLabelOpacity = interpolate(frame, [30, 50], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: sceneOpacity,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Img
          src={PORTRAIT_IMAGE}
          style={{
            height: "100%",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
        <CornerLabel text="1080×1920" opacity={dimLabelOpacity} />
        <CornerLabel
          text="Dodgeball Dojo｜僅供教學實驗使用"
          opacity={1}
          placement="bottom"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
