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
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 4 頁・S09-01：對話越來越長 → AI 忘東忘西（270 幀）
//   聊天串一則則冒出、整串往上捲；最舊的訊息捲到頂端逐漸變淡（＝遺忘），
//   最後一則 AI 露出困惑。收尾揭示「忘東忘西／不太聰明」。
const HEAD_IN = [6, 30] as const;
const MSG_FIRST = 24; // 第一則訊息
const MSG_STEP = 32; // 每則間隔
const CAPTION_IN = [212, 242] as const;

const PANEL_W = 880;
const PANEL_H = 460;
const ROW_H = 104; // 每則訊息的槽高
const VISIBLE = 4; // 面板同時可見則數（超過就往上捲）

const MESSAGES = [
  { who: "user", text: "幫我做一個跳躍功能" },
  { who: "ai", text: "好的，跳躍已完成 ✔" },
  { who: "user", text: "再加上二段跳" },
  { who: "ai", text: "沒問題，已經加上了 ✔" },
  { who: "user", text: "記得我最早的需求嗎？" },
  { who: "ai", text: "咦？最早的需求是…？" },
] as const;

export const Ch3Page4S09ContextLimit01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = interpolate(frame, HEAD_IN, [0, 1], easeStandard);
  const captionIn = interpolate(frame, CAPTION_IN, [0, 1], easeStandard);

  // 已出現的則數（平滑值）→ 換算整串往上捲的位移
  const appeared = MESSAGES.reduce((acc, _, i) => {
    const at = MSG_FIRST + i * MSG_STEP;
    return acc + interpolate(frame, [at, at + 16], [0, 1], clamp);
  }, 0);
  const scrollY = -Math.max(0, appeared - VISIBLE) * ROW_H;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 150,
          transform: `translate(-50%, ${interpolate(headIn, [0, 1], [16, 0])}px)`,
          opacity: headIn,
          fontSize: 56,
          fontWeight: 900,
          letterSpacing: 2,
          color: TEXT_DARK,
        }}
      >
        對話越來越長…
      </div>

      {/* 聊天面板（往上捲動的訊息串） */}
      <div
        style={{
          position: "absolute",
          left: 960 - PANEL_W / 2,
          top: 300,
          width: PANEL_W,
          height: PANEL_H,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${scrollY}px)`,
          }}
        >
          {MESSAGES.map((m, i) => {
            const at = MSG_FIRST + i * MSG_STEP;
            const appear = spring({
              frame: frame - at,
              fps,
              config: { damping: 18, stiffness: 120 },
            });
            const yOnScreen = i * ROW_H + scrollY;
            // 捲到頂端的舊訊息逐漸變淡（遺忘）
            const edge = interpolate(yOnScreen, [0, ROW_H], [0.2, 1], clamp);
            const isUser = m.who === "user";
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: i * ROW_H,
                  left: 0,
                  width: "100%",
                  height: ROW_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  opacity: appear * edge,
                  transform: `translateY(${interpolate(appear, [0, 1], [18, 0])}px)`,
                }}
              >
                <div
                  style={{
                    maxWidth: "74%",
                    padding: "18px 24px",
                    borderRadius: 22,
                    fontSize: 30,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: isUser ? WHITE : TEXT_DARK,
                    backgroundColor: isUser ? BLUE : WHITE,
                    border: isUser ? "none" : `2px solid ${CARD_BORDER}`,
                    boxShadow: `0 8px 20px ${withAlpha(TEXT_DARK, 0.06)}`,
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 收尾：忘東忘西／不太聰明 */}
      <div
        aria-label="對話越來越長，AI 開始忘東忘西，或覺得 AI 不太聰明"
        style={{
          position: "absolute",
          left: 960,
          top: 860,
          transform: `translate(-50%, ${interpolate(captionIn, [0, 1], [18, 0])}px)`,
          opacity: captionIn,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 1,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        AI 開始<span style={{ color: YELLOW }}>忘東忘西</span>
        ，或覺得 AI <span style={{ color: YELLOW }}>不太聰明</span>
      </div>
    </AbsoluteFill>
  );
};
