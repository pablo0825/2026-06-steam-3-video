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
  BLACK,
  BLUE,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 7 頁 透明 Overlay（Celeste Spec）— 真實 gameplay 由剪輯軟體放下層
//   S16（0–240）：放射柔光 ＋ 置中標題群組（Spec 案例／Celeste／跳躍功能／黃線）
//   S17（240–780）：半透明黑遮罩 ＋ 置中深色半透明 Spec 文件卡

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: EASE };

// ── S16 標題 ──
const GLOW_IN = [0, 18] as const;
const TITLE_IN = [10, 38] as const;
const TITLE_OUT = [196, 222] as const;
const S16_END = 240 as const;

// ── S17 半透明黑 ＋ Spec 表格 ──
const VEIL_IN = [248, 276] as const;
const VEIL_OUT = [756, 780] as const;
const HEADING_IN = [284, 314] as const;
const ROW_START = [320, 372, 424, 476, 528, 580] as const;

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

export const Ch3Page7CelesteSpecOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S16 ──
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], ease);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  // ── S17 ──
  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const headingIn = interpolate(frame, HEADING_IN, [0, 1], ease);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* ── S16：標題 ── */}
      {frame < S16_END && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 1120,
              height: 620,
              borderRadius: "50%",
              opacity: glowOpacity,
              background: `radial-gradient(ellipse, ${withAlpha(BLACK, 0.7)} 0%, ${withAlpha(BLACK, 0.44)} 38%, ${withAlpha(BLACK, 0)} 72%)`,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${titleY}px)`,
              textShadow: `0 4px 24px ${withAlpha(BLACK, 0.5)}`,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 8,
                color: YELLOW,
              }}
            >
              Spec 案例
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 104,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 12,
                color: WHITE,
              }}
            >
              Celeste
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: 6,
                color: withAlpha(WHITE, 0.78),
              }}
            >
              跳躍功能
            </div>
            <div
              style={{
                marginTop: 30,
                width: 112,
                height: 6,
                borderRadius: 999,
                backgroundColor: YELLOW,
                boxShadow: `0 0 22px ${withAlpha(YELLOW, 0.42)}`,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── S17：半透明黑 ── */}
      {frame >= S16_END && (
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />
      )}

      {/* ── S17：深色半透明 Spec 文件卡（單一焦點，垂直置中） ── */}
      {frame >= S16_END && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: `translate(-50%, -50%) translateY(${interpolate(headingIn, [0, 1], [16, 0])}px)`,
            width: 1080,
            opacity: headingIn * infoOut,
            borderRadius: 22,
            overflow: "hidden",
            border: `1px solid ${withAlpha(WHITE, 0.14)}`,
            backgroundColor: withAlpha(BLACK, 0.82),
            boxShadow: `0 30px 70px ${withAlpha(BLACK, 0.5)}`,
          }}
        >
          {/* 檔名標題列 */}
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

          {/* 欄位列 */}
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
      )}
    </AbsoluteFill>
  );
};
