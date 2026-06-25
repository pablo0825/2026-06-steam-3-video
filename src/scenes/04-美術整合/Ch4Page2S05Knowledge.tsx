import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  HEADER_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
  NEUTRAL_50,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo as ease } from "../../theme/motion";

// 第 4 集・第 2 頁・S05：相關知識導覽（330 幀，結尾淡出到 WHITE）
//   三個相關知識標籤，聚焦「遊戲畫面大小」。
const TAGS = ["遊戲畫面大小", "素材大小的基礎單位", "Sprite Sheet"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [210, 250] as const;
const HINT = [240, 270] as const; // 底部提示句，比高亮稍晚
const ENDING_FADE = [306, 330] as const;

type KnowledgeTagProps = {
  label: string;
  index: number;
  frame: number;
  fps: number;
  highlight: number;
};

const KnowledgeTag: React.FC<KnowledgeTagProps> = ({
  label,
  index,
  frame,
  fps,
  highlight,
}) => {
  const entrance = spring({
    frame: frame - (TAG_FIRST + index * TAG_STEP),
    fps,
    config: { damping: 15, stiffness: 130 },
  });
  const isPrimary = index === 0;
  const hi = isPrimary ? highlight : 0;

  return (
    <div
      style={{
        width: index === 1 ? 520 : 390,
        height: 106,
        borderRadius: 999,
        background: interpolateColors(hi, [0, 1], [HEADER_BG, BLUE]),
        color: interpolateColors(hi, [0, 1], [TEXT_DARK, WHITE]),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [42, 0])}px) scale(${1 + hi * 0.06})`,
        boxShadow:
          hi > 0 ? `0 14px 34px ${withAlpha(BLUE, 0.22 * hi)}` : "none",
        fontSize: index === 1 ? 42 : 46,
        fontWeight: 850,
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

export const Ch4Page2S05Knowledge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const promptOpacity = interpolate(frame, [36, 62], [0, 1], clamp);
  const highlight = interpolate(frame, HIGHLIGHT, [0, 1], ease);
  const hint = interpolate(frame, HINT, [0, 1], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: out,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginBottom: 56,
            opacity: promptOpacity,
            fontSize: 46,
            fontWeight: 650,
            letterSpacing: 3,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          先認識幾個重要觀念
        </div>
        <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
          {TAGS.map((tag, index) => (
            <KnowledgeTag
              key={tag}
              label={tag}
              index={index}
              frame={frame}
              fps={fps}
              highlight={highlight}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 42,
            opacity: hint,
            fontSize: 34,
            fontWeight: 750,
            letterSpacing: 1,
            color: BLUE,
            whiteSpace: "nowrap",
          }}
        >
          先從「遊戲畫面大小」開始 →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
