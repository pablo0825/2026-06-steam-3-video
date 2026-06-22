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
  NEUTRAL_300,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 3 頁 透明 Overlay（節奏醫生）— 真實 gameplay 由剪輯軟體放下層
//   S06（0–240）：放射柔光 ＋ 置中標題群組（User Story 案例／節奏醫生／Rhythm Doctor／黃線）
//   S07（240–840）：半透明黑遮罩 ＋ 填好的 User Story 三列

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: EASE };
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

// ── S06 標題 ──
const GLOW_IN = [0, 18] as const;
const TITLE_IN = [10, 38] as const;
const TITLE_OUT = [196, 222] as const;

// ── S07 半透明黑 ──
const VEIL_IN = [248, 276] as const;
const VEIL_OUT = [810, 840] as const;

// ── S07 User Story 三列 ──
const US_HEADING_IN = [300, 330] as const;
const ROW_START = [340, 400, 460] as const;
const STORY_ROWS: { tag: string; node: React.ReactNode }[] = [
  { tag: "身為一位", node: <>玩家</> },
  {
    tag: "我想要",
    node: (
      <>
        在<span style={KEY}>第七拍</span>按下<span style={KEY}>空白鍵</span>
      </>
    ),
  },
  { tag: "為了", node: <>配合節奏救活病人，完成關卡</> },
];

export const Ch3Page3RhythmDoctorOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── S06 ──
  const titleIn = interpolate(frame, TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, TITLE_IN, [18, 0], ease);
  const glowOpacity = interpolate(frame, GLOW_IN, [0, 1], clamp) * titleOut;

  // ── S07 共用 ──
  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.6], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const infoOut = interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const headingIn = interpolate(frame, US_HEADING_IN, [0, 1], ease);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* ── S06：標題 ── */}
      {frame < 240 && (
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
              User Story 案例
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
              節奏醫生
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
              Rhythm Doctor
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

      {/* ── S07：半透明黑 ── */}
      {frame >= 240 && (
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />
      )}

      {/* ── S07：User Story 三列 ── */}
      {frame >= 240 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 330,
              transform: `translate(-50%, ${interpolate(
                headingIn,
                [0, 1],
                [16, 0],
              )}px)`,
              opacity: headingIn * infoOut,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 4,
              color: WHITE,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
              whiteSpace: "nowrap",
            }}
          >
            寫成 <span style={{ color: YELLOW }}>User Story</span>
          </div>

          {STORY_ROWS.map((row, index) => {
            const progress = spring({
              frame: frame - ROW_START[index],
              fps,
              config: {
                damping: 18,
                stiffness: 120,
                overshootClamping: true,
              },
            });
            const y = 455 + index * 115;

            return (
              <div
                key={row.tag}
                style={{
                  position: "absolute",
                  left: 960,
                  top: y,
                  width: 1080,
                  transform: `translate(-50%, -50%) translateY(${interpolate(
                    progress,
                    [0, 1],
                    [28, 0],
                  )}px)`,
                  opacity: progress * infoOut,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  textShadow: `0 3px 18px ${withAlpha(BLACK, 0.5)}`,
                }}
              >
                <div
                  style={{
                    width: 200,
                    flexShrink: 0,
                    textAlign: "center",
                    padding: "14px 0",
                    borderRadius: 14,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: TEXT_DARK,
                    backgroundColor: NEUTRAL_300,
                    boxShadow: `0 10px 24px ${withAlpha(BLACK, 0.2)}`,
                    textShadow: "none",
                  }}
                >
                  {row.tag}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    fontSize: 46,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: WHITE,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.node}
                </div>
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
