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
  CHIP_BG,
  DIVIDER,
  GREEN,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { VerdictBadge } from "../../components/VerdictBadge";
import { FONT, MONO, clamp } from "../../theme/motion";

// 第 1 集・第 8 頁・S19：ChatGPT vs Codex 對比＋結論（630 幀）
//   左右兩欄各演一段同樣的對話（我問 → 它給程式碼），差別只在 Codex 多一句
//   「已經幫你寫進文件」。兩欄結構刻意相同，差異才凸顯得出來。
//   左欄先建 → 約 f=300（Codex 那句）後建右欄；每欄的結論在該欄對話講完後才出現。
const CONTENT_OUT = [608, 629] as const;
const LX = 520;
const RX = 1400;
const COL_W = 720;
const HEADER_Y = 210;
const HEADER_SIZE = 72;
const COL_TOP = 316;
const VERDICT_Y = 902;

// 右欄延後於左句講完後（~300 幀）開始建。
const RIGHT_OFFSET = 300;
const LEFT_START = 40;
const RIGHT_START = RIGHT_OFFSET + 50;
// 一問一答是連續講出來的，間隔太長會像 AI 在發呆。
const MSG_GAP = 32;
// 各欄的結論等該欄最後一則泡泡站定後才出現，時點由對話推導。
const SETTLE = 30;

const ASK = "幫我寫 jump() 的程式";
const CODE = "function jump() {\n  rb.velocity =\n    Vector2.up * 8f;\n}";

type Message = {
  who: "user" | "ai";
  text: string;
  mono?: boolean;
  accent?: boolean; // 綠色強調：Codex 獨有的那一句
};

const LEFT: Message[] = [
  { who: "user", text: ASK },
  { who: "ai", text: CODE, mono: true },
];
const RIGHT: Message[] = [
  { who: "user", text: ASK },
  { who: "ai", text: CODE, mono: true },
  { who: "ai", text: "我已經幫你寫到文件中了 ✔", accent: true },
];

const startOf = (from: number, index: number) => from + index * MSG_GAP;
const lastStart = (msgs: Message[], from: number) =>
  startOf(from, msgs.length - 1);

const Bubble: React.FC<{ msg: Message; appear: number }> = ({
  msg,
  appear,
}) => {
  const isUser = msg.who === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [18, 0])}px)`,
      }}
    >
      <div
        style={{
          maxWidth: "84%",
          padding: "18px 24px",
          borderRadius: 22,
          fontFamily: msg.mono ? MONO : FONT,
          fontSize: msg.mono ? 30 : 32,
          fontWeight: msg.accent ? 800 : 600,
          lineHeight: msg.mono ? 1.5 : 1.3,
          whiteSpace: "pre",
          // 只用明暗區分說話的人：藍留給 Codex、綠留給結論。
          //   強調句也用白底，從一排灰泡泡裡浮出來。
          color: msg.accent ? GREEN : TEXT_DARK,
          backgroundColor: isUser || msg.accent ? WHITE : CHIP_BG,
          border: `2px solid ${msg.accent ? GREEN : CARD_BORDER}`,
          boxShadow: `0 8px 20px ${withAlpha(TEXT_DARK, 0.06)}`,
        }}
      >
        {msg.text}
      </div>
    </div>
  );
};

const Verdict: React.FC<{
  cx: number;
  scale: number;
  children: React.ReactNode;
}> = ({ cx, scale, children }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: VERDICT_Y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity: scale <= 0 ? 0 : 1,
    }}
  >
    {children}
  </div>
);

// ChatGPT 這側不是「做錯」、只是「多一道工」，所以不用 ✗ 徽章，改用手寫 emoji。
//   尺寸刻意對齊 VerdictBadge 的預設（圓徑 58 / 字級 50 / 間距 20），兩側才等高。
const ManualBadge: React.FC = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 20,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontSize: 58, lineHeight: 1 }}>✍️</span>
    <span style={{ fontSize: 50, fontWeight: 800, color: TEXT_DARK }}>
      要自己動手貼上
    </span>
  </div>
);

export const Ch1Page8S19Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const leftHead = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const rightHead = spring({
    frame: frame - (RIGHT_OFFSET + 20),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const bubbleIn = (start: number) =>
    spring({
      frame: frame - start,
      fps,
      config: { damping: 18, stiffness: 120 },
    });
  const leftVerdict = spring({
    frame: frame - (lastStart(LEFT, LEFT_START) + SETTLE),
    fps,
    config: { damping: 11, stiffness: 130 },
  });
  const rightVerdict = spring({
    frame: frame - (lastStart(RIGHT, RIGHT_START) + SETTLE),
    fps,
    config: { damping: 11, stiffness: 130 },
  });

  const column = (cx: number) => ({
    position: "absolute" as const,
    left: cx - COL_W / 2,
    top: COL_TOP,
    width: COL_W,
    display: "flex",
    flexDirection: "column" as const,
    gap: 24,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 150,
            width: 0,
            height: 760,
            borderLeft: `3px dashed ${DIVIDER}`,
            transform: "translateX(-50%)",
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: LX,
            top: HEADER_Y,
            transform: `translate(-50%, -50%) scale(${leftHead})`,
            opacity: leftHead,
            color: TEXT_DARK,
            fontSize: HEADER_SIZE,
            fontWeight: 800,
          }}
        >
          ChatGPT
        </div>

        <div
          style={{
            position: "absolute",
            left: RX,
            top: HEADER_Y,
            transform: `translate(-50%, -50%) scale(${rightHead})`,
            opacity: rightHead,
            color: BLUE,
            fontSize: HEADER_SIZE,
            fontWeight: 800,
          }}
        >
          Codex
        </div>

        <div style={column(LX)}>
          {LEFT.map((msg, index) => (
            <Bubble
              key={index}
              msg={msg}
              appear={bubbleIn(startOf(LEFT_START, index))}
            />
          ))}
        </div>

        <div style={column(RX)}>
          {RIGHT.map((msg, index) => (
            <Bubble
              key={index}
              msg={msg}
              appear={bubbleIn(startOf(RIGHT_START, index))}
            />
          ))}
        </div>

        <Verdict cx={LX} scale={leftVerdict}>
          <ManualBadge />
        </Verdict>
        <Verdict cx={RX} scale={rightVerdict}>
          <VerdictBadge kind="pass" label="完全不用動手" />
        </Verdict>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
