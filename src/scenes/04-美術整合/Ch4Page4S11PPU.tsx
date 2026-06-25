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
  SUBTLE,
  TEXT_DARK,
  YELLOW,
  withAlpha,
  NEUTRAL_50,
} from "../../theme/colors";
import { clamp, easeOutExpo as ease } from "../../theme/motion";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

// 第 4 集・第 4 頁・S11：PPU 定義（390 幀）
//   原合併檔的 240–630 區間已全部 −240 重新基準化為 0 起算。進場淡入 × 結尾淡出到 WHITE。
const S11_IN = [0, 28] as const; // 進場淡入
const ENDING_FADE = [294, 322] as const; // 底線畫完(234)後停留約 2 秒再淡出

export const Ch4Page4S11PPU: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity =
    interpolate(frame, S11_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const ppuEnter = spring({
    frame: frame - 36,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const ppuText = spring({
    frame: frame - 80,
    fps,
    config: { damping: 15, stiffness: 115 },
  });
  const ppuRule = spring({
    frame: frame - 140,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const ppuUnderline = interpolate(frame, [202, 234], [0, 1], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: sceneOpacity,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 38,
            minHeight: 470,
            transform: "translateY(-6px)",
          }}
        >
          <div
            style={{
              color: BLUE,
              fontSize: 134,
              fontWeight: 950,
              lineHeight: 1,
              opacity: ppuEnter,
              transform: `scale(${interpolate(ppuEnter, [0, 1], [0.82, 1])})`,
            }}
          >
            PPU
          </div>
          <div
            style={{
              color: SUBTLE,
              fontSize: 44,
              fontWeight: 750,
              letterSpacing: 1,
              opacity: ppuText,
              transform: `translateY(${interpolate(ppuText, [0, 1], [26, 0])}px)`,
            }}
          >
            (Pixels Per Unit)
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 44,
              color: TEXT_DARK,
              fontSize: 62,
              fontWeight: 900,
              letterSpacing: 1,
              opacity: ppuRule,
              transform: `translateY(${interpolate(ppuRule, [0, 1], [34, 0])}px)`,
            }}
          >
            決定多少 px = 1 unit
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -16,
                height: 12,
                borderRadius: 999,
                background: withAlpha(YELLOW, 0.72),
                transformOrigin: "left center",
                transform: `scaleX(${ppuUnderline})`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
