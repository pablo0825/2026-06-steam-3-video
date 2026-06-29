import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  CARD_BORDER,
  DOT_RED,
  GREEN,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 7 頁・S17：Celeste jump-spec.md 透明 Overlay（540 幀）
//   外框採 S12 視窗 chrome：白底卡 + CARD_BORDER 邊框 + 三圓點標題列（淺色主題）。
const VEIL_IN = [8, 36] as const;
const VEIL_OUT = [516, 540] as const;
const HEADING_IN = [44, 74] as const;
const ROW_START = [80, 132, 184, 236, 288, 340] as const;

const AC_ITEMS = [
  "按下空白鍵會跳躍",
  "落地後可再次跳躍",
  "滯空時重複按鍵不會再次跳躍",
] as const;

type SpecRow = { field: string; content: React.ReactNode };
const SPEC_ROWS: SpecRow[] = [
  {
    field: "User Story",
    content: <>身為玩家，我想要控制角色跳上平台、越過障礙。</>,
  },
  {
    field: "Input / Output",
    content: <>按下空白鍵／角色向上跳躍，並受重力影響回到地面。</>,
  },
  {
    field: "Rules",
    content: <>角色接觸地面時才能跳躍；滯空時不可連續跳躍。</>,
  },
  {
    field: "Non-goals",
    content: <>不包含二段跳、攀牆與跳躍動畫。</>,
  },
  {
    field: "Acceptance Criteria",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {AC_ITEMS.map((t) => (
          <div
            key={t}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                flexShrink: 0,
                borderRadius: "50%",
                background: GREEN,
                color: WHITE,
                fontSize: 18,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
  { field: "Notes", content: <>無。</> },
];

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{ width: 13, height: 13, borderRadius: "50%", background: color }}
  />
);

export const Ch3Page7S17CelesteSpecOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.78], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const headingIn = interpolate(frame, HEADING_IN, [0, 1], easeStandard);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          transform: `translate(-50%, -50%) translateY(${interpolate(
            headingIn,
            [0, 1],
            [16, 0],
          )}px)`,
          width: 1080,
          opacity: headingIn * infoOut,
          borderRadius: 22,
          overflow: "hidden",
          background: WHITE,
          border: `3px solid ${CARD_BORDER}`,
          boxShadow: `0 30px 70px ${withAlpha(BLACK, 0.5)}`,
        }}
      >
        {/* 標題列：三圓點 + 視窗名稱（S12 chrome） */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 22px",
            background: WINDOW_BAR,
            borderBottom: `1px solid ${CARD_BORDER}`,
          }}
        >
          <Dot color={DOT_RED} />
          <Dot color={YELLOW} />
          <Dot color={GREEN} />
          <div
            style={{
              marginLeft: 12,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 0.5,
              color: TEXT_DARK,
            }}
          >
            jump-spec.md
          </div>
        </div>

        <div style={{ padding: "0 36px" }}>
          {SPEC_ROWS.map((row, index) => {
            const progress = spring({
              frame: frame - ROW_START[index],
              fps,
              config: { damping: 18, stiffness: 120, overshootClamping: true },
            });
            return (
              <div
                key={row.field}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 28,
                  padding: "18px 0",
                  borderBottom:
                    index < SPEC_ROWS.length - 1
                      ? `1px solid ${withAlpha(TEXT_DARK, 0.1)}`
                      : "none",
                  opacity: progress * infoOut,
                  transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 250,
                    flexShrink: 0,
                    paddingTop: 2,
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    color: SUBTLE,
                  }}
                >
                  {row.field}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 30,
                    fontWeight: 600,
                    lineHeight: 1.45,
                    color: TEXT_DARK,
                  }}
                >
                  {row.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
