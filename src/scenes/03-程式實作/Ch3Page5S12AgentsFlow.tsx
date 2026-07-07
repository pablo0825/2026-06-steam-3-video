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
  NEUTRAL_300,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

// 第 3 集・第 5 頁・S12：AGENTS.md 運作方式（360 幀）
//   無標題、內容整組置中。三個左側區塊先逐一出現 → 全到齊後三條線一起畫向
//   AI、箭頭同時抵達 → AI 放大再縮小（上升快、下降慢）→ AI 往右輸出，
//   右側「回答」檔案視窗淡入、綠色長條由左逐條寫出。
const AI_AT = 24; // AI 先出現
const CARD_FIRST = 40; // 第一張卡片進場
const CARD_STEP = 18; // 三張卡片錯開間隔
const LINE_START = 108; // 三張卡片全到齊後，三條線一起畫向 AI
const LINE_DUR = 30; // 線畫出時長
const GROUP_SHIFT = -64; // 拿掉標題後整組上移，讓內容在畫面裡置中
const AI_PULSE_AT = 146; // 三條箭頭一起抵達後，AI 脈動的起點

// 右側「回答」視窗：綠色長條由左逐條寫出（沿用 S04-02 的視覺邏輯）
const OUT_BARS = [0.66, 0.5, 0.82, 0.58] as const;
const OUT_BAR_START = 250;
const OUT_BAR_STAGGER = 12;
const OUT_BAR_RAMP = 22;

