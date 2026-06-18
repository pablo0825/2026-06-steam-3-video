import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { WHITE } from "../../theme/colors";

// 第 0 頁：知點 logo 片頭卡（獨立 composition，剪接時自行接在開頭）
//   ① logo 淡入 ＋ 微放大置中（沿用結尾卡氣質）
//   ② 停住讓人看
//   ③ logo 淡出，背景維持白底 →「淡出轉白場」

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png");

// ── 節奏（30fps；總長 120 frames＝4 秒）──
const IN_END = 30; // logo 淡入＋放大完成
const OUT_START = 95; // 開始淡出
const OUT_END = 120; // 淡出完成（轉白場收尾）

export const Page0LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // ① 淡入 → ② 停住 → ③ 淡出（白底不變，等於淡出轉白場）
  const opacity = interpolate(
    frame,
    [0, IN_END, OUT_START, OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 微放大：0.86 → 1（與結尾卡一致）
  const scale = interpolate(frame, [0, IN_END], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        fontFamily: FONT,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={LOGO}
        style={{
          width: 400,
          height: "auto",
          opacity,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
