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
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 5 頁・S12：AI 有機率忘東忘西（360 幀）
//   置中的「AI Agent」對話視窗：使用者連丟三則需求（靠右）→ 過了一陣子 →
//   AI 反問「跳躍高度是多少？」（靠左），同時前面三則需求淡化，強調 AI 忘了。
//   視窗下方一句說明作結。只保留開頭淡入、結尾淡出。
const FADE_IN = 18; // 開頭：整組內容淡入
const FADE_OUT = 24; // 結尾：整組內容淡出

// 各則訊息進場時點（frame 基準）
const B1 = 28;
const B2 = 52;
const B3 = 76;
const GAP_AT = 114; // 「過了一陣子」分隔
const AI_AT = 152; // AI 反問
const CAP_AT = 192; // 下方說明淡入

const WIN_CY = 480; // 視窗垂直中心（下方字固定在 top:840，視窗置於其上方）
const CAP_TOP = 900; // 下方說明位置（往下移，與視窗拉開距離）

// 使用者的三則需求（靠右氣泡）
const USER_MSGS = [
  "角色的跳躍高度是 8",
  "衝刺速度設 15",
  "攀牆上限 2 秒",
] as const;

const BUBBLE_BASE: React.CSSProperties = {
  fontSize: 32,
  lineHeight: 1.35,
  borderRadius: 20,
  padding: "16px 24px",
  maxWidth: "80%",
};

export const Ch3Page5S12AgentsFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 開頭淡入 × 結尾淡出
  const fadeIn = interpolate(frame, [0, FADE_IN], [0, 1], clamp);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_OUT, durationInFrames],
    [1, 0],
    clamp,
  );
  const contentOpacity = fadeIn * fadeOut;

  // 氣泡進場：由下微微浮起 + 淡入（overshootClamping 讓使用者訊息乾淨落定）
  const pop = (start: number, overshoot: boolean) => {
    const s = spring({
      frame: frame - start,
      fps,
      config: overshoot
        ? { damping: 12, stiffness: 130 }
        : { damping: 16, stiffness: 130, overshootClamping: true },
    });
    return {
      opacity: interpolate(s, [0, 1], [0, 1], clamp),
      y: interpolate(s, [0, 1], [8, 0]),
    };
  };

  const gapIn = pop(GAP_AT, false);
  const aiIn = pop(AI_AT, true);
  const capIn = pop(CAP_AT, false);

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
            width: 760,
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

          {/* 對話內容 */}
          <div
            style={{
              padding: "46px 30px 50px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              minHeight: 372,
            }}
          >
            {USER_MSGS.map((msg, i) => {
              const p = pop([B1, B2, B3][i], false);
              return (
                <div
                  key={msg}
                  style={{
                    ...BUBBLE_BASE,
                    alignSelf: "flex-end",
                    background: withAlpha(BLUE, 0.1),
                    color: TEXT_DARK,
                    opacity: p.opacity,
                    transform: `translateY(${p.y}px)`,
                  }}
                >
                  {msg}
                </div>
              );
            })}

            {/* 過了一陣子 */}
            <div
              style={{
                alignSelf: "center",
                fontSize: 24,
                fontWeight: 700,
                color: SUBTLE,
                opacity: gapIn.opacity,
                transform: `translateY(${gapIn.y}px)`,
              }}
            >
              ⋯ 過了一陣子 ⋯
            </div>

            {/* AI 反問 */}
            <div
              style={{
                ...BUBBLE_BASE,
                alignSelf: "flex-start",
                background: NEUTRAL_100,
                color: TEXT_DARK,
                opacity: aiIn.opacity,
                transform: `translateY(${aiIn.y}px)`,
              }}
            >
              請問…跳躍高度是多少來著？ 🤔
            </div>
          </div>
        </div>

        {/* 下方說明（位置對齊 Ch4 S09ToUnity 的 VerdictBadge） */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: CAP_TOP,
            transform: `translateX(-50%) translateY(${capIn.y}px)`,
            fontSize: 56,
            fontWeight: 800,
            color: TEXT_DARK,
            opacity: capIn.opacity,
          }}
        >
          AI 有機率會忘東忘西
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
