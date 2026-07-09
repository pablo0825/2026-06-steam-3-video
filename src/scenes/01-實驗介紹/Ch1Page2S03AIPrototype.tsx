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
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

// 第 1 集・第 2 頁・S03：AI → 程式/企劃/美術 → 聚合成可遊玩的遊戲原型（330 幀）
//   原本被拆成 S03(AI 出現)/S04(連三領域)/S05(聚合) 三顆，此處合併回單一連續鏡頭：
//   AI 置中彈入 → 上移到上方 → 線往下連三領域 → 三領域聚合到中央成 🎮。
const CONTENT_OUT = [315, 329] as const;

const AI_X = 960;
const AI_Y_CENTER = 540;
const AI_Y_TOP = 300;
const AI_R = 95;

const NODE_R = 78;
const DOMAIN_Y = 760;
const CENTER = { x: 960, y: 540 };

// AI 上移
const AI_MOVE = [48, 78] as const;
// 三領域聚合
const CONVERGE = [210, 258] as const;
const HUB_START = 245;

type Domain = {
  label: string;
  emoji: string;
  color: string;
  x: number;
  lineStart: number;
  iconStart: number;
};

const DOMAINS: Domain[] = [
  { label: "程式", emoji: "💻", color: CAT_CODE, x: 480, lineStart: 90, iconStart: 107 },
  { label: "企劃", emoji: "📋", color: CAT_PLAN, x: 960, lineStart: 118, iconStart: 135 },
  { label: "美術", emoji: "🎨", color: CAT_ART, x: 1440, lineStart: 146, iconStart: 163 },
];

export const Ch1Page2S03AIPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  // AI：置中彈入 → 上移到上方 → 聚合階段淡出。
  const aiIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const aiY = interpolate(frame, AI_MOVE, [AI_Y_CENTER, AI_Y_TOP], easeOutExpo);
  const aiOpacity =
    interpolate(frame, [0, 10], [0, 1], clamp) *
    interpolate(frame, [210, 245], [1, 0], clamp);

  // 三領域聚合進度、連線淡出。
  const converge = interpolate(frame, CONVERGE, [0, 1], easeStandard);
  const lineFade = interpolate(frame, [210, 228], [1, 0], clamp);

  // 🎮 hub。
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
        {/* AI 定位到上方後，線往下連三領域 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {DOMAINS.map((domain) => {
            const x1 = AI_X;
            const y1 = AI_Y_TOP + AI_R;
            const x2 = domain.x;
            const y2 = DOMAIN_Y - NODE_R;
            const len = Math.hypot(x2 - x1, y2 - y1);
            const progress = interpolate(
              frame,
              [domain.lineStart, domain.lineStart + 18],
              [0, 1],
              easeOutExpo,
            );

            return (
              <line
                key={domain.label}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={domain.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - progress)}
                opacity={0.6 * lineFade}
              />
            );
          })}
        </svg>

        {/* AI 節點 */}
        <div
          style={{
            position: "absolute",
            left: AI_X,
            top: aiY,
            width: AI_R * 2,
            height: AI_R * 2,
            marginLeft: -AI_R,
            marginTop: -AI_R,
            borderRadius: "50%",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WHITE,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: 2,
            transform: `scale(${aiIn})`,
            opacity: aiOpacity,
            boxShadow: `0 20px 50px ${withAlpha(BLUE, 0.35)}`,
          }}
        >
          AI
        </div>

        {/* 三領域節點：連線後彈入，聚合階段移向中央、縮小淡出 */}
        {DOMAINS.map((domain) => {
          const built = spring({
            frame: frame - domain.iconStart,
            fps,
            config: { damping: 11, stiffness: 130 },
          });
          const cx = interpolate(converge, [0, 1], [domain.x, CENTER.x]);
          const cy = interpolate(converge, [0, 1], [DOMAIN_Y, CENTER.y]);
          const scale = built * interpolate(converge, [0, 1], [1, 0.2]);
          const nodeFade = interpolate(frame, [234, 258], [1, 0], clamp);

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
                opacity: built <= 0 ? 0 : nodeFade,
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
                  opacity: interpolate(frame, [210, 224], [1, 0], clamp),
                }}
              >
                {domain.label}
              </div>
            </div>
          );
        })}

        {/* 聚合成 🎮 可遊玩的遊戲原型 */}
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
