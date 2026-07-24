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
  NEUTRAL_100,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 4 頁・S09-01：對話越來越長 → AI 忘東忘西（447 幀）
//   套用 S12 的「AI Agent」對話視窗樣式：聊天串裝進置中視窗（標題列 🤖 AI Agent），
//   氣泡配色照 S12（使用者淡藍靠右、AI 中性灰靠左）。視窗一次可見 5 則：
//   訊息一則則冒出、整串階梯式往上捲（越聊越長），最後一則 AI 露出困惑。
const HOLD = 15; // 開場白底停留幀數（內容延後這麼多幀才開始）
const FADE_IN = 18; // 開頭：視窗淡入
const MSG_FIRST = 24; // 第一則訊息（填滿階段）
const MSG_STEP = 22; // 填滿階段每則間隔
const READ_HOLD = 32; // 每則出現後停留（可閱讀）的幀數
const SCROLL_DUR = 14; // 單次往上捲一格的幀數
const ENDING_FADE = [408, 432] as const; // 結尾整體淡出到 NEUTRAL_50

const WIN_W = 900; // 視窗寬
const WIN_CY = 540; // 視窗垂直中心（畫面正中）
const ROW_H = 104; // 每則訊息的槽高
const VISIBLE = 5; // 視窗同時可見則數
const VIEW_H = VISIBLE * ROW_H; // 捲動視窗高度

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

// 氣泡外觀（照 S12）
const BUBBLE_BASE: React.CSSProperties = {
  maxWidth: "80%",
  padding: "16px 24px",
  borderRadius: 20,
  fontSize: 32,
  lineHeight: 1.35,
  color: TEXT_DARK,
};

export const Ch3Page4S09ContextLimit01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - HOLD; // 內容時間軸（開場白底後才起算）

  const fadeIn = interpolate(f, [0, FADE_IN], [0, 1], clamp);
  const out = interpolate(f, ENDING_FADE, [1, 0], clamp);
  const contentOpacity = fadeIn * out;

  // 階梯式捲動：每 BEAT 內 [0,SCROLL_DUR] 緩動捲一格、其餘停留靜止 → 出現→停留→捲一格
  const maxRows = MESSAGES.length - VISIBLE;
  const st = Math.max(0, f - STEP_ONE);
  const beat = Math.floor(st / BEAT);
  const stepFrac = interpolate(
    st - beat * BEAT,
    [0, SCROLL_DUR],
    [0, 1],
    easeStandard,
  );
  const scrollRows = Math.min(maxRows, beat + stepFrac);
  const scrollY = -scrollRows * ROW_H;

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        {/* 對話視窗 */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: WIN_CY,
            transform: "translate(-50%, -50%)",
            width: WIN_W,
            borderRadius: 22,
            overflow: "hidden",
            background: WHITE,
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: `0 24px 60px ${withAlpha(TEXT_DARK, 0.12)}`,
          }}
        >
          {/* 標題列 */}
          <div
            style={{
              height: 68,
              display: "flex",
              alignItems: "center",
              padding: "0 30px",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 1,
              color: SUBTLE,
              background: WINDOW_BAR,
              borderBottom: `1px solid ${CARD_BORDER}`,
            }}
          >
            🤖 AI Agent
          </div>

          {/* 視窗上下留白 */}
          <div style={{ padding: "24px 0" }}>
            {/* 捲動視窗（往上捲動的訊息串） */}
            <div
              style={{
                position: "relative",
                height: VIEW_H,
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
                  // 填滿階段（前 VISIBLE 則）快速鋪滿；之後每則於「捲一格」結束時出現在底部空格
                  const at =
                    i < VISIBLE
                      ? MSG_FIRST + i * MSG_STEP
                      : STEP_ONE + (i - VISIBLE) * BEAT + SCROLL_DUR;
                  const appear = spring({
                    frame: f - at,
                    fps,
                    config: { damping: 18, stiffness: 120 },
                  });
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
                        padding: "0 34px",
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isUser ? "flex-end" : "flex-start",
                        opacity: appear,
                        transform: `translateY(${interpolate(appear, [0, 1], [18, 0])}px)`,
                      }}
                    >
                      <div
                        style={{
                          ...BUBBLE_BASE,
                          background: isUser
                            ? withAlpha(BLUE, 0.1)
                            : NEUTRAL_100,
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
