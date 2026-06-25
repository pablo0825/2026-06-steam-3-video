import React from "react";
import { interpolate, interpolateColors, spring } from "remotion";
import {
  BLUE,
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../theme/colors";
import { clamp, easeOutExpo as ease } from "../theme/motion";

// 知識導覽版型：提示句 → 一排膠囊標籤依序彈入 → 指定標籤高亮、其餘變灰 → 底部「先從…開始 →」。
//   只負責內容呈現；背景、整段淡入淡出與置中交給呼叫端的容器。
type KnowledgeNavProps = {
  prompt: string;
  tags: readonly string[];
  hintText: string;
  frame: number;
  fps: number;
  tagFirst: number; // 第一個標籤彈入幀
  tagStep: number; // 標籤間隔
  highlight: readonly [number, number]; // 高亮（與其餘變灰）區間
  hint: readonly [number, number]; // 底部提示句淡入區間
  highlightIndex?: number; // 高亮哪一個，預設 0
};

export const KnowledgeNav: React.FC<KnowledgeNavProps> = ({
  prompt,
  tags,
  hintText,
  frame,
  fps,
  tagFirst,
  tagStep,
  highlight,
  hint,
  highlightIndex = 0,
}) => {
  const hilite = interpolate(frame, highlight, [0, 1], ease);
  const hintOpacity = interpolate(frame, hint, [0, 1], clamp);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          marginBottom: 56,
          fontSize: 46,
          fontWeight: 600,
          letterSpacing: 4,
          color: SUBTLE,
          whiteSpace: "nowrap",
        }}
      >
        {prompt}
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {tags.map((tag, i) => {
          const inSpring = spring({
            frame: frame - (tagFirst + i * tagStep),
            fps,
            config: { damping: 15, stiffness: 130 },
          });
          const isPrimary = i === highlightIndex;
          const hi = isPrimary ? hilite : 0;
          const dim = isPrimary ? 0 : hilite;
          return (
            <div
              key={tag}
              style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: 3,
                color: interpolateColors(hi, [0, 1], [TEXT_DARK, WHITE]),
                background: interpolateColors(hi, [0, 1], [CHIP_BG, BLUE]),
                padding: "26px 48px",
                borderRadius: 999,
                opacity: inSpring * interpolate(dim, [0, 1], [1, 0.35], clamp),
                transform: `translateY(${interpolate(inSpring, [0, 1], [40, 0])}px) scale(${1 + hi * 0.06})`,
                boxShadow:
                  hi > 0 ? `0 14px 32px ${withAlpha(BLUE, 0.22 * hi)}` : "none",
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 48,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 2,
          color: BLUE,
          opacity: hintOpacity,
        }}
      >
        {hintText}
      </div>
    </div>
  );
};
