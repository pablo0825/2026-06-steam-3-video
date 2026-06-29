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
  BLUE,
  CAT_ART,
  CAT_CODE,
  CAT_PLAN,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 1 集・第 2 頁・S05：三領域聚合成可遊玩的遊戲原型（90 幀）
const CONTENT_OUT = [76, 90] as const;
const CENTER = { x: 960, y: 540 };
const NODE_R = 78;
const CONVERGE = [0, 42] as const;
const HUB_START = 35;

const DOMAINS = [
  { label: "程式", emoji: "💻", color: CAT_CODE, x: 480, y: 760 },
  { label: "企劃", emoji: "📋", color: CAT_PLAN, x: 960, y: 760 },
  { label: "美術", emoji: "🎨", color: CAT_ART, x: 1440, y: 760 },
] as const;

export const Ch1Page2S05PlayablePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const converge = interpolate(frame, CONVERGE, [0, 1], easeStandard);
  const hubScale = spring({
    frame: frame - HUB_START,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const hubVisible = frame >= HUB_START;
  const pulse = hubVisible ? 0.55 + 0.45 * Math.sin((frame - HUB_START) / 12) : 0;
  const labelProgress = interpolate(frame, [HUB_START + 12, HUB_START + 30], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        {DOMAINS.map((domain) => {
          const cx = interpolate(converge, [0, 1], [domain.x, CENTER.x]);
          const cy = interpolate(converge, [0, 1], [domain.y, CENTER.y]);
          const scale = interpolate(converge, [0, 1], [1, 0.2]);
          const fade = interpolate(frame, [24, 42], [1, 0], clamp);

          return (
            <div
              key={domain.label}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                width: NODE_R * 2,
                height: NODE_R * 2,
                marginLeft: -NODE_R,
                marginTop: -NODE_R,
                transform: `scale(${scale})`,
                opacity: fade,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: WHITE,
                  border: `5px solid ${domain.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 68,
                  boxShadow: `0 12px 30px ${withAlpha(BLACK, 0.08)}`,
                }}
              >
                {domain.emoji}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 18,
                  fontSize: 40,
                  fontWeight: 700,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                  opacity: interpolate(frame, [0, 14], [1, 0], clamp),
                }}
              >
                {domain.label}
              </div>
            </div>
          );
        })}

        {hubVisible && (
          <div
            style={{
              position: "absolute",
              left: CENTER.x,
              top: CENTER.y,
              transform: `translate(-50%, -50%) scale(${hubScale})`,
            }}
          >
            <div
              style={{
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: WHITE,
                border: `6px solid ${BLUE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 130,
                boxShadow: `0 0 ${40 + pulse * 45}px ${withAlpha(BLUE, 0.22 + pulse * 0.25)}`,
              }}
            >
              🎮
            </div>
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: `translate(-50%, ${interpolate(labelProgress, [0, 1], [20, 0])}px)`,
                marginTop: 28,
                fontSize: 52,
                fontWeight: 800,
                color: TEXT_DARK,
                whiteSpace: "nowrap",
                opacity: labelProgress,
              }}
            >
              可遊玩的遊戲原型
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