const CARD_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 420,
  height: 130,
  borderRadius: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: WHITE,
  border: `3px solid ${CARD_BORDER}`,
  boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.08)}`,
};

export const Ch3Page5S12AgentsFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // AI 先出現
  const aiIn = spring({
    frame: frame - AI_AT,
    fps,
    config: { damping: 17, stiffness: 115, overshootClamping: true },
  });
  // 卡片逐一 pop 進場；全到齊後三條線一起畫向 AI、箭頭同時抵達
  const line = interpolate(
    frame,
    [LINE_START, LINE_START + LINE_DUR],
    [0, 1],
    easeStandard,
  );
  const arrow = interpolate(
    frame,
    [LINE_START + LINE_DUR - 6, LINE_START + LINE_DUR + 4],
    [0, 1],
    easeStandard,
  );
  const inputs = [0, 1, 2].map((i) => ({
    line,
    arrow,
    card: spring({
      frame: frame - (CARD_FIRST + i * CARD_STEP),
      fps,
      config: { damping: 18, stiffness: 120 },
    }),
  }));

  // 三條箭頭全部抵達後，AI 放大→縮小：上升快（easeOutExpo，8 幀）、下降慢（22 幀）
  const pulse =
    frame <= AI_PULSE_AT + 8
      ? interpolate(
          frame,
          [AI_PULSE_AT, AI_PULSE_AT + 8],
          [0, 0.16],
          easeOutExpo,
        )
      : interpolate(
          frame,
          [AI_PULSE_AT + 8, AI_PULSE_AT + 30],
          [0.16, 0],
          easeStandard,
        );
  const aiScale = interpolate(aiIn, [0, 1], [0.86, 1]) * (1 + pulse);

  const outputLine = interpolate(frame, [195, 235], [0, 1], easeStandard);
  const outputArrow = interpolate(frame, [227, 239], [0, 1], easeStandard);
  const windowIn = spring({
    frame: frame - 235,
    fps,
    config: { damping: 18, stiffness: 115, overshootClamping: true },
  });
  const out = interpolate(frame, [338, 358], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{ opacity: out, transform: `translateY(${GROUP_SHIFT}px)` }}
      >
        <div
          style={{
            ...CARD_STYLE,
            left: 170,
            top: 355,
            opacity: inputs[0].card,
            transform: `scale(${interpolate(inputs[0].card, [0, 1], [0.9, 1])})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: SUBTLE }}>
            這次的要求
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 38,
              fontWeight: 900,
              color: TEXT_DARK,
            }}
          >
            使用者問題
          </div>
        </div>

        <div
          style={{
            ...CARD_STYLE,
            left: 170,
            top: 555,
            opacity: inputs[1].card,
            transform: `scale(${interpolate(inputs[1].card, [0, 1], [0.9, 1])})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: SUBTLE }}>
            對話脈絡
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 38,
              fontWeight: 900,
              color: TEXT_DARK,
            }}
          >
            Context
          </div>
        </div>

        <div
          style={{
            ...CARD_STYLE,
            left: 170,
            top: 755,
            opacity: inputs[2].card,
            transform: `scale(${interpolate(inputs[2].card, [0, 1], [0.9, 1])})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: SUBTLE }}>
            專案規則
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 38,
              fontWeight: 900,
              color: TEXT_DARK,
            }}
          >
            AGENTS.md
          </div>
        </div>

        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {/* 三條線自卡片右緣（+16px）畫向 AI，尖端距 AI 圓緣 16px */}
          <path
            d="M606 420 C760 420 867 543 899 559"
            fill="none"
            stroke={BLUE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - inputs[0].line}
          />
          <path
            d="M606 620 L885 620"
            fill="none"
            stroke={BLUE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - inputs[1].line}
          />
          <path
            d="M606 820 C760 820 867 697 899 681"
            fill="none"
            stroke={BLUE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - inputs[2].line}
          />
          {/* 箭頭指向 AI：尖端對齊線終點，並依線的方向旋轉貼合 */}
          <g
            opacity={inputs[0].arrow}
            transform="translate(930 573) rotate(25.3)"
          >
            <path d="M0 0 L-38 -20 L-38 20 Z" fill={BLUE} />
          </g>
          <g opacity={inputs[1].arrow} transform="translate(919 620)">
            <path d="M0 0 L-38 -20 L-38 20 Z" fill={BLUE} />
          </g>
          <g
            opacity={inputs[2].arrow}
            transform="translate(930 667) rotate(-25.3)"
          >
            <path d="M0 0 L-38 -20 L-38 20 Z" fill={BLUE} />
          </g>
          {/* AI → 右側視窗的輸出線 */}
          <path
            d="M1141 620 L1330 620"
            fill="none"
            stroke={BLUE}
            strokeWidth="7"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - outputLine}
          />
          <g opacity={outputArrow} transform="translate(1364 620)">
            <path d="M0 0 L-38 -21 L-38 21 Z" fill={BLUE} />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            left: 1030,
            top: 620,
            width: 190,
            height: 190,
            transform: `translate(-50%, -50%) scale(${aiScale})`,
            opacity: aiIn,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: 4,
            color: WHITE,
            backgroundColor: BLUE,
            boxShadow: `0 18px 42px ${withAlpha(BLUE, 0.24)}`,
          }}
        >
          AI
        </div>

        {/* 右側「回答」檔案視窗：標題實心綠、長條淡綠由左逐條寫出 */}
        <div
          style={{
            position: "absolute",
            left: 1380,
            top: 620,
            width: 430,
            boxSizing: "border-box",
            padding: "30px 34px 34px",
            transform: `translateY(-50%) scale(${interpolate(
              windowIn,
              [0, 1],
              [0.96, 1],
            )})`,
            transformOrigin: "center left",
            opacity: windowIn,
            background: WHITE,
            borderRadius: 18,
            border: `1px solid ${NEUTRAL_300}`,
            boxShadow: `0 24px 60px ${withAlpha(TEXT_DARK, 0.14)}`,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: 1,
              color: GREEN,
              marginBottom: 26,
            }}
          >
            更符合需求的回答
          </div>
          {OUT_BARS.map((wRatio, i) => {
            const p = interpolate(
              frame,
              [
                OUT_BAR_START + i * OUT_BAR_STAGGER,
                OUT_BAR_START + i * OUT_BAR_STAGGER + OUT_BAR_RAMP,
              ],
              [0, 1],
              easeStandard,
            );
            return (
              <div
                key={i}
                style={{
                  height: 14,
                  width: `${wRatio * 100}%`,
                  marginTop: i === 0 ? 0 : 18,
                  borderRadius: 7,
                  background: withAlpha(GREEN, 0.5),
                  transform: `scaleX(${p})`,
                  transformOrigin: "left center",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
