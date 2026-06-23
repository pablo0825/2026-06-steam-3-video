import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {
  ...clamp,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const CARD_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 390,
  height: 150,
  borderRadius: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: WHITE,
  border: `3px solid ${CARD_BORDER}`,
  boxShadow: `0 16px 38px ${withAlpha(TEXT_DARK, 0.08)}`,
};

export const Ch3Page5AgentsFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const questionIn = interpolate(frame, [42, 72], [0, 1], ease);
  const rulesIn = interpolate(frame, [82, 112], [0, 1], ease);
  const inputLines = interpolate(frame, [118, 158], [0, 1], ease);
  const aiIn = spring({
    frame: frame - 148,
    fps,
    config: { damping: 17, stiffness: 115, overshootClamping: true },
  });
  const outputLine = interpolate(frame, [196, 230], [0, 1], ease);
  const answerIn = spring({
    frame: frame - 220,
    fps,
    config: { damping: 18, stiffness: 115, overshootClamping: true },
  });
  const transitionIn = interpolate(frame, [306, 334], [0, 1], ease);
  const out = interpolate(frame, [338, 358], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        fontFamily: FONT,
        opacity: out,
      }}
    >
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
        每次對話，AI 都會參考兩項資訊
      </div>

      <div
        style={{
          ...CARD_STYLE,
          left: 250,
          top: 270,
          opacity: questionIn,
          transform: `translateY(${interpolate(
            questionIn,
            [0, 1],
            [28, 0],
          )}px)`,
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
          right: 250,
          top: 270,
          opacity: rulesIn,
          transform: `translateY(${interpolate(
            rulesIn,
            [0, 1],
            [28, 0],
          )}px)`,
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
            color: BLUE,
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
        <defs>
          <marker
            id="agents-arrow-blue"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M0,0 L12,6 L0,12 Z" fill={BLUE} />
          </marker>
          <marker
            id="agents-arrow-yellow"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M0,0 L12,6 L0,12 Z" fill={YELLOW} />
          </marker>
        </defs>
        <path
          d="M640 345 C735 345 780 430 850 478"
          fill="none"
          stroke={BLUE}
          strokeWidth="6"
          strokeLinecap="round"
          markerEnd="url(#agents-arrow-blue)"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - inputLines}
        />
        <path
          d="M1280 345 C1185 345 1140 430 1070 478"
          fill="none"
          stroke={BLUE}
          strokeWidth="6"
          strokeLinecap="round"
          markerEnd="url(#agents-arrow-blue)"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - inputLines}
        />
        <path
          d="M960 620 L960 735"
          fill="none"
          stroke={YELLOW}
          strokeWidth="7"
          strokeLinecap="round"
          markerEnd="url(#agents-arrow-yellow)"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - outputLine}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
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
          left: 960,
          top: 830,
          width: 760,
          minHeight: 128,
          transform: `translate(-50%, -50%) translateY(${interpolate(
            answerIn,
            [0, 1],
            [28, 0],
          )}px)`,
          opacity: answerIn,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 900,
          color: TEXT_DARK,
          backgroundColor: withAlpha(YELLOW, 0.1),
          border: `3px solid ${withAlpha(YELLOW, 0.7)}`,
        }}
      >
        符合
        <span style={{ color: YELLOW, margin: "0 10px" }}>專案規則</span>
        的回答
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          bottom: 58,
          transform: `translateX(-50%) translateY(${interpolate(
            transitionIn,
            [0, 1],
            [18, 0],
          )}px)`,
          opacity: transitionIn,
          fontSize: 28,
          fontWeight: 800,
          color: BLUE,
          letterSpacing: 2,
        }}
      >
        接下來實際建立並驗證 AGENTS.md →
      </div>
    </AbsoluteFill>
  );
};
