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
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 4 頁・S09-01：對話越來越長 → AI 忘東忘西（384 幀）
//   聊天串一則則冒出、整串往上捲；最舊的訊息捲到頂端逐漸變淡（＝遺忘），
//   最後一則 AI 露出困惑；結尾整體淡出到 NEUTRAL_50。
//   捲動採階梯式：填滿後每則「出現→停留（可讀）→捲一格」，捲動只發生在則與則之間。
const HEAD_IN = [6, 30] as const;
const MSG_FIRST = 24; // 第一則訊息（填滿階段）
const MSG_STEP = 22; // 填滿階段每則間隔
const READ_HOLD = 32; // 每則出現後停留（可閱讀）的幀數
const SCROLL_DUR = 14; // 單次往上捲一格的幀數
const ENDING_FADE = [354, 378] as const; // 結尾整體淡出到 NEUTRAL_50

const PANEL_W = 880;
const PANEL_H = 660; // 遮罩範圍 y300–960（收尾字拿掉後往下發展）
const ROW_H = 104; // 每則訊息的槽高
const VISIBLE = 6; // 面板同時可見則數 ＝ PANEL_H / ROW_H

// 捲動節奏（階梯式）衍生值
const FILL_DONE = MSG_FIRST + (VISIBLE - 1) * MSG_STEP; // 面板裝滿（最後一則填滿）的時點
const STEP_ONE = FILL_DONE + READ_HOLD; // 第一次捲動開始
const BEAT = READ_HOLD + SCROLL_DUR; // 每則的節奏長度（捲一格＋停留）

const MESSAGES = [
  { who: "user", text: "幫我做一個跳躍功能" },
  { who: "ai", text: "好的，跳躍已完成 ✔" },
  { who: "user", text: "再加上二段跳" },
  { who: "ai", text: "沒問題，已經加上了 ✔" },
  { who: "user", text: "角色要能踩在平台上" },
  { who: "ai", text: "好的，已加上平台碰撞 ✔" },
  { who: "user", text: "再幫我調一下移動速度" },
  { who: "ai", text: "完成，速度調整好了 ✔" },
  { who: "user", text: "記得我最早的需求嗎？" },
  { who: "ai", text: "咦？最早的需求是…？" },
] as const;

export const Ch3Page4S09ContextLimit01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = interpolate(frame, HEAD_IN, [0, 1], easeStandard);
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  // 階梯式捲動：每 BEAT 內 [0,SCROLL_DUR] 緩動捲一格、其餘停留靜止 → 出現→停留→捲一格
  const maxRows = MESSAGES.length - VISIBLE;
  const st = Math.max(0, frame - STEP_ONE);
  const beat = Math.floor(st / BEAT);
  const stepFrac = interpolate(st - beat * BEAT, [0, SCROLL_DUR], [0, 1], easeStandard);
  const scrollRows = Math.min(maxRows, beat + stepFrac);
  const scrollY = -scrollRows * ROW_H;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 150,
          transform: `translate(-50%, ${interpolate(headIn, [0, 1], [16, 0])}px)`,
          opacity: headIn * out,
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
          opacity: out,
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
            // 填滿階段（前 VISIBLE 則）快速鋪滿；之後每則於「捲一格」結束時出現在底部空格
            const at =
              i < VISIBLE
                ? MSG_FIRST + i * MSG_STEP
                : STEP_ONE + (i - VISIBLE) * BEAT + SCROLL_DUR;
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
    </AbsoluteFill>
  );
};
