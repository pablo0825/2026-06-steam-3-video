import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, NEUTRAL_50, WHITE, YELLOW, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 4 頁・S12：Celeste 三個核心動作透明 Overlay（408 幀）
//   三個方塊角色依序出現，各自反覆示範跳躍／攀牆／衝刺。
//   動作的關鍵格與節奏原樣移植自設計稿（celeste_block_actions_v2.html）：
//   CSS 的 @keyframes 在 Remotion 會凍結在第 0 格，全部改寫成 frame 的函式。
//   場景內的座標一律沿用設計稿的原始 px，最外層再統一放大，方便日後對照。
const BAR_OUT = [48, 72] as const;
const VEIL_IN = [102, 130] as const;
// 最後一格是 407；淡出提早 8 格歸零，尾巴留一拍乾淨的米白底。
const CONTENT_OUT = [375, 399] as const;
const END_FILL = [375, 399] as const;

const SCALE = 2.8; // 設計稿為小預覽窗尺寸，整組放大到 1920×1080
const STAGE_STARTS = [140, 176, 197] as const; // 三個動作依序登場

// 各動作的循環週期（設計稿的 animation-duration ×30fps）
const JUMP_PERIOD = 48; // 1.6s
const CLIMB_PERIOD = 78; // 2.6s
const DASH_PERIOD = 54; // 1.8s

// 設計稿的 timing-function
const easeJump = { ...clamp, easing: Easing.bezier(0.3, 0, 0.3, 1) };
const easeCss = { ...clamp, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }; // CSS 預設 ease
const easeIn = { ...clamp, easing: Easing.bezier(0.42, 0, 1, 1) };

// 場景（設計稿原始 px）
const SCENE_W = 150;
const SCENE_H = 180;
const BLOCK = 34;

const scene: React.CSSProperties = {
  position: "relative",
  width: SCENE_W,
  height: SCENE_H,
};
const block: React.CSSProperties = {
  position: "absolute",
  width: BLOCK,
  height: BLOCK,
  borderRadius: 8,
  background: YELLOW,
};
const surface = withAlpha(WHITE, 0.35); // 地面／牆面

// 循環播放頭：回傳該次循環內的進度 0..1；start 之前一律停在 0
const cycle = (frame: number, start: number, period: number) =>
  frame < start ? 0 : ((frame - start) % period) / period;

const Ground: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 15,
      right: 15,
      height: 8,
      borderRadius: 4,
      background: surface,
    }}
  />
);

// 跳躍：蓄力壓縮 → 起跳拉伸 → 最高點 → 下落拉伸 → 落地壓扁（squash & stretch）
const JumpScene: React.FC<{ t: number }> = ({ t }) => {
  const stops = [0, 0.12, 0.22, 0.45, 0.68, 0.76, 0.88, 1];
  const bottom = interpolate(t, stops, [8, 8, 40, 120, 40, 8, 8, 8], easeJump);
  const sx = interpolate(t, stops, [1, 1.25, 0.8, 1, 0.85, 1.3, 1, 1], easeJump);
  const sy = interpolate(t, stops, [1, 0.7, 1.25, 1, 1.2, 0.65, 1, 1], easeJump);

  return (
    <div style={scene}>
      <Ground />
      <div
        style={{
          ...block,
          bottom,
          left: 58,
          transformOrigin: "bottom center",
          transform: `scale(${sx}, ${sy})`,
        }}
      />
    </div>
  );
};

// 攀牆：一階一階往上，每階到頂時往牆面靠 2px（抓握的頓挫感）
const ClimbScene: React.FC<{ t: number }> = ({ t }) => {
  const bottom = interpolate(
    t,
    [0, 0.08, 0.2, 0.24, 0.36, 0.4, 0.52, 0.56, 0.68, 0.72, 0.82, 0.92, 1],
    [8, 8, 38, 38, 68, 68, 98, 98, 128, 128, 128, 8, 8],
    easeCss,
  );
  const tx = interpolate(
    t,
    [0, 0.08, 0.2, 0.24, 0.36, 0.4, 0.52, 0.56, 0.68, 0.72, 1],
    [0, 0, -2, 0, -2, 0, -2, 0, -2, 0, 0],
    easeCss,
  );

  return (
    <div style={scene}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          top: 6,
          left: 40,
          width: 8,
          borderRadius: 4,
          background: surface,
        }}
      />
      <div style={{ ...block, bottom, left: 50, transform: `translateX(${tx}px)` }} />
    </div>
  );
};

