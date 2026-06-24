import React from "react";
import {
  AbsoluteFill,
  Easing,
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
  SUBTLE,
  TEXT_DARK,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) };

// 第 4 集・第 6 頁：認識 Sprite Sheet
//   S14（0–228）：極簡定義卡
//   S15（228–600）：散亂 vs. 集中 左右對比

const S14_OUT = [200, 228] as const;
const S15_IN = [228, 262] as const;

// S14 定義句的淡黃襯底高亮詞
const HighlightWord: React.FC<{ children: React.ReactNode; show: number }> = ({
  children,
  show,
}) => (
  <span
    style={{
      padding: "2px 10px",
      margin: "0 4px",
      borderRadius: 8,
      backgroundColor: withAlpha(YELLOW, 0.3 * show),
      color: TEXT_DARK,
      fontWeight: 800,
    }}
  >
    {children}
  </span>
);

type TileKind = "floor" | "brick" | "spike" | "coin" | "grass" | "box" | "gem";

const TILE_COLORS: Record<TileKind, string> = {
  floor: CAT_ART,
  brick: RED,
  spike: BLUE,
  coin: YELLOW,
  grass: GREEN,
  box: CAT_PLAN,
  gem: CAT_CODE,
};

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

const ContrastLabel: React.FC<{ kind: "cross" | "check"; show: number }> = ({
  kind,
  show,
}) => {
  const isCross = kind === "cross";
  return (
    <div
      style={{
        position: "absolute",
        top: isCross ? 880 : 808,
        left: isCross ? 180 : 1180,
        width: isCross ? 600 : 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity: show,
        transform: `translateY(${interpolate(show, [0, 1], [18, 0], clamp)}px)`,
      }}
    >
      <span
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: isCross ? RED : GREEN,
        }}
      >
        {isCross ? "✕" : "✓"}
      </span>
      <span
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: isCross ? SUBTLE : TEXT_DARK,
        }}
      >
        {isCross ? (
          "多檔案管理困難"
        ) : (
          <>
            一張圖<span style={{ color: YELLOW }}>集中管理</span>
          </>
        )}
      </span>
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

export const Ch4Page6SpriteSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S14 定義卡 ──
  const s14Opacity = interpolate(frame, S14_OUT, [1, 0], clamp);
  const titleSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const defLine = interpolate(frame, [44, 70], [0, 1], ease);
  const hl1 = interpolate(frame, [90, 112], [0, 1], ease);
  const hl2 = interpolate(frame, [120, 142], [0, 1], ease);

  // ── S15 對比 ──
  const s15Opacity = interpolate(frame, S15_IN, [0, 1], ease);
  const crossLabel = interpolate(frame, [350, 382], [0, 1], ease);
  const sheetSpring = spring({
    frame: frame - 392,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const checkLabel = interpolate(frame, [510, 540], [0, 1], ease);
  const leftDim = interpolate(frame, [540, 578], [1, 0.45], clamp);
  const rightScale = interpolate(frame, [540, 578], [1, 1.02], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* ── S14 定義卡 ── */}
      {frame < 240 && (
        <AbsoluteFill
          style={{
            opacity: s14Opacity,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: TEXT_DARK,
              letterSpacing: 2,
              lineHeight: 1,
              opacity: titleSpring,
              transform: `scale(${interpolate(titleSpring, [0, 1], [0.9, 1])})`,
            }}
          >
            Sprite Sheet
          </div>
          <div
            style={{
              marginTop: 56,
              fontSize: 46,
              fontWeight: 600,
              color: TEXT_DARK,
              letterSpacing: 1,
              opacity: defLine,
              transform: `translateY(${interpolate(defLine, [0, 1], [28, 0])}px)`,
            }}
          >
            Sprite Sheet 是把
            <HighlightWord show={hl1}>多張 Sprite</HighlightWord>
            放在
            <HighlightWord show={hl2}>同一張圖片</HighlightWord>
            中的素材格式
          </div>
        </AbsoluteFill>
      )}

      {/* ── S15 散亂 vs. 集中 ── */}
      {frame >= 228 && (
        <AbsoluteFill style={{ opacity: s15Opacity }}>
          {/* 中央虛線分隔 */}
          <div
            style={{
              position: "absolute",
              left: 959,
              top: 200,
              width: 0,
              height: 640,
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
                frame: frame - (270 + i * 11),
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
                top: 250,
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
                  [428 + j * 7, 450 + j * 7],
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
      )}
    </AbsoluteFill>
  );
};
