import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  CAT_ART,
  CAT_CODE,
  CAT_PLAN,
  DIVIDER,
  GREEN,
  NEUTRAL_50,
  PANEL_BG,
  RED,
  TEXT_DARK,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";

// 第 4 集・第 6 頁・S15：散亂 vs. 集中 左右對比
//   原合併檔的 frame 區間（228–600）已全部 −228 重新基準化為 0 起算。
//   放大定格(350)後多停 1 秒(30幀)再淡出 [390,418]，淡到 0 後露出 NEUTRAL_50 白底（停到 426）。
const S15_IN = [0, 34] as const; // 進場淡入
const ENDING_FADE = [390, 418] as const; // 結尾淡出到 NEUTRAL_50

// 瓦片種類
type TileKind = "floor" | "brick" | "spike" | "coin" | "grass" | "box" | "gem";

// Record<TileKind, string> 強制每種 kind 都要有對應色
const TILE_COLORS: Record<TileKind, string> = {
  floor: CAT_ART,
  brick: RED,
  spike: BLUE,
  coin: YELLOW,
  grass: GREEN,
  box: CAT_PLAN,
  gem: CAT_CODE,
};

// 種類 → 形狀：依 kind 回傳對應的 SVG 圖形，並塗上傳入的 color
const TileIcon: React.FC<{ kind: TileKind; color: string }> = ({
  kind,
  color,
}) => {
  switch (kind) {
    case "floor":
      return (
        <g fill={color}>
          <rect x={16} y={34} width={68} height={14} rx={3} />
          <rect x={16} y={54} width={30} height={14} rx={3} />
          <rect x={54} y={54} width={30} height={14} rx={3} />
        </g>
      );
    case "brick":
      return (
        <g fill={color}>
          <rect x={14} y={30} width={34} height={16} rx={2} />
          <rect x={52} y={30} width={34} height={16} rx={2} />
          <rect x={32} y={52} width={36} height={16} rx={2} />
        </g>
      );
    case "spike":
      return <path d="M50 24 L80 78 L20 78 Z" fill={color} />;
    case "coin":
      return (
        <g fill="none" stroke={color} strokeWidth={8}>
          <circle cx={50} cy={50} r={26} />
          <circle cx={50} cy={50} r={12} />
        </g>
      );
    case "grass":
      return (
        <g fill={color}>
          <path d="M30 74 L38 40 L46 74 Z" />
          <path d="M48 74 L56 32 L64 74 Z" />
          <path d="M62 74 L70 46 L78 74 Z" />
        </g>
      );
    case "box":
      return (
        <g fill="none" stroke={color} strokeWidth={8} strokeLinecap="round">
          <rect x={26} y={26} width={48} height={48} rx={4} />
          <path d="M26 26 L74 74 M74 26 L26 74" />
        </g>
      );
    case "gem":
      return <path d="M50 22 L78 50 L50 80 L22 50 Z" fill={color} />;
    default:
      return null;
  }
};

