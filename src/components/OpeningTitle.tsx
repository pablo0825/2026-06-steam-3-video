import React from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SUBTLE, TEXT_DARK, YELLOW } from "../theme/colors";
import { clamp } from "../theme/motion";

const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

// 各集開場標題版型：知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 N 集・…」。
//   時間軸自 frame 0 起算（三集開場皆從頭播放）。只負責內容；背景與整段淡入淡出交給呼叫端容器。
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;

type OpeningTitleProps = {
  subtitle: string; // 例如「第 4 集・美術整合」
  title?: string; // 主標，預設「VIBE GAME 教案」
};

export const OpeningTitle: React.FC<OpeningTitleProps> = ({
  subtitle,
  title = "VIBE GAME 教案",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const t2 = interpolate(frame, LOGO_MOVE, [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const logoW = interpolate(t2, [0, 1], [560, 220]);
  const logoY = interpolate(t2, [0, 1], [460, 150]);

  const titleScale = spring({
    frame: frame - TITLE_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleOpacity = interpolate(
    frame,
    [TITLE_START, TITLE_START + 18],
    [0, 1],
    clamp,
  );
  const ruleW = interpolate(
    frame,
    [TITLE_START + 10, TITLE_START + 34],
    [0, 380],
    { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );
  const subOpacity = interpolate(
    frame,
    [SUB_START, SUB_START + 18],
    [0, 1],
    clamp,
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: logoY,
          transform: `translate(-50%, -50%) scale(${logoIn})`,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Img src={LOGO} style={{ width: logoW, height: "auto" }} from={-25} />
      </div>
      {frame >= TITLE_START && (
        <>
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
            {title}
          </div>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 588,
              transform: "translateX(-50%)",
              width: ruleW,
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
              opacity: subOpacity,
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: 10,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </div>
        </>
      )}
    </>
  );
};
