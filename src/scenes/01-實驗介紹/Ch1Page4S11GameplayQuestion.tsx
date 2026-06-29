import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  BLUE,
  BORDER_LIGHT,
  CHIP_BG,
  NEUTRAL_50,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
  YELLOW,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 1 集・第 4 頁・S11：想驗證的核心玩法問題（430 幀）
const VIDEO = staticFile("01-實驗介紹/prototype-demo.mp4");
const VIDEO_VOLUME = 0.25;
const CONTENT_OUT = [408, 430] as const;
const VIDEO_HEIGHT = 900;
const VIDEO_WIDTH = Math.round((VIDEO_HEIGHT * 714) / 1270);
const VIDEO_Y = 565;
const VIDEO_X_CENTER = 960;
const VIDEO_X_LEFT = 620;
const SHIFT = [0, 30] as const;
const FLAW_X = 920;
const FLAW_LEAD_START = 40;
const FLAW_ITEM_START = [64, 86] as const;
const FLAW_OUT = [165, 188] as const;
const CORE_START = 185;
const COL_X = 1400;
const Q_START = 360;

const FLAWS: { text: string; y: number }[] = [
  { text: "素材風格不一致", y: 410 },
  { text: "還沒有 UI", y: 540 },
];

const STEPS = [
  { label: "觀察機關規律", color: BLUE, start: 205 },
  { label: "抓準時機出手", color: YELLOW, start: 245 },
  { label: "一次定生死", color: RED, start: 285 },
] as const;

export const Ch1Page4S11GameplayQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const videoX = interpolate(frame, SHIFT, [VIDEO_X_CENTER, VIDEO_X_LEFT], easeStandard);
  const videoScale = interpolate(frame, SHIFT, [1.06, 1], easeStandard);
  const chipOpacity = interpolate(frame, [0, 15], [0, 1], clamp);
  const flawOut = interpolate(frame, FLAW_OUT, [1, 0], clamp);
  const flawLeadIn = spring({
    frame: frame - FLAW_LEAD_START,
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const headingIn = spring({
    frame: frame - CORE_START,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const questionIn = spring({
    frame: frame - Q_START,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: "absolute",
            left: videoX,
            top: VIDEO_Y,
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
            marginLeft: -VIDEO_WIDTH / 2,
            marginTop: -VIDEO_HEIGHT / 2,
            transform: `scale(${videoScale})`,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: `0 24px 60px ${withAlpha(BLACK, 0.18)}`,
            border: `1px solid ${BORDER_LIGHT}`,
            backgroundColor: BLACK,
          }}
        >
          <OffthreadVideo
            src={VIDEO}
            startFrom={150}
            volume={VIDEO_VOLUME}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: videoX,
            top: VIDEO_Y - VIDEO_HEIGHT / 2 - 55,
            transform: "translateX(-50%)",
            opacity: chipOpacity,
            background: CHIP_BG,
            color: TEXT_DARK,
            fontSize: 34,
            fontWeight: 700,
            padding: "10px 30px",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          我的原型
        </div>

        <div
          style={{
            position: "absolute",
            left: FLAW_X,
            top: 250,
            opacity: flawLeadIn * flawOut,
            transform: `translateX(${interpolate(flawLeadIn, [0, 1], [20, 0])}px)`,
            fontSize: 32,
            fontWeight: 800,
            color: SUBTLE,
            letterSpacing: 1,
            whiteSpace: "nowrap",
          }}
        >
          完整度不高
        </div>
        {FLAWS.map((flaw, index) => {
          const itemIn = spring({
            frame: frame - FLAW_ITEM_START[index],
            fps,
            config: { damping: 16, stiffness: 140 },
          });

          return (
            <div
              key={flaw.text}
              style={{
                position: "absolute",
                left: FLAW_X,
                top: flaw.y,
                opacity: itemIn * flawOut,
                transform: `translateX(${interpolate(itemIn, [0, 1], [24, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ color: SUBTLE, fontSize: 30, fontWeight: 800 }}>◀</span>
              <span
                style={{
                  background: CHIP_BG,
                  color: SUBTLE,
                  border: `1px solid ${BORDER_LIGHT}`,
                  fontSize: 30,
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: 14,
                  whiteSpace: "nowrap",
                }}
              >
                {flaw.text}
              </span>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: COL_X,
            top: 150,
            transform: `translate(-50%, ${interpolate(headingIn, [0, 1], [20, 0])}px)`,
            opacity: headingIn,
            fontSize: 40,
            fontWeight: 800,
            color: SUBTLE,
            letterSpacing: 2,
          }}
        >
          核心玩法
        </div>

        {STEPS.map((step, index) => {
          const stepIn = spring({
            frame: frame - step.start,
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          const y = 290 + index * 150;
          const arrowOpacity = interpolate(frame, [step.start - 12, step.start], [0, 1], clamp);

          return (
            <React.Fragment key={step.label}>
              {index > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: COL_X,
                    top: y - 75,
                    transform: "translate(-50%, -50%)",
                    opacity: arrowOpacity,
                    color: SUBTLE,
                    fontSize: 46,
                    fontWeight: 800,
                  }}
                >
                  ↓
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  left: COL_X,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${stepIn})`,
                  opacity: stepIn <= 0 ? 0 : 1,
                  background: WHITE,
                  border: `4px solid ${step.color}`,
                  color: TEXT_DARK,
                  fontSize: 48,
                  fontWeight: 800,
                  padding: "18px 44px",
                  borderRadius: 18,
                  whiteSpace: "nowrap",
                  boxShadow: `0 10px 24px ${withAlpha(BLACK, 0.06)}`,
                }}
              >
                {step.label}
              </div>
            </React.Fragment>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: COL_X,
            top: 700,
            transform: `translate(-50%, ${interpolate(questionIn, [0, 1], [20, 0])}px)`,
            opacity: questionIn,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: SUBTLE, marginBottom: 18 }}>
            想驗證的是
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.4, whiteSpace: "nowrap" }}>
            這樣好玩嗎？
            <br />
            會讓人想一直玩嗎？
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
