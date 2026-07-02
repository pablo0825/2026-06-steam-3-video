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
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 5 頁・S12：AGENTS.md 運作方式（360 幀）
//   AI 先出現 → 反向箭頭自 AI 往左三個區塊畫出 → 箭頭抵達時該卡片才 pop。
const AI_AT = 24; // AI 先出現
const LINE_FIRST = 70; // 第一條反向線（AI→卡片）開始
const LINE_DUR = 30; // 每條線畫出時長
const LINE_STEP = 22; // 三條線的錯開間隔

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

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  // AI 先出現
  const aiIn = spring({
    frame: frame - AI_AT,
    fps,
    config: { damping: 17, stiffness: 115, overshootClamping: true },
  });
  // 三條反向線（AI→卡片）逐條錯開：線畫出 → 箭頭抵達 → 該卡片 pop
  const inputs = [0, 1, 2].map((i) => {
    const start = LINE_FIRST + i * LINE_STEP;
    return {
      line: interpolate(frame, [start, start + LINE_DUR], [0, 1], easeStandard),
      arrow: interpolate(
        frame,
        [start + LINE_DUR - 6, start + LINE_DUR + 4],
        [0, 1],
        easeStandard,
      ),
      card: spring({
        frame: frame - (start + LINE_DUR - 8),
        fps,
        config: { damping: 18, stiffness: 120 },
      }),
    };
  });
  const outputLine = interpolate(frame, [195, 235], [0, 1], easeStandard);
  const outputArrow = interpolate(frame, [227, 239], [0, 1], easeStandard);
  const answerIn = spring({
    frame: frame - 245,
    fps,
    config: { damping: 18, stiffness: 115, overshootClamping: true },
  });
  const out = interpolate(frame, [338, 358], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 112,
            transform: `translateX(-50%) scale(${interpolate(
              titleIn,
              [0, 1],
              [0.94, 1],
            )})`,
            opacity: titleIn,
            fontSize: 60,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 2,
            whiteSpace: "nowrap",
          }}
        >
          AI 會綜合多項資訊回答
        </div>

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
            專案的長期規則
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
          <path
            d="M933 571 C800 500 720 420 640 420"
            fill="none"
            stroke={BLUE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - inputs[0].line}
          />
          <path
            d="M919 620 L640 620"
            fill="none"
            stroke={BLUE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - inputs[1].line}
          />
          <path
            d="M933 669 C800 740 720 820 640 820"
            fill="none"
            stroke={BLUE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - inputs[2].line}
          />
          <g opacity={inputs[0].arrow} transform="translate(606 420)">
            <path d="M0 0 L38 -20 L38 20 Z" fill={BLUE} />
          </g>
          <g opacity={inputs[1].arrow} transform="translate(606 620)">
            <path d="M0 0 L38 -20 L38 20 Z" fill={BLUE} />
          </g>
          <g opacity={inputs[2].arrow} transform="translate(606 820)">
            <path d="M0 0 L38 -20 L38 20 Z" fill={BLUE} />
          </g>
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
            transform: `translate(-50%, -50%) scale(${interpolate(
              aiIn,
              [0, 1],
              [0.86, 1],
            )})`,
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

        <div
          style={{
            position: "absolute",
            left: 1380,
            top: 555,
            width: 440,
            height: 130,
            transform: `translateX(${interpolate(answerIn, [0, 1], [28, 0])}px)`,
            opacity: answerIn,
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 900,
            color: TEXT_DARK,
            backgroundColor: withAlpha(WHITE, 1),
            border: `3px solid ${withAlpha(CARD_BORDER, 0.8)}`,
          }}
        >
          符合
          <span style={{ color: YELLOW, margin: "0 10px" }}>脈絡、規範</span>
          的回答
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
