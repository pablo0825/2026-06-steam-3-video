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
  GREEN,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  withAlpha,
} from "../../theme/colors";
import { FONT, MONO, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 7 頁・S17：Codex 是 AI Agent，且可以操作你電腦裡的資料（385 幀）
//   原本被拆成 S17(Codex 置中介紹)/S18(Codex 靠左＋操作視窗) 兩顆，此處合併回單一連續鏡頭：
//   開場先留 30 幀白底 → 內容一律以 f = frame - HOLD 計時（與 S08 同慣例）。
//   🤖 Codex 置中彈入（AI Agent／by OpenAI）→ 移到左側並略縮 → 右側「檔案視窗」帶既有內容先出現，
//   連線再跑過去 → 視窗亮起藍色外暈（表示被 Codex 操作）→ 逐行寫入新增行（綠底）。
//   結尾淡出改用 durationInFrames 反推、並留 TAIL_HOLD 幀全空白（與 S15 同慣例），確保完全淡淨。
const HOLD = 30; // 開場留白：內容延後這麼多幀才開始
const FADE_OUT = 24; // 結尾淡出花幾幀
const TAIL_HOLD = 15; // 淡出後再留幾幀全空白，確保最後幾幀完全淡出

const CODEX_Y = 540; // 垂直置中：無底部字幕後，整體上下留白對稱
const WIN = { x: 1330, y: 540, w: 620, h: 440 };

// 檔案內文：既有行（中性色）＋新增行（綠底，由 Codex 逐行寫入）。
const FILE_LINES = [
  { text: "# Hello", added: false },
  { text: "這是我的筆記", added: false },
  { text: "由 Codex 自動寫入", added: true },
  { text: "不用手動打字", added: true },
  { text: "直接改好檔案", added: true },
] as const;

// Codex 由置中移到左側並略縮（置中停留 60 幀 ≈ 2 秒後才移動）。
const MOVE = [60, 90] as const;
// 第二拍（操作視窗）的各事件時點（皆為 f 基準）。
// 順序：視窗＋既有內容先出現 → 連線跑過去 → 外暈亮起 → 逐行寫入新增行。
const WIN_START = 100; // 檔案視窗彈入（帶既有內容）
const EXIST_START = 108; // 既有行隨視窗淡入
const LINK_START = 145; // 連線箭頭開始跑（視窗出現後隔 45 幀）
const GLOW_START = 175; // 箭頭抵達後，視窗外暈亮起
const ADD_START = 193; // 新增（綠底）行開始逐行寫入
const ADD_STAGGER = 26; // 每個新增行間隔
const DONE_START = 275; // 寫入完成：游標停止閃爍

// 檔案圖示（沿用 Ch3 SpecShared 的文件外框樣式）。
const FileIcon: React.FC = () => (
  <svg width="30" height="36" viewBox="0 0 34 40" aria-hidden="true">
    <path
      d="M5 2h16l8 8v28H5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M21 2v9h8"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

export const Ch1Page7S17Codex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const f = frame - HOLD; // 內容的時間軸（開場留白後才起算）

  // 結尾淡出：在結尾前 TAIL_HOLD 幀就歸零，留一段全空白尾巴 → 最後幾幀確實淡淨。
  const contentOpacity = interpolate(
    frame,
    [durationInFrames - FADE_OUT - TAIL_HOLD, durationInFrames - TAIL_HOLD],
    [1, 0],
    clamp,
  );

  // Codex 方塊：置中彈入 → 移到左側並略縮。
  const codexIn = spring({ frame: f, fps, config: { damping: 14, stiffness: 120 } });
  const codexX = interpolate(f, MOVE, [960, 470], easeOutExpo);
  const codexW = interpolate(f, MOVE, [300, 260], easeOutExpo);
  const codexH = interpolate(f, MOVE, [250, 230], easeOutExpo);
  const codexFont = interpolate(f, MOVE, [74, 68], easeOutExpo); // Codex 大字
  const codexEmoji = interpolate(f, MOVE, [156, 144], easeOutExpo); // 🤖 頭像（放大）

  // 第二拍：箭頭 → 視窗 → 逐行寫入。
  const linkProgress = interpolate(f, [LINK_START, LINK_START + 28], [0, 1], easeOutExpo);
  const winIn = spring({ frame: f - WIN_START, fps, config: { damping: 14, stiffness: 120 } });
  const doneIn = spring({ frame: f - DONE_START, fps, config: { damping: 9, stiffness: 140 } });

  // 各行的起始時點：既有行隨視窗淡入；新增行逐行寫入。
  let addedSeen = 0;
  const lineStarts = FILE_LINES.map((line, index) => {
    if (!line.added) return EXIST_START + index * 8;
    const start = ADD_START + addedSeen * ADD_STAGGER;
    addedSeen += 1;
    return start;
  });
  const lastLineStart = lineStarts[lineStarts.length - 1];

  // 藍色外暈：連線抵達後才亮起，之後維持靜態淡暈（表示被 Codex 操作）。
  const glow = interpolate(f, [GLOW_START, GLOW_START + 14], [0, 0.7], clamp);

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            color: TEXT_DARK,
            fontSize: codexFont,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          <span style={{ fontSize: codexEmoji, lineHeight: 1 }}>🤖</span>
          <span style={{ lineHeight: 1 }}>Codex</span>
        </div>

        {/* 檔案視窗（編輯器風）：檔名標題列 ＋ 內文行（新增行套綠底）＋ 藍色外暈。 */}
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
            borderRadius: 22,
            overflow: "hidden",
            background: WHITE,
            border: `3px solid ${withAlpha(BLUE, 0.35 * glow + 0.0)}`,
            boxShadow: [
              `0 0 0 ${2 + 6 * glow}px ${withAlpha(BLUE, 0.18 * glow)}`,
              `0 0 ${44 * glow}px ${withAlpha(BLUE, 0.4 * glow)}`,
              `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
            ].join(", "),
          }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 30px",
              color: TEXT_DARK,
              background: WINDOW_BAR,
              borderBottom: `1px solid ${CARD_BORDER}`,
            }}
          >
            <FileIcon />
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>
              hello.md
            </div>
          </div>

          <div style={{ padding: "26px 30px", fontFamily: MONO, fontSize: 30 }}>
            {FILE_LINES.map((line, index) => {
              const start = lineStarts[index];
              const lineIn = interpolate(f, [start, start + 14], [0, 1], clamp);
              const showCursor =
                start === lastLineStart && lineIn > 0.5 && doneIn <= 0;

              return (
                <div
                  key={line.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    borderRadius: 8,
                    borderLeft: line.added
                      ? `4px solid ${GREEN}`
                      : "4px solid transparent",
                    background: line.added
                      ? withAlpha(GREEN, 0.16)
                      : "transparent",
                    color: TEXT_DARK,
                    opacity: lineIn,
                    transform: `translateX(${interpolate(lineIn, [0, 1], [line.added ? 12 : 0, 0])}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      color: GREEN,
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    {line.added ? "+" : ""}
                  </span>
                  <span>
                    {line.text}
                    {showCursor ? <span> ▋</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
