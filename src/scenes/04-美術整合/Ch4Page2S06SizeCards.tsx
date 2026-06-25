import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CARD_BORDER, TEXT_DARK, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 4 集・第 2 頁・S06：橫式 / 直式尺寸卡（210 幀）
//   原合併檔的 330–540 區間已全部 −330 重新基準化為 0 起算。進場淡入 × 結尾淡出到 WHITE。
const S06_IN = [0, 24] as const;
const ENDING_FADE = [186, 210] as const;
const CARD_FIRST = 44;
const CARD_STEP = 26;

type SizeCardProps = {
  title: string;
  subtitle: string;
  index: number;
  frame: number;
  fps: number;
};

const SizeCard: React.FC<SizeCardProps> = ({
  title,
  subtitle,
  index,
  frame,
  fps,
}) => {
  const entrance = spring({
    frame: frame - (CARD_FIRST + index * CARD_STEP),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const fromX = index === 0 ? -70 : 70;

  return (
    <div
      style={{
        width: 560,
        height: 300,
        borderRadius: 28,
        border: `3px solid ${CARD_BORDER}`,
        background: WHITE,
        boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        opacity: entrance,
        transform: `translateX(${interpolate(entrance, [0, 1], [fromX, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: 1,
          color: TEXT_DARK,
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 999,
          background: withAlpha(BLUE, 0.1),
          color: BLUE,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export const Ch4Page2S06SizeCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity =
    interpolate(frame, S06_IN, [0, 1], clamp) *
    interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const title = spring({
    frame: frame - 16,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: sceneOpacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginBottom: 70,
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [32, 0])}px)`,
            fontSize: 66,
            fontWeight: 900,
            letterSpacing: 4,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          遊戲畫面大小
        </div>
        <div style={{ display: "flex", gap: 76 }}>
          <SizeCard
            title="1920×1080"
            subtitle="16:9 橫式"
            index={0}
            frame={frame}
            fps={fps}
          />
          <SizeCard
            title="1080×1920"
            subtitle="9:16 直式"
            index={1}
            frame={frame}
            fps={fps}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
