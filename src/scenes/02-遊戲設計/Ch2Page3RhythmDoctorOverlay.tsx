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
  BORDER_LIGHT,
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const S7_TITLE_IN = [10, 38] as const;
const S7_TITLE_OUT = [96, 126] as const;
const S8_VEIL_IN = [150, 174] as const;
const S8_HEADING_IN = [180, 210] as const;
const S8_LABEL_START = [222, 264, 306] as const;
const S8_INFO_OUT = [444, 468] as const;
const S8_VEIL_OUT = [456, 488] as const;
const S9_BACKGROUND_IN = [456, 488] as const;

const CON_RISE = [488, 518] as const;
const CON_MOVE = [556, 586] as const;
const ARROW_IN = [590, 614] as const;
const INSPIRE_IN = [612, 644] as const;
const CAP_IN = [652, 678] as const;
const CON_X_CENTER = 960;
const CON_X_LEFT = 720;
const ARROW_X = 970;
const INSPIRE_X = 1200;
const S9_LINE_Y = 505;
const S9_CAP_Y = 615;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {...clamp, easing: EASE};
const KEY: React.CSSProperties = {color: YELLOW, fontWeight: 800};

const LABELS: {emoji: string; node: React.ReactNode}[] = [
  {
    emoji: "⌨️",
    node: (
      <>
        節奏到<span style={KEY}>第 7 拍</span>，按下空白鍵
      </>
    ),
  },
  {
    emoji: "☝️",
    node: (
      <>
        全程只靠<span style={KEY}>一個按鍵</span>
      </>
    ),
  },
  {
    emoji: "🎯",
    node: (
      <>
        注意力集中在<span style={KEY}>節拍 × 時間</span>
      </>
    ),
  },
];

export const Ch2Page3RhythmDoctorOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleIn = interpolate(frame, S7_TITLE_IN, [0, 1], ease);
  const titleOut = interpolate(frame, S7_TITLE_OUT, [1, 0], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleY = interpolate(frame, S7_TITLE_IN, [18, 0], ease);
  const glowIn = interpolate(frame, [0, 18], [0, 1], clamp);

  const veilOpacity =
    interpolate(frame, S8_VEIL_IN, [0, 0.54], clamp) *
    interpolate(frame, S8_VEIL_OUT, [1, 0], clamp);
  const headingIn = interpolate(frame, S8_HEADING_IN, [0, 1], ease);
  const infoOut = interpolate(frame, S8_INFO_OUT, [1, 0], clamp);
  const s9BackgroundOpacity = interpolate(
    frame,
    S9_BACKGROUND_IN,
    [0, 1],
    clamp,
  );

  const conRise = interpolate(frame, CON_RISE, [0, 1], clamp);
  const conRiseY = interpolate(frame, CON_RISE, [50, 0], ease);
  const conX = interpolate(frame, CON_MOVE, [CON_X_CENTER, CON_X_LEFT], ease);
  const arrowIn = interpolate(frame, ARROW_IN, [0, 1], clamp);
  const inspireOp = interpolate(frame, INSPIRE_IN, [0, 1], clamp);
  const inspireY = interpolate(frame, INSPIRE_IN, [40, 0], ease);
  const capOp = interpolate(frame, CAP_IN, [0, 1], clamp);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {frame < 150 && (
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
              opacity: glowIn,
              background: `radial-gradient(ellipse, ${withAlpha(BLACK, 0.7)} 0%, ${withAlpha(
                BLACK,
                0.44,
              )} 38%, ${withAlpha(BLACK, 0)} 72%)`,
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
              限制設計案例
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

      {frame >= 150 && frame < 489 && (
        <>
          <AbsoluteFill style={{backgroundColor: BLACK, opacity: veilOpacity}} />
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 220,
              transform: `translate(-50%, ${interpolate(
                headingIn,
                [0, 1],
                [16, 0],
              )}px)`,
              opacity: headingIn * infoOut,
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: 4,
              color: WHITE,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.45)}`,
              whiteSpace: "nowrap",
            }}
          >
            它的「<span style={{color: YELLOW}}>限制</span>」在哪？
          </div>

          {LABELS.map((label, index) => {
            const progress = spring({
              frame: frame - S8_LABEL_START[index],
              fps,
              config: {damping: 16, stiffness: 130, mass: 0.8},
            });
            const y = 400 + index * 150;

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: 960,
                  top: y,
                  width: 900,
                  minHeight: 104,
                  transform: `translate(-50%, -50%) translateY(${interpolate(
                    progress,
                    [0, 1],
                    [30, 0],
                  )}px) scale(${interpolate(progress, [0, 1], [0.97, 1])})`,
                  opacity: progress * infoOut,
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  padding: "20px 42px 20px 80px",
                  boxSizing: "border-box",
                  borderRadius: 22,
                  backgroundColor: withAlpha(WHITE, 0.94),
                  border: `2px solid ${withAlpha(BORDER_LIGHT, 0.9)}`,
                  boxShadow: `0 18px 46px ${withAlpha(BLACK, 0.22)}`,
                }}
              >
                <div
                  style={{
                    width: 52,
                    flexShrink: 0,
                    fontSize: 42,
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  {label.emoji}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    paddingRight: 68,
                    fontSize: 42,
                    fontWeight: 650,
                    letterSpacing: 2,
                    color: TEXT_DARK,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label.node}
                </div>
              </div>
            );
          })}
        </>
      )}

      {frame >= S9_BACKGROUND_IN[0] && (
        <AbsoluteFill
          style={{
            backgroundColor: WHITE,
            opacity: s9BackgroundOpacity,
          }}
        />
      )}

      {frame >= 482 && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: conX,
              top: S9_LINE_Y,
              transform: `translate(-50%, calc(-50% + ${conRiseY}px))`,
              opacity: conRise,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 2,
              color: TEXT_DARK,
              background: CHIP_BG,
              padding: "16px 44px",
              borderRadius: 20,
              whiteSpace: "nowrap",
            }}
          >
            有約束
          </div>

          <div
            style={{
              position: "absolute",
              left: ARROW_X,
              top: S9_LINE_Y,
              transform: "translate(-50%, -50%)",
              opacity: arrowIn,
              fontSize: 60,
              fontWeight: 800,
              color: SUBTLE,
            }}
          >
            →
          </div>

          <div
            style={{
              position: "absolute",
              left: INSPIRE_X,
              top: S9_LINE_Y,
              transform: `translate(-50%, calc(-50% + ${inspireY}px))`,
              opacity: inspireOp,
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: 4,
              color: YELLOW,
              whiteSpace: "nowrap",
            }}
          >
            激發靈感
          </div>

          <div
            style={{
              position: "absolute",
              left: 960,
              top: S9_CAP_Y,
              transform: "translateX(-50%)",
              opacity: capOp,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            限制設計，是不錯的發想方法
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