const SpriteTile: React.FC<{
  kind: TileKind;
  size: number;
  appear: number;
  rotate?: number;
}> = ({ kind, size, appear, rotate = 0 }) => {
  const color = TILE_COLORS[kind];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.18,
        backgroundColor: withAlpha(color, 0.16),
        border: `2px solid ${withAlpha(color, 0.5)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: appear,
        transform: `scale(${interpolate(appear, [0, 1], [0.6, 1], clamp)}) rotate(${rotate}deg)`,
      }}
    >
      <svg viewBox="0 0 100 100" width={size * 0.7} height={size * 0.7}>
        <TileIcon kind={kind} color={color} />
      </svg>
    </div>
  );
};

// 定位 + 進場（translateY）的外層；視覺交給 VerdictBadge
const ContrastLabel: React.FC<{ kind: "cross" | "check"; show: number }> = ({
  kind,
  show,
}) => {
  const isCross = kind === "cross";
  return (
    <div
      style={{
        position: "absolute",
        top: 840,
        left: isCross ? 180 : 1180,
        width: isCross ? 600 : 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: show,
        transform: `translateY(${interpolate(show, [0, 1], [18, 0], clamp)}px)`,
      }}
    >
      <VerdictBadge
        kind={isCross ? "fail" : "pass"}
        label={isCross ? "多檔案管理困難" : "一張圖集中管理"}
        labelColor={TEXT_DARK}
      />
    </div>
  );
};

const SCATTER: { kind: TileKind; left: number; top: number; rot: number }[] = [
  { kind: "floor", left: 210, top: 300, rot: -8 },
  { kind: "brick", left: 430, top: 250, rot: 6 },
  { kind: "spike", left: 620, top: 332, rot: -5 },
  { kind: "coin", left: 300, top: 470, rot: 10 },
  { kind: "grass", left: 520, top: 500, rot: -9 },
  { kind: "box", left: 168, top: 612, rot: 7 },
  { kind: "gem", left: 648, top: 560, rot: -6 },
];

const SHEET_TILES: TileKind[] = [
  "floor",
  "brick",
  "spike",
  "coin",
  "grass",
  "box",
  "gem",
  "floor",
  "brick",
];

export const Ch4Page6S15Contrast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 進場淡入 × 結尾淡出，淡到 0 後露出 NEUTRAL_50 白底
  const sceneOpacity =
    interpolate(frame, S15_IN, [0, 1], ease) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const crossLabel = interpolate(frame, [122, 154], [0, 1], ease);
  const sheetSpring = spring({
    frame: frame - 164,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const checkLabel = interpolate(frame, [282, 312], [0, 1], ease);
  const leftDim = interpolate(frame, [312, 350], [1, 0.45], clamp);
  const rightScale = interpolate(frame, [312, 350], [1, 1.02], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: sceneOpacity }}>
        {/* 中央虛線分隔 */}
        <div
          style={{
            position: "absolute",
            left: 959,
            top: 144,
            width: 0,
            height: 800,
            borderLeft: `2px dashed ${DIVIDER}`,
          }}
        />

        {/* 左半：散亂 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 960,
            height: 1080,
            opacity: leftDim,
          }}
        >
          {SCATTER.map((t, i) => {
            const appear = spring({
              frame: frame - (42 + i * 11),
              fps,
              config: { damping: 13, stiffness: 130 },
            });
            return (
              <div
                key={i}
                style={{ position: "absolute", left: t.left, top: t.top }}
              >
                <SpriteTile
                  kind={t.kind}
                  size={120}
                  appear={appear}
                  rotate={t.rot}
                />
              </div>
            );
          })}
          <ContrastLabel kind="cross" show={crossLabel} />
        </div>

        {/* 右半：集中 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 1180,
              top: 224,
              width: 520,
              height: 520,
              borderRadius: 20,
              backgroundColor: PANEL_BG,
              border: `3px solid ${CARD_BORDER}`,
              opacity: sheetSpring,
              transformOrigin: "center",
              transform: `translateY(${interpolate(
                sheetSpring,
                [0, 1],
                [60, 0],
                clamp,
              )}px) scale(${rightScale})`,
              boxShadow: `0 ${interpolate(
                rightScale,
                [1, 1.02],
                [12, 26],
                clamp,
              )}px ${interpolate(
                rightScale,
                [1, 1.02],
                [28, 50],
                clamp,
              )}px ${withAlpha(TEXT_DARK, 0.12)}`,
            }}
          >
            {SHEET_TILES.map((kind, j) => {
              const col = j % 3;
              const row = Math.floor(j / 3);
              const cell = 144;
              const gap = 12;
              const appear = interpolate(
                frame,
                [200 + j * 7, 222 + j * 7],
                [0, 1],
                ease,
              );
              return (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    left: 32 + col * (cell + gap),
                    top: 32 + row * (cell + gap),
                  }}
                >
                  <SpriteTile kind={kind} size={cell} appear={appear} />
                </div>
              );
            })}
          </div>
          <ContrastLabel kind="check" show={checkLabel} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
