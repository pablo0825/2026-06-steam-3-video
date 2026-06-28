import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BLACK, BLUE, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";
import { CornerLabel } from "../../components/CornerLabel";

// 第 4 集・第 2 頁・S07：螢幕尺寸範例（橫式／直式）（260 幀）
//   原 S07/S08 兩個獨立看圖卡合併為 S16 風格的滿版看圖輪播：
//   黑底淡入 → 一次一張滿版大圖 crossfade（橫式 1920×1080／直式 1080×1920）→ 結尾淡出回米白。
//   左上角隨圖切換尺寸標籤；底部進度點＋固定免責標示，避免蓋住素材。
const ENDING_FADE = [230, 260] as const;

// dim：左上角顯示的尺寸標籤文字。w/h：原圖尺寸，用來精算 contain 後的實際顯示大小。
type Example = {
  src: string;
  dim: string;
  w: number;
  h: number;
};
const EXAMPLES: readonly Example[] = [
  {
    src: "04-美術整合/screen-size-landscape.png",
    dim: "1920×1080",
    w: 1920,
    h: 1080,
  },
  {
    src: "04-美術整合/screen-size-portrait.png",
    dim: "1080×1920",
    w: 1080,
    h: 1920,
  },
];

const START = 8; // 第一張進場
const SEG = 104; // 每張顯示長度（含 crossfade）
const FADE = 18; // crossfade 幀數
const SWAP = START + SEG; // 兩張交界（標籤切換點）

// 圖片可用區（上下留黑帶給尺寸標籤／進度點／免責標示）
const VIEW_TOP = 56;
const VIEW_BOTTOM = 100;
const VIEW_W = 1920;
const VIEW_H = 1080 - VIEW_TOP - VIEW_BOTTOM;

export const Ch4Page2S07ScreenSizes: React.FC = () => {
  const frame = useCurrentFrame();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const panelIn = interpolate(frame, [0, 18], [0, 1], clamp); // 黑底淡入

  // 第 i 張的顯示透明度（進場淡入；非最後一張在 SEG 後淡出，與下一張交疊）
  const slideOp = (i: number) => {
    const a = START + i * SEG;
    const fadeIn = interpolate(frame, [a, a + FADE], [0, 1], clamp);
    if (i === EXAMPLES.length - 1) return fadeIn;
    const fadeOut = interpolate(
      frame,
      [a + SEG, a + SEG + FADE],
      [1, 0],
      clamp,
    );
    return fadeIn * fadeOut;
  };

  const activeIdx = frame < SWAP ? 0 : 1;

  // 尺寸標籤：隨圖切換，在交界點短淡出/淡入避免硬跳。
  const labelOp =
    frame < SWAP
      ? interpolate(frame, [START, START + FADE], [0, 1], clamp) *
        interpolate(frame, [SWAP - FADE, SWAP], [1, 0], clamp)
      : interpolate(frame, [SWAP, SWAP + FADE], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* 黑底 viewer（淡入，前後場景平順過渡） */}
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: panelIn }} />

        {/* 滿版大圖（精算 contain 顯示尺寸） */}
        {EXAMPLES.map((ex, i) => {
          const scale = Math.min(VIEW_W / ex.w, VIEW_H / ex.h);
          return (
            <div
              key={ex.dim}
              style={{
                position: "absolute",
                top: VIEW_TOP,
                left: 0,
                right: 0,
                bottom: VIEW_BOTTOM,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: slideOp(i),
              }}
            >
              <Img
                src={staticFile(ex.src)}
                style={{
                  width: ex.w * scale,
                  height: ex.h * scale,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          );
        })}

        {/* 尺寸標籤（左上，隨圖切換） */}
        <CornerLabel text={EXAMPLES[activeIdx].dim} opacity={panelIn * labelOp} />

        {/* 進度小圓點（底部置中，獨佔中央） */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 52,
            display: "flex",
            justifyContent: "center",
            gap: 16,
            opacity: panelIn,
          }}
        >
          {EXAMPLES.map((ex, i) => (
            <div
              key={ex.dim}
              style={{
                width: i === activeIdx ? 34 : 14,
                height: 14,
                borderRadius: 999,
                background: i === activeIdx ? BLUE : withAlpha(WHITE, 0.32),
              }}
            />
          ))}
        </div>

        {/* 固定免責標示（左下角，低調註記） */}
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 46,
            color: withAlpha(WHITE, 0.55),
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1,
            opacity: panelIn,
          }}
        >
          此圖片僅用於教學實驗
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