// 衝刺：衝出瞬間水平拉長，後方留下三層殘影與三條速度線
const AFTERIMAGES = [
  { peak: 0.44, fade: 0.6, x: 40, opacity: 0.5 },
  { peak: 0.46, fade: 0.62, x: 66, opacity: 0.35 },
  { peak: 0.48, fade: 0.64, x: 90, opacity: 0.2 },
] as const;
const DASH_LINES = [
  { bottom: 18, width: 40, delay: 0 },
  { bottom: 30, width: 30, delay: 1.2 }, // 設計稿的 .04s
  { bottom: 12, width: 34, delay: 2.4 }, // 設計稿的 .08s
] as const;

const DashScene: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  const t = cycle(frame, start, DASH_PERIOD);
  const left = interpolate(t, [0, 0.34, 0.52, 1], [8, 8, 108, 108], easeIn);
  const sx = interpolate(t, [0, 0.34, 0.4, 0.52, 1], [1, 1, 1.3, 1, 1], easeIn);

  return (
    <div style={scene}>
      <Ground />

      {DASH_LINES.map((line, i) => {
        // 每條速度線各自延遲起跑，所以要用自己的播放頭
        const lt = cycle(frame, start + line.delay, DASH_PERIOD);
        const opacity = interpolate(lt, [0, 0.36, 0.44, 0.56, 1], [0, 0, 1, 0, 0], easeIn);
        const tx = interpolate(lt, [0, 0.36, 0.56, 1], [0, 0, 70, 70], easeIn);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: line.bottom,
              left: 6,
              width: line.width,
              height: 3,
              borderRadius: 2,
              background: withAlpha(YELLOW, 0.6),
              opacity,
              transform: `translateX(${tx}px)`,
            }}
          />
        );
      })}

      {AFTERIMAGES.map((img, i) => (
        <div
          key={i}
          style={{
            ...block,
            bottom: 8,
            left: interpolate(t, [0, 0.34, img.peak, 1], [8, 8, img.x, img.x], easeIn),
            opacity: interpolate(
              t,
              [0, 0.34, img.peak, img.fade, 1],
              [0, 0, img.opacity, 0, 0],
              easeIn,
            ),
          }}
        />
      ))}

      <div style={{ ...block, bottom: 8, left, transform: `scaleX(${sx})` }} />
    </div>
  );
};

export const Ch2Page4S12ActionsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOut = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const veilOpacity = interpolate(frame, VEIL_IN, [0, 0.54], clamp) * contentOut;
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);

  const STAGES = [
    { label: "跳躍", node: <JumpScene t={cycle(frame, STAGE_STARTS[0], JUMP_PERIOD)} /> },
    { label: "攀牆", node: <ClimbScene t={cycle(frame, STAGE_STARTS[1], CLIMB_PERIOD)} /> },
    { label: "衝刺", node: <DashScene frame={frame} start={STAGE_STARTS[2]} /> },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />

      {/* 底部教學標示條 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: withAlpha(BLACK, 0.82),
          opacity: barOpacity,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 2, color: WHITE }}>
          此影片僅用於教學實驗
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2, color: WHITE }}>
          蔚藍 Celeste
        </div>
      </div>

      {/* 三個方塊角色（設計稿原始 px，整組放大） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          transform: `translate(-50%, -50%) scale(${SCALE})`,
          opacity: contentOut,
        }}
      >
        <div style={{ display: "flex", gap: 54 }}>
          {STAGES.map((stage, index) => {
            const enter = spring({
              frame: frame - STAGE_STARTS[index],
              fps,
              config: { damping: 16, stiffness: 130, mass: 0.8 },
            });

            return (
              <div
                key={stage.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
                }}
              >
                {stage.node}
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: WHITE,
                    textShadow: `0 1px 6px ${withAlpha(BLACK, 0.45)}`,
                  }}
                >
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: endFill }} />
    </AbsoluteFill>
  );
};
