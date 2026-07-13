import React from "react";
import { interpolate } from "remotion";
import {
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { clamp } from "../../theme/motion";

export type CoreLoopIconName = "action" | "achievement" | "feedback" | "growth";

export type CoreLoopNodeData = {
  label: string;
  example: string;
  icon: CoreLoopIconName;
};

// 迴圈四條邊（順時針）：值僅供各場景以 index 建立 arrowProgress 陣列。
export const CORE_LOOP_ARROW_PATHS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
] as const;

const POSITIONS = [
  { x: 960, y: 350 },
  { x: 1320, y: 610 },
  { x: 960, y: 850 },
  { x: 600, y: 610 },
] as const;

// 迴圈中心（四節點形心），用來決定弧線往外凸的方向。
const LOOP_CENTER = { x: 960, y: 605 };
const NODE_TIP_R = 114; // 箭頭尖端落在圓邊外緣的半徑
const ARROW_LEN = 24; // 箭頭三角形長度
const ARROW_HW = 13; // 箭頭三角形半寬

const unit = (x: number, y: number) => {
  const m = Math.hypot(x, y) || 1;
  return { x: x / m, y: y / m };
};

// 兩個 #rrggbb 色之間依 t（0..1）線性漸變，供高亮平滑過渡用。
const lerpColor = (a: string, b: string, t: number) => {
  const parse = (h: string) =>
    [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const ca = parse(a);
  const cb = parse(b);
  const m = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
};

// 節點處的迴圈切線方向（順時針），線沿此方向離開／進入 → 平滑繞行不外凸。
const travelDir = (p: { x: number; y: number }) => {
  const o = unit(p.x - LOOP_CENTER.x, p.y - LOOP_CENTER.y);
  return { x: -o.y, y: o.x };
};

// 依來源／目標節點座標計算一條沿迴圈切線平滑連接的弧線：
//   自 S 沿切線離開、於 T 沿切線切入；線收在箭頭底部，箭頭順流向切進節點。
const computeArrow = (s: number, t: number) => {
  const S = POSITIONS[s];
  const T = POSITIONS[t];
  const dirExit = travelDir(S);
  const dirEnter = travelDir(T);

  const p0 = {
    x: S.x + NODE_TIP_R * dirExit.x,
    y: S.y + NODE_TIP_R * dirExit.y,
  };
  const tip = {
    x: T.x - NODE_TIP_R * dirEnter.x,
    y: T.y - NODE_TIP_R * dirEnter.y,
  };
  const angle = (Math.atan2(dirEnter.y, dirEnter.x) * 180) / Math.PI;
  const base = {
    x: tip.x - ARROW_LEN * dirEnter.x,
    y: tip.y - ARROW_LEN * dirEnter.y,
  };

  const k = 0.5 * Math.hypot(base.x - p0.x, base.y - p0.y);
  const c1 = { x: p0.x + k * dirExit.x, y: p0.y + k * dirExit.y };
  const c2 = { x: base.x - k * dirEnter.x, y: base.y - k * dirEnter.y };
  const path = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${base.x.toFixed(1)} ${base.y.toFixed(1)}`;
  return { path, tip, angle };
};

const ARROWS = CORE_LOOP_ARROW_PATHS.map(([s, t]) => computeArrow(s, t));

// 標題槽內兩段文字共用：滿版置中疊放，換字時只有透明度與位移在動。
const SLOT_TEXT: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1.2,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const LoopIcon: React.FC<{ name: CoreLoopIconName; color: string }> = ({
  name,
  color,
}) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      {name === "action" && (
        <>
          <path
            {...common}
            d="M15 20h26c6 0 10 5 9 11l-2 9c-1 5-7 7-11 3l-4-4H23l-4 4c-4 4-10 2-11-3l-2-9c-1-6 3-11 9-11Z"
          />
          <path {...common} d="M17 27v10M12 32h10M38 29h.1M43 35h.1" />
        </>
      )}
      {name === "achievement" && (
        <>
          <path {...common} d="M15 47V10" />
          <path {...common} d="M16 12h25l-5 9 5 9H16Z" />
          <path {...common} d="M10 47h12" />
        </>
      )}
      {name === "feedback" && (
        <>
          <circle {...common} cx="28" cy="28" r="19" />
          <path
            {...common}
            d="M33 20c-2-2-9-2-10 2-2 6 12 4 10 11-1 5-9 5-12 2M28 15v26"
          />
        </>
      )}
      {name === "growth" && (
        <>
          <path {...common} d="M11 43 25 29l8 8 13-18" />
          <path {...common} d="M36 19h10v10" />
          <path {...common} d="M11 48h36" />
        </>
      )}
    </svg>
  );
};

export const CoreLoopDiagram: React.FC<{
  nodes: CoreLoopNodeData[];
  nodeProgress: number[];
  // 換字進度 0..1：0 顯示 label（如「動作」），1 已換成 example（如「打怪・解謎」）。
  // 舊標題往上淡出、新標題自下淡入，兩者在中段交棒。
  swapProgress: number[];
  arrowProgress: number[];
  activeIndex?: number;
  highlight?: number[]; // 每個 index 的高亮強度 0..1（優先於 activeIndex）
  markerPrefix: string;
  exampleFontSize?: number;
}> = ({
  nodes,
  nodeProgress,
  swapProgress,
  arrowProgress,
  activeIndex = -1,
  highlight,
  exampleFontSize = 25,
}) => {
  // 每個 index 的高亮強度：優先用 highlight 陣列，否則退回 activeIndex（0/1）。
  const hlAt = (i: number) =>
    Math.max(0, Math.min(1, highlight?.[i] ?? (activeIndex === i ? 1 : 0)));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {ARROWS.map((arrow, index) => {
          const h = hlAt(index);
          const color = lerpColor(CARD_BORDER, YELLOW, h);
          const progress = arrowProgress[index];
          const headOpacity = interpolate(progress, [0.82, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={index}>
              <path
                d={arrow.path}
                pathLength={1}
                fill="none"
                stroke={color}
                strokeWidth={6 + 2 * h}
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={1 - progress}
                opacity={progress}
              />
              <path
                d={`M0 0 L ${-ARROW_LEN} ${-ARROW_HW} L ${-ARROW_LEN} ${ARROW_HW} Z`}
                fill={color}
                opacity={headOpacity}
                transform={`translate(${arrow.tip.x} ${arrow.tip.y}) rotate(${arrow.angle})`}
              />
            </g>
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const h = hlAt(index);
        const progress = nodeProgress[index];
        const position = POSITIONS[index];
        const scale = interpolate(progress, [0, 1], [0.82, 1 + 0.04 * h]);
        const accent = lerpColor(SUBTLE, YELLOW, h);

        // 換上去的新標題：高亮時黃色，退高亮後回到原標題的深色（非 icon 的淡灰）
        const swapColor = lerpColor(TEXT_DARK, YELLOW, h);

        // 換字：舊標題先往上退場，新標題自下接上（0.42 起交棒，中間不留空窗）
        const swap = Math.max(0, Math.min(1, swapProgress[index] ?? 0));
        const labelOut = interpolate(swap, [0, 0.45], [1, 0], clamp);
        const exampleIn = interpolate(swap, [0.42, 1], [0, 1], clamp);

        return (
          <div
            key={node.label}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: 220,
              height: 220,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: progress,
              borderRadius: "50%",
              backgroundColor: WHITE,
              border: `4px solid ${lerpColor(CARD_BORDER, YELLOW, h)}`,
              boxShadow: `0 ${12 + 6 * h}px ${30 + 14 * h}px ${withAlpha(
                lerpColor(TEXT_DARK, YELLOW, h),
                0.08 + 0.12 * h,
              )}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 2,
            }}
          >
            <LoopIcon name={node.icon} color={accent} />
            {/* 標題槽：固定高度，label 與 example 疊在同一位置交棒，圓圈內不位移 */}
            <div style={{ position: "relative", width: "100%", height: 46 }}>
              <div
                style={{
                  ...SLOT_TEXT,
                  fontSize: 42,
                  letterSpacing: 4,
                  color: TEXT_DARK,
                  opacity: labelOut,
                  transform: `translateY(${interpolate(labelOut, [0, 1], [-16, 0])}px)`,
                }}
              >
                {node.label}
              </div>
              <div
                style={{
                  ...SLOT_TEXT,
                  fontSize: exampleFontSize,
                  letterSpacing: 1,
                  color: swapColor,
                  opacity: exampleIn,
                  transform: `translateY(${interpolate(exampleIn, [0, 1], [16, 0])}px)`,
                }}
              >
                {node.example}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
