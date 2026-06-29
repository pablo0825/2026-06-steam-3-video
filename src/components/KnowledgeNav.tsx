import React from "react";
import { interpolate, interpolateColors, spring } from "remotion";
import { SUBTLE, TEXT_DARK, YELLOW } from "../theme/colors";
import { clamp, easeOutExpo as ease } from "../theme/motion";

// 知識導覽版型：提示句 → 一橫排「編號在上、文字在下」依序彈入 → 指定項保留原色＋黃色底線高亮、其餘變灰。
//   項目以固定寬容器（左右內推 240）+ grid 等分欄排列，欄位中心等距、不受字長影響。
//   只負責內容呈現；背景、整段淡入淡出與置中交給呼叫端的容器。
type KnowledgeNavProps = {
  prompt: string;
  tags: readonly string[];
  frame: number;
  fps: number;
  tagFirst: number; // 第一個項目彈入幀
  tagStep: number; // 項目間隔
  highlight: readonly [number, number]; // 高亮（與其餘變灰）區間
  highlightIndex?: number; // 高亮哪一個，預設 0
};

export const KnowledgeNav: React.FC<KnowledgeNavProps> = ({
  prompt,
  tags,
  frame,
  fps,
  tagFirst,
  tagStep,
  highlight,
  highlightIndex = 0,
}) => {
  const hilite = interpolate(frame, highlight, [0, 1], ease);

  const items = tags.map((tag, i) => {
    const inSpring = spring({
      frame: frame - (tagFirst + i * tagStep),
      fps,
      config: { damping: 15, stiffness: 130 },
    });
    const isPrimary = i === highlightIndex;
    const hi = isPrimary ? hilite : 0; // 選中項：黃色底線展開
    const dim = isPrimary ? 0 : hilite; // 其餘項：轉灰
    const color = interpolateColors(dim, [0, 1], [TEXT_DARK, SUBTLE]);
    const num = String(i + 1).padStart(2, "0");
    return (
      <div
        key={tag}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: inSpring * interpolate(dim, [0, 1], [1, 0.55], clamp),
          transform: `translateY(${interpolate(inSpring, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: 2,
            lineHeight: 1,
            color,
          }}
        >
          {num}
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: 3,
              color,
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -18,
              height: 10,
              borderRadius: 999,
              background: YELLOW,
              opacity: hi,
              transform: `scaleX(${hi})`,
            }}
          />
        </div>
      </div>
    );
  });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          marginBottom: 72,
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: 4,
          color: SUBTLE,
          whiteSpace: "nowrap",
        }}
      >
        {prompt}
      </div>

      {/* 滿版固定寬 + 左右各內推 240（可用區 1440），grid 等分欄：
          欄位中心等距、不受字長影響，3／4 欄都自動均分。 */}
      <div
        style={{
          width: 1920,
          padding: "0 240px",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: `repeat(${tags.length}, 1fr)`,
          alignItems: "start",
        }}
      >
        {items}
      </div>
    </div>
  );
};
