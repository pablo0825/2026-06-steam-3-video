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
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard as ease } from "../../theme/motion";

// 第 4 集・第 8 頁・S18：美術整合實作流程（270 幀）
//   四節點水平流程圖 + 黃色回饋迴圈（末節點 → 美術規格表），結尾淡出到 NEUTRAL_50。

const ENDING_FADE = [242, 270] as const; // 結尾淡出到 NEUTRAL_50

const NODE_W = 300;
const NODE_H = 120;
const NODE_CY = 470;
const NODE_CX = [300, 740, 1180, 1620] as const; // 四節點中心 x（間距 440）
const NODES: readonly [string, string][] = [
  ["依 Storyboard", "列出物件"],
  ["撰寫", "美術規格表"],
  ["用 AI", "生假素材"],
  ["匯入 Unity", "測試"],
];

// 節點由左至右依序彈入：第 i 個於 nodeStart(i) 開始
const NODE_STRIDE = 30;
const nodeStart = (i: number) => 10 + i * NODE_STRIDE;

// 箭頭長度：連線只畫到箭頭底部，由三角形當尖端，避免線戳出箭頭
const ARROW_LEN = 30;

export const Ch4Page8S18ArtWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  // 節點間三段連線（i = 0..2）：節點出現後才畫，畫到端點時帶出下一節點
  const segDraw = (i: number) =>
    interpolate(frame, [nodeStart(i) + 18, nodeStart(i) + 40], [0, 1], ease);
  const segArrow = (i: number) =>
    interpolate(frame, [nodeStart(i) + 30, nodeStart(i) + 42], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT, opacity: out }}
    >
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 60,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 2,
        }}
      >
        美術整合實作流程
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[0, 1, 2].map((i) => {
          const x1 = NODE_CX[i] + NODE_W / 2;
          const x2 = NODE_CX[i + 1] - NODE_W / 2;
          return (
            <g key={`seg-${i}`}>
              <path
                d={`M${x1} ${NODE_CY} L${x2 - ARROW_LEN} ${NODE_CY}`}
                fill="none"
                stroke={BLUE}
                strokeWidth="6"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - segDraw(i)}
              />
              <g opacity={segArrow(i)} transform={`translate(${x2} ${NODE_CY})`}>
                <path d="M0 0 L-30 -16 L-30 16 Z" fill={BLUE} />
              </g>
            </g>
          );
        })}
      </svg>

      {NODES.map(([line1, line2], i) => {
        const p = spring({
          frame: frame - nodeStart(i),
          fps,
          config: { damping: 17, stiffness: 115, overshootClamping: true },
        });
        return (
          <div
            key={line2}
            style={{
              position: "absolute",
              left: NODE_CX[i],
              top: NODE_CY,
              width: NODE_W,
              height: NODE_H,
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
              opacity: p,
              borderRadius: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 14px",
              fontSize: 30,
              fontWeight: 900,
              lineHeight: 1.25,
              color: TEXT_DARK,
              backgroundColor: WHITE,
              border: `3px solid ${CARD_BORDER}`,
              boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.08)}`,
            }}
          >
            <span>{line1}</span>
            <span>{line2}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
