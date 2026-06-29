import React from "react";
import {
  AbsoluteFill,
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
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  withAlpha,
  YELLOW,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 7 頁・S18：Codex 可以操作你電腦裡的資料（210 幀）
const CONTENT_OUT = [188, 210] as const;
const MONO = 'Consolas, "Courier New", monospace';
const CODEX = { x: 470, y: 500, w: 320, h: 170 };
const WIN = { x: 1330, y: 520, w: 600, h: 380 };
const LINK_START = 0;
const WIN_START = 15;
const LINE_START = 50;
const DONE_START = 135;
const LINES = ["# hello.md", "Hello, Codex!", "> 由 AI 直接寫入"];

export const Ch1Page7S18ComputerAccess: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const linkProgress = interpolate(frame, [LINK_START, LINK_START + 28], [0, 1], easeOutExpo);
  const winIn = spring({ frame: frame - WIN_START, fps, config: { damping: 14, stiffness: 120 } });
  const doneIn = spring({ frame: frame - DONE_START, fps, config: { damping: 9, stiffness: 140 } });
  const captionOpacity = interpolate(frame, [55, 80], [0, 1], clamp);

  const x1 = CODEX.x + CODEX.w / 2 + 10;
  const xEnd = WIN.x - WIN.w / 2 - 10;
  const tip = interpolate(linkProgress, [0, 1], [x1, xEnd]);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {linkProgress > 0 && (
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

        <div
          style={{
            position: "absolute",
            left: CODEX.x,
            top: CODEX.y,
            width: CODEX.w,
            height: CODEX.h,
            marginLeft: -CODEX.w / 2,
            marginTop: -CODEX.h / 2,
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

        <div
          style={{
            position: "absolute",
            left: CODEX.x,
            top: CODEX.y - CODEX.h / 2 - 60,
            transform: "translateX(-50%) rotate(-4deg)",
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

        <div
          style={{
            position: "absolute",
            left: CODEX.x,
            top: CODEX.y + CODEX.h / 2 + 40,
            transform: "translateX(-50%)",
            fontSize: 32,
            fontWeight: 600,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          by OpenAI
        </div>

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

          <div style={{ padding: "30px 34px", fontFamily: MONO, fontSize: 32, color: TEXT_DARK, lineHeight: 1.7 }}>
            {LINES.map((line, index) => {
              const opacity = interpolate(frame, [LINE_START + index * 28, LINE_START + index * 28 + 12], [0, 1], clamp);

              return (
                <div key={line} style={{ opacity }}>
                  {line}
                  {index === LINES.length - 1 && opacity > 0.5 && doneIn <= 0 ? <span> ▋</span> : null}
                </div>
              );
            })}
          </div>

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

        <div
          style={{
            position: "absolute",
            left: 960,
            top: 850,
            transform: "translateX(-50%)",
            opacity: captionOpacity,
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
    </AbsoluteFill>
  );
};
