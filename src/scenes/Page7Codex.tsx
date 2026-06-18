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
  BLACK,
  BLUE,
  BORDER_SOFT,
  DOT_RED,
  GREEN,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  withAlpha,
  YELLOW,
} from "../theme/colors";

// 第 7 頁：Codex 介紹
//   S17：Codex 卡片 ＋「AI Agent」標籤貼上 ＋ by OpenAI
//   S18：連線到「你的電腦」視窗，檔案逐行被寫入（操作本地資料）

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const MONO = 'Consolas, "Courier New", monospace';
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Codex 卡片
const CODEX = { x: 470, y: 500, w: 320, h: 170 };
// 視窗
const WIN = { x: 1330, y: 520, w: 600, h: 380 };

const LINK_START = 140;
const WIN_START = 165;
const LINES = ["# hello.md", "Hello, Codex!", "> 由 AI 直接寫入"];
const LINE_START = 200;
const DONE_START = 285;

export const Page7Codex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codexIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const openaiOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagIn = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 140 } });

  // 連線
  const linkP = interpolate(frame, [LINK_START, LINK_START + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const x1 = CODEX.x + CODEX.w / 2 + 10;
  const xEnd = WIN.x - WIN.w / 2 - 10;
  const tip = interpolate(linkP, [0, 1], [x1, xEnd]);

  const winIn = spring({ frame: frame - WIN_START, fps, config: { damping: 14, stiffness: 120 } });
  const doneIn = spring({ frame: frame - DONE_START, fps, config: { damping: 9, stiffness: 140 } });
  const captionOp = interpolate(frame, [205, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 連線 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {linkP > 0 && (
          <g>
            <line
              x1={x1}
              y1={CODEX.y}
              x2={Math.max(x1, tip - 16)}
              y2={CODEX.y}
              stroke={BLUE}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="18 14"
            />
            <polygon
              points={`${tip - 20},${CODEX.y - 13} ${tip},${CODEX.y} ${tip - 20},${CODEX.y + 13}`}
              fill={BLUE}
            />
          </g>
        )}
      </svg>

      {/* Codex 卡片 */}
      <div
        style={{
          position: "absolute",
          left: CODEX.x,
          top: CODEX.y,
          width: CODEX.w,
          height: CODEX.h,
          marginLeft: -CODEX.w / 2,
          marginTop: -CODEX.h / 2,
          transform: `scale(${codexIn})`,
          opacity: codexIn,
          borderRadius: 28,
          background: BLUE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: WHITE,
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: 1,
          boxShadow: `0 20px 50px ${withAlpha(BLUE, 0.32)}`,
        }}
      >
        Codex
      </div>

      {/* AI Agent 標籤 */}
      <div
        style={{
          position: "absolute",
          left: CODEX.x,
          top: CODEX.y - CODEX.h / 2 - 60,
          transform: `translate(-50%, ${interpolate(tagIn, [0, 1], [30, 0])}px) rotate(-4deg) scale(${tagIn})`,
          opacity: tagIn <= 0 ? 0 : 1,
          background: YELLOW,
          color: WHITE,
          fontSize: 30,
          fontWeight: 800,
          padding: "10px 24px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          boxShadow: `0 8px 20px ${withAlpha(YELLOW, 0.35)}`,
        }}
      >
        AI Agent
      </div>

      {/* by OpenAI */}
      <div
        style={{
          position: "absolute",
          left: CODEX.x,
          top: CODEX.y + CODEX.h / 2 + 40,
          transform: "translateX(-50%)",
          opacity: openaiOp,
          fontSize: 32,
          fontWeight: 600,
          color: SUBTLE,
          whiteSpace: "nowrap",
        }}
      >
        by OpenAI
      </div>

      {/* 你的電腦視窗 */}
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          marginLeft: -WIN.w / 2,
          marginTop: -WIN.h / 2,
          transform: `scale(${winIn})`,
          opacity: winIn <= 0 ? 0 : 1,
          borderRadius: 18,
          background: WHITE,
          border: `1px solid ${BORDER_SOFT}`,
          boxShadow: `0 24px 60px ${withAlpha(BLACK, 0.14)}`,
          overflow: "hidden",
        }}
      >
        {/* 視窗標題列 */}
        <div
          style={{
            height: 56,
            background: WINDOW_BAR,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 12,
            borderBottom: `1px solid ${BORDER_SOFT}`,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: DOT_RED }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: YELLOW }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: GREEN }} />
          <div style={{ marginLeft: 16, fontSize: 26, color: SUBTLE, fontWeight: 600 }}>你的電腦</div>
        </div>

        {/* 檔案內容 */}
        <div style={{ padding: "30px 34px", fontFamily: MONO, fontSize: 32, color: TEXT_DARK, lineHeight: 1.7 }}>
          {LINES.map((ln, i) => {
            const op = interpolate(frame, [LINE_START + i * 28, LINE_START + i * 28 + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{ opacity: op }}>
                {ln}
                {i === LINES.length - 1 && op > 0.5 && doneIn <= 0 ? <span> ▋</span> : null}
              </div>
            );
          })}
        </div>

        {/* ✓ 已修改 */}
        {doneIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              transform: `rotate(-8deg) scale(${doneIn})`,
              background: GREEN,
              color: WHITE,
              fontSize: 26,
              fontWeight: 800,
              padding: "8px 18px",
              borderRadius: 10,
              whiteSpace: "nowrap",
              boxShadow: `0 8px 18px ${withAlpha(GREEN, 0.35)}`,
            }}
          >
            ✓ 已修改
          </div>
        )}
      </div>

      {/* 標語 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 850,
          transform: "translateX(-50%)",
          opacity: captionOp,
          fontSize: 48,
          fontWeight: 500,
          color: SUBTLE,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
        }}
      >
        可以直接
        <span style={{ color: BLUE, fontWeight: 800, margin: "0 6px" }}>操作</span>
        你電腦裡的
        <span style={{ color: YELLOW, fontWeight: 800, margin: "0 6px" }}>資料</span>
      </div>
    </AbsoluteFill>
  );
};
