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

// 第 4 集・第 6 頁・S16：Sprite Sheet 範例（角色動畫／物件／UI）（350 幀）
//   全螢幕看圖模式：黑底淡入 → 一次一張滿版大圖輪播（留白填黑）→ 結尾淡出回米白。
//   上方黑帶放標籤、下方黑帶放進度點＋固定免責標示，避免蓋住素材。
const ENDING_FADE = [314, 344] as const; // 於最後一格前完成淡出（350 幀的最後格為 349）

// pixelated：放大時保持像素清晰；角色圖原圖較大(1024²)為縮小顯示，用 auto 平滑即可。
// w/h：原圖尺寸，用來精算 contain 後的實際顯示大小（白底要剛好等於圖片）。
// bg：透明圖（UI）墊白底，避免在黑底上看不清；白底尺寸 = 圖片顯示尺寸。
type Example = {
  src: string;
  label: string;
  pixelated: boolean;
  w: number;
  h: number;
  bg?: string;
};
const EXAMPLES: readonly Example[] = [
  {
    src: "04-美術整合/sprite-character.avif",
    label: "角色動畫",
    pixelated: false,
    w: 1024,
    h: 1024,
  },
  {
    src: "04-美術整合/sprite-object.png",
    label: "物件",
    pixelated: true,
    w: 640,
    h: 277,
  },
  {
    src: "04-美術整合/sprite-ui.png",
    label: "UI",
    pixelated: true,
    w: 500,
    h: 500,
    bg: WHITE,
  },
];

const START = 8; // 第一張進場
const SEG = 104; // 每張顯示長度（含 crossfade）
const FADE = 18; // crossfade 幀數

// 圖片可用區（上下留黑帶給進度點／免責標示）
const VIEW_TOP = 56;
const VIEW_BOTTOM = 100;
const VIEW_W = 1920;
const VIEW_H = 1080 - VIEW_TOP - VIEW_BOTTOM;

export const Ch4Page6S16SpriteSheetExample: React.FC = () => {
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

  const activeIdx = frame < START + SEG ? 0 : frame < START + 2 * SEG ? 1 : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* 黑底 viewer（淡入，前後場景平順過渡） */}
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: panelIn }} />

        {/* 滿版大圖（精算 contain 顯示尺寸；透明圖墊等大白底） */}
        {EXAMPLES.map((ex, i) => {
          const scale = Math.min(VIEW_W / ex.w, VIEW_H / ex.h);
          return (
            <div
              key={ex.label}
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
              <div
                style={{
                  width: ex.w * scale,
                  height: ex.h * scale,
                  background: ex.bg,
                }}
              >
                <Img
                  src={staticFile(ex.src)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    imageRendering: ex.pixelated ? "pixelated" : "auto",
                  }}
                  from={-66}
                />
              </div>
            </div>
          );
        })}

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
              key={ex.label}
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
