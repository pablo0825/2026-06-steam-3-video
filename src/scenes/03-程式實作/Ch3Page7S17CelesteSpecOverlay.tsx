import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, BLUE, WHITE, YELLOW, withAlpha } from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 7 頁・S17：Celeste jump-spec.md 透明 Overlay（540 幀）
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
            <span style={{ color: YELLOW, fontWeight: 900 }}>☑</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
  { field: "Notes", content: <>無。</> },
];

export const Ch3Page7S17CelesteSpecOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
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
          border: `1px solid ${withAlpha(WHITE, 0.14)}`,
          backgroundColor: withAlpha(BLACK, 0.82),
          boxShadow: `0 30px 70px ${withAlpha(BLACK, 0.5)}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 30px",
            color: WHITE,
            backgroundColor: BLUE,
          }}
        >
          <svg width="26" height="32" viewBox="0 0 34 40" aria-hidden="true">
            <path
              d="M5 2h16l8 8v28H5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M21 2v9h8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 0.5 }}>
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
                      ? `1px solid ${withAlpha(WHITE, 0.1)}`
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
                    color: withAlpha(WHITE, 0.6),
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
                    color: WHITE,
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
