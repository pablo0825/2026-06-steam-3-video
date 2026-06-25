import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, SUBTLE, TEXT_DARK, YELLOW } from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const LOGO = staticFile("知點LOGO_FIN-03.png"); // 共用品牌素材，置於 public 根目錄

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 第 4 集・第 1 頁・S01：開場標題（210 幀，結尾淡出到 NEUTRAL_50）
//   知點 logo 進場 → 縮到上方 → 主標「VIBE GAME 教案」＋黃線，副標「第 4 集・美術整合」
const LOGO_MOVE = [40, 70] as const; // logo 上移縮小
const TITLE_START = 72;
const SUB_START = 96;
const ENDING_FADE = [188, 210] as const;

export const Ch4Page1S01Opening: React.FC = () => {
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
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
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
          <Img src={LOGO} style={{ width: logoW, height: "auto" }} />
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
              VIBE GAME 教案
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
              第 4 集・美術整合
            </div>
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
