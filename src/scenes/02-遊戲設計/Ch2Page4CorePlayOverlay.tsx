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
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {...clamp, easing: EASE};

const S10_OUT = [184, 212] as const;
const S11_GLOW_IN = [220, 238] as const;
const S11_TITLE_IN = [230, 258] as const;
const S11_TITLE_OUT = [320, 350] as const;
const S12_VEIL_IN = [492, 516] as const;
const S12_HEADING_IN = [510, 540] as const;
const S12_ACTION_START = [548, 590, 632] as const;

const ACTIONS = [
  {emoji: "⬆️", label: "跳躍"},
  {emoji: "🧗", label: "攀牆"},
  {emoji: "💨", label: "衝刺"},
] as const;

export const Ch2Page4CorePlayOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const s10Opacity = interpolate(frame, S10_OUT, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: {damping: 14, stiffness: 110},
  });
  const definitionOpacity = interpolate(frame, [24, 54], [0, 1], clamp);
  const promptOpacity = interpolate(frame, [92, 114], [0, 1], clamp);
  const promptY = interpolate(frame, [92, 112], [30, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const s11TitleIn = interpolate(frame, S11_TITLE_IN, [0, 1], ease);
  const s11TitleOut = interpolate(frame, S11_TITLE_OUT, [1, 0], clamp);
  const s11TitleOpacity = s11TitleIn * s11TitleOut;
  const s11TitleY = interpolate(frame, S11_TITLE_IN, [18, 0], ease);
  const s11GlowOpacity =
    interpolate(frame, S11_GLOW_IN, [0, 1], clamp) * s11TitleOut;

  const veilOpacity = interpolate(frame, S12_VEIL_IN, [0, 0.54], clamp);
  const headingIn = interpolate(frame, S12_HEADING_IN, [0, 1], ease);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {frame < 220 && (
        <AbsoluteFill
          style={{
            backgroundColor: WHITE,
            opacity: s10Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEXT_DARK,
              transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
              opacity: titleIn,
            }}
          >
            核心玩法
          </div>
          <div
            style={{
              marginTop: 56,
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: definitionOpacity,
              whiteSpace: "nowrap",
            }}
          >
            玩家在遊戲中
            <span style={{color: YELLOW, fontWeight: 800}}>
              最常重複的動作
            </span>
          </div>
          <div
            style={{
              marginTop: 64,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 2,
              color: TEXT_DARK,
              background: CHIP_BG,
              padding: "18px 44px",
              borderRadius: 999,
              opacity: promptOpacity,
              transform: `translateY(${promptY}px)`,
              whiteSpace: "nowrap",
            }}
          >
            👀 觀察：哪些動作最常重複？
          </div>
        </AbsoluteFill>
      )}

      {frame >= 220 && frame < 350 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: s11TitleOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 1120,
              height: 620,
              borderRadius: "50%",
              opacity: s11GlowOpacity,
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
              transform: `translateY(${s11TitleY}px)`,
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
              核心玩法案例
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 112,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 8,
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
              2D Platformer
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

      {frame >= 492 && (
        <>
          <AbsoluteFill style={{backgroundColor: BLACK, opacity: veilOpacity}} />
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 235,
              transform: `translate(-50%, ${interpolate(
                headingIn,
                [0, 1],
                [16, 0],
              )}px)`,
              opacity: headingIn,
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: 4,
              color: WHITE,
              textShadow: `0 3px 18px ${withAlpha(BLACK, 0.45)}`,
              whiteSpace: "nowrap",
            }}
          >
            最常重複的 <span style={{color: YELLOW}}>3 個動作</span>
          </div>

          {ACTIONS.map((action, index) => {
            const progress = spring({
              frame: frame - S12_ACTION_START[index],
              fps,
              config: {damping: 16, stiffness: 130, mass: 0.8},
            });
            const y = 405 + index * 140;

            return (
              <div
                key={action.label}
                style={{
                  position: "absolute",
                  left: 720,
                  top: y,
                  width: 720,
                  minHeight: 104,
                  transform: `translate(-50%, -50%) translateY(${interpolate(
                    progress,
                    [0, 1],
                    [30, 0],
                  )}px) scale(${interpolate(progress, [0, 1], [0.97, 1])})`,
                  opacity: progress,
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  padding: "20px 58px",
                  boxSizing: "border-box",
                  borderRadius: 22,
                  backgroundColor: withAlpha(WHITE, 0.94),
                  border: `2px solid ${withAlpha(BORDER_LIGHT, 0.9)}`,
                  boxShadow: `0 18px 46px ${withAlpha(BLACK, 0.22)}`,
                }}
              >
                <div
                  style={{
                    width: 60,
                    flexShrink: 0,
                    fontSize: 46,
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  {action.emoji}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    fontSize: 48,
                    fontWeight: 800,
                    letterSpacing: 4,
                    color: TEXT_DARK,
                    whiteSpace: "nowrap",
                  }}
                >
                  {action.label}
                </div>
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
