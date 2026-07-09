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
  GREEN,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
  YELLOW,
} from "../../theme/colors";
import { WindowFrame } from "../../components/WindowFrame";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 7 頁・S17：Codex 是 AI Agent，且可以操作你電腦裡的資料（360 幀）
//   原本被拆成 S17(Codex 置中介紹)/S18(Codex 靠左＋操作視窗) 兩顆，此處合併回單一連續鏡頭：
//   Codex 置中彈入（AI Agent／by OpenAI）→ 約 f=150 移到左側並略縮 →
//   箭頭連到「你的電腦」視窗、逐行寫入程式碼、✓ 已修改。
const CONTENT_OUT = [338, 359] as const;
const MONO = 'Consolas, "Courier New", monospace';

const CODEX_Y = 500;
const WIN = { x: 1330, y: 520, w: 600, h: 380 };
const LINES = ["# hello.md", "Hello, Codex!", "> 由 AI 直接寫入"];

// Codex 由置中（S17）移到左側並略縮（S18）。
const MOVE = [150, 180] as const;
// 第二拍（操作視窗）的各事件時點。
const LINK_START = 180;
const WIN_START = 195;
const LINE_START = 230;
const DONE_START = 315;

export const Ch1Page7S17Codex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  // Codex 方塊：置中彈入 → 移到左側並略縮。
  const codexIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const codexX = interpolate(frame, MOVE, [960, 470], easeOutExpo);
  const codexW = interpolate(frame, MOVE, [360, 320], easeOutExpo);
  const codexH = interpolate(frame, MOVE, [190, 170], easeOutExpo);
  const codexFont = interpolate(frame, MOVE, [68, 62], easeOutExpo);
  const tagFont = interpolate(frame, MOVE, [34, 30], easeOutExpo);
  const openaiFont = interpolate(frame, MOVE, [36, 32], easeOutExpo);

  const tagIn = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 140 } });
  const openaiOpacity = interpolate(frame, [15, 35], [0, 1], clamp);

  // 第二拍：箭頭 → 視窗 → 逐行寫入 → 完成徽章 → 字幕。
  const linkProgress = interpolate(frame, [LINK_START, LINK_START + 28], [0, 1], easeOutExpo);
  const winIn = spring({ frame: frame - WIN_START, fps, config: { damping: 14, stiffness: 120 } });
  const doneIn = spring({ frame: frame - DONE_START, fps, config: { damping: 9, stiffness: 140 } });
  const captionOpacity = interpolate(frame, [235, 260], [0, 1], clamp);

  const x1 = codexX + codexW / 2 + 10;
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
                y1={CODEX_Y}
                x2={Math.max(x1, tip - 16)}
                y2={CODEX_Y}
                stroke={BLUE}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray="18 14"
              />
              <polygon
                points={`${tip - 20},${CODEX_Y - 13} ${tip},${CODEX_Y} ${tip - 20},${CODEX_Y + 13}`}
                fill={BLUE}
              />
            </g>
          )}
        </svg>

        <div
          style={{
            position: "absolute",
            left: codexX,
            top: CODEX_Y,
            width: codexW,
            height: codexH,
            marginLeft: -codexW / 2,
            marginTop: -codexH / 2,
            transform: `scale(${codexIn})`,
            opacity: codexIn,
            borderRadius: 28,
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WHITE,
            fontSize: codexFont,
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
            left: codexX,
            top: CODEX_Y - codexH / 2 - 60,
            transform: `translate(-50%, ${interpolate(tagIn, [0, 1], [30, 0])}px) rotate(-4deg) scale(${tagIn})`,
            opacity: tagIn <= 0 ? 0 : 1,
            background: YELLOW,
            color: WHITE,
            fontSize: tagFont,
            fontWeight: 800,
            padding: "10px 26px",
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
            left: codexX,
            top: CODEX_Y + codexH / 2 + 42,
            transform: "translateX(-50%)",
            opacity: openaiOpacity,
            fontSize: openaiFont,
            fontWeight: 600,
            color: SUBTLE,
            whiteSpace: "nowrap",
          }}
        >
          by OpenAI
        </div>

        <WindowFrame
          title="你的電腦"
          titleStyle={{ fontSize: 26 }}
          barHeight={56}
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
          }}
        >
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
        </WindowFrame>

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
