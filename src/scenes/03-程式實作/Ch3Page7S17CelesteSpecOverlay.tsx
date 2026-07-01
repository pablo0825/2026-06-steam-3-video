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
  NEUTRAL_50,
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
//   開場先出貼底黑條（出處條）並淡出，空檔停留後 veil 才淡入；結尾淡入白底銜接 S18。
const BAR_OUT = [48, 72] as const; // 開場黑條全程存在，72 前淡出完全消失
const VEIL_IN = [100, 128] as const; // 空檔停留後，半透明黑幕才淡入
const HEADING_IN = [136, 166] as const;
const ROW_START = [172, 224, 276, 328, 380, 432] as const;
const END_FILL = [498, 526] as const; // 結尾淡入滿版 NEUTRAL_50，無縫接 S18

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

  const veilOpacity = interpolate(frame, VEIL_IN, [0, 0.78], clamp);
  // 結尾淡入滿版白底，蓋掉遊戲畫面與卡片，停在純白銜接 S18（NEUTRAL_50）
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);
  // 開場即滿版存在（不淡入），停留後淡出，空檔後 veil 才淡入
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);
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
          opacity: headingIn,
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
                  opacity: progress,
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

      {/* 開場貼底黑條（出處條）：開場即存在、停留後淡出，空檔後 veil 才淡入 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: withAlpha(BLACK, 0.82),
          opacity: barOpacity,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          此影片僅用於教學實驗上
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          蔚藍 Celeste
        </div>
      </div>

      {/* 結尾淡入滿版白底，與下一支 S18（NEUTRAL_50）無縫銜接 */}
      <AbsoluteFill
        style={{ backgroundColor: NEUTRAL_50, opacity: endFill }}
      />
    </AbsoluteFill>
  );
};
