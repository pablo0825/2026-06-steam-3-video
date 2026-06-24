import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NEUTRAL_50, TEXT_DARK, YELLOW, withAlpha } from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) };

// 第 4 集・第 6 頁：認識 Sprite Sheet
//   S14（0–228）：極簡定義卡
//   S15（228–600）：散亂 vs. 集中 左右對比

const S14_OUT = [200, 228] as const;

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

      {/* S15 layer added in Task 2 */}
    </AbsoluteFill>
  );
};
