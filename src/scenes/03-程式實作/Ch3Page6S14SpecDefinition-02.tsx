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

// 第 3 集・第 6 頁・S14-02：對話逐漸遺失（384 幀）
//   沿用 S09-01 的版面（標題＋聊天面板＋泡泡）。每加入一則新對話，最舊的
//   一則就被往上推出頂端、往泡泡各自那側滑出畫面（＝被擠掉、遺失），
//   其餘整串往上遞補。
const HEAD_IN = [6, 30] as const;
const MSG_FIRST = 33; // 第一則（填滿階段）；比標題晚一點出，拉開間距
const MSG_STEP = 20; // 填滿階段每則間隔
const READ_HOLD = 30; // 每則出現後停留（可閱讀）
const SCROLL_DUR = 16; // 單次「遞補一格＋舊則滑走」的幀數
const ENDING_FADE = [356, 380] as const; // 結尾整體淡出到 NEUTRAL_50

const PANEL_W = 880;
const PANEL_LEFT = (1920 - PANEL_W) / 2; // 訊息列置中的左緣
const VISIBLE = 6; // 面板同時可見則數
const ROW_H = 108;
const PANEL_H = VISIBLE * ROW_H;
const PANEL_TOP = 300;

// 節奏衍生值
const FILL_DONE = MSG_FIRST + (VISIBLE - 1) * MSG_STEP; // 面板裝滿的時點
const STEP_ONE = FILL_DONE + READ_HOLD; // 第一次「遞補＋滑走」開始
const BEAT = READ_HOLD + SCROLL_DUR; // 每則的節奏長度

const MESSAGES = [
  { who: "user", text: "幫我做一個跳躍功能" },
  { who: "ai", text: "好的，跳躍已完成 ✔" },
  { who: "user", text: "再加上二段跳" },
  { who: "ai", text: "沒問題，已加上二段跳 ✔" },
  { who: "user", text: "角色要能踩在平台上" },
  { who: "ai", text: "好的，已加上平台碰撞 ✔" },
  { who: "user", text: "再幫我加上衝刺" },
  { who: "ai", text: "完成，衝刺已加上 ✔" },
  { who: "user", text: "記得我最早的需求嗎？" },
  { who: "ai", text: "咦？最早的需求是…？" },
] as const;

// 每則的登場時點：前 VISIBLE 則填滿階段鋪滿，其後每則在「遞補」結束時登場
const appearAt = (i: number) =>
  i < VISIBLE
    ? MSG_FIRST + i * MSG_STEP
    : STEP_ONE + (i - VISIBLE) * BEAT + SCROLL_DUR;

export const Ch3Page6S14SpecDefinition02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = interpolate(frame, HEAD_IN, [0, 1], easeStandard);
  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);

  // 遞補進度 advance：填滿後每 BEAT 內於 [0,SCROLL_DUR] 緩動往上遞補一格
  const maxAdvance = MESSAGES.length - VISIBLE;
  const st = Math.max(0, frame - STEP_ONE);
  const beat = Math.floor(st / BEAT);
  const frac = interpolate(st - beat * BEAT, [0, SCROLL_DUR], [0, 1], easeStandard);
  const advance = Math.min(maxAdvance, beat + frac);

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
        對話逐漸遺失...
      </div>

      {/* 聊天面板：舊則從頂端往左滑出、其餘往上遞補 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: PANEL_TOP,
          width: 1920,
          height: PANEL_H,
          overflow: "hidden", // 僅裁切上下（升入／退出頂端）；左右滿版讓訊息滑到螢幕邊
          opacity: out,
        }}
      >
        {MESSAGES.map((m, i) => {
          const slot = i - advance; // 距頂端的格位（0＝頂端最舊、VISIBLE-1＝底部最新）
          if (slot > VISIBLE || slot < -1) return null; // 尚未升入／已滑出

          // 進場：填滿階段用 spring 彈入；beat 階段的新則改由 slot 自底部升入
          //（與整串上移同步），登場淡入依 slot 決定，不再用獨立的登場時點。
          const fillAppear =
            i < VISIBLE
              ? spring({
                  frame: frame - appearAt(i),
                  fps,
                  config: { damping: 18, stiffness: 120 },
                })
              : interpolate(slot, [VISIBLE - 1, VISIBLE - 0.5], [1, 0], clamp);
          const popY =
            i < VISIBLE ? interpolate(fillAppear, [0, 1], [18, 0]) : 0;
          // slot 由 0 往負值時＝被往上推出頂端 → 往泡泡各自那側滑走並淡出
          const exit = interpolate(slot, [-1, 0], [1, 0], clamp);
          const isUser = m.who === "user";
          const exitX = (isUser ? 1 : -1) * exit * (PANEL_W + 120);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: slot * ROW_H, // 直接依 slot 定位：新則自底升、舊則往上出頂
                left: PANEL_LEFT,
                width: PANEL_W,
                height: ROW_H,
                display: "flex",
                alignItems: "center",
                justifyContent: isUser ? "flex-end" : "flex-start",
                opacity: fillAppear * (1 - exit),
                transform: `translate(${exitX}px, ${popY}px)`,
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
    </AbsoluteFill>
  );
};
