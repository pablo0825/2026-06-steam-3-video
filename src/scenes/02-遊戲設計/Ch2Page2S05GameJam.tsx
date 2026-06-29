import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 2 集・第 2 頁・S05：Game Jam 說明（480 幀）
const GAMEJAM = staticFile("02-遊戲設計/gamejam.png");

const TITLE_IN = [4, 34] as const;
const IMG_IN = [44, 82] as const;
const MOVE = [128, 164] as const;
const ESTABLISH_OUT = [128, 158] as const;
const A_IN = [170, 198] as const;
const A_OUT = [290, 314] as const;
const B_IN = [312, 342] as const;
const CONTENT_OUT = [450, 476] as const;
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

export const Ch2Page2S05GameJam: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  const titleOpacity =
    interpolate(frame, TITLE_IN, [0, 1], clamp) *
    interpolate(frame, ESTABLISH_OUT, [1, 0], clamp);
  const titleRise = interpolate(frame, TITLE_IN, [20, 0], easeStandard);
  const imgOpacity = interpolate(frame, IMG_IN, [0, 1], clamp);
  const imgRise = interpolate(frame, IMG_IN, [70, 0], easeStandard);
  const imgX = interpolate(frame, MOVE, [960, 548], easeStandard);
  const imgScale = interpolate(frame, MOVE, [1, 0.62], easeStandard);
  const captionOpacity =
    interpolate(frame, IMG_IN, [0, 1], clamp) *
    interpolate(frame, ESTABLISH_OUT, [1, 0], clamp);

  const aTy =
    interpolate(frame, A_IN, [30, 0], clamp) +
    interpolate(frame, A_OUT, [0, -44], clamp);
  const aOpacity =
    interpolate(frame, A_IN, [0, 1], clamp) *
    interpolate(frame, A_OUT, [1, 0], clamp);
  const bTy = interpolate(frame, B_IN, [44, 0], clamp);
  const bOpacity = interpolate(frame, B_IN, [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 196,
            transform: `translate(-50%, calc(-50% + ${titleRise}px))`,
            fontSize: 60,
            fontWeight: 800,
            letterSpacing: 4,
            color: TEXT_DARK,
            opacity: titleOpacity,
          }}
        >
          Game Jam
        </div>

        <Img
          src={GAMEJAM}
          style={{
            position: "absolute",
            left: imgX,
            top: 540,
            width: 820,
            height: 512,
            objectFit: "cover",
            transform: `translate(-50%, calc(-50% + ${imgRise}px)) scale(${imgScale})`,
            opacity: imgOpacity,
            borderRadius: 20,
            boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.16)}`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 838,
            transform: `translate(-50%, calc(-50% + ${imgRise}px))`,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 1,
            color: SUBTLE,
            opacity: captionOpacity,
          }}
        >
          Global Game Jam・教學用途
        </div>

        <div style={{ position: "absolute", left: 1010, top: 540, transform: "translateY(-50%)", width: 800 }}>
          <div style={{ opacity: aOpacity, transform: `translateY(${aTy}px)` }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: TEXT_DARK, letterSpacing: 1 }}>
              ⏱ 限時 1～3 天做出遊戲
            </div>
            <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, color: SUBTLE, lineHeight: 1.5 }}>
              用時間壓力，激發開發者的創意
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", left: 1010, top: 540, transform: "translateY(-50%)", width: 800 }}>
          <div style={{ opacity: bOpacity, transform: `translateY(${bTy}px)` }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: TEXT_DARK, letterSpacing: 1 }}>
              不過，它的限制偏<span style={KEY}>「活動層面」</span>
            </div>
            <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, color: SUBTLE, lineHeight: 1.5 }}>
              與遊戲本體較無關
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
