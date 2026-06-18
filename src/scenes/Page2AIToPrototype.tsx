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
  CAT_ART,
  CAT_CODE,
  CAT_PLAN,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../theme/colors";

// 第 2 頁圖解（連續動畫）
//   S4：AI 節點出現 → 三條線依序畫出 → 程式 / 企劃 / 美術 依序彈入
//   S5：三個領域往中央聚合 → 合併成「可玩的原型 🎮」

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const CENTER = { x: 960, y: 540 };
const AI = { x: 960, y: 300 };
const AI_R = 95;
const NODE_R = 78;

// 聚合（S5）時間點
const CONV = 180; // 開始往中央聚合
const CONV_END = CONV + 42; // 聚合完成
const HUB = CONV + 35; // 手把出現

type Domain = {
  label: string;
  emoji: string;
  color: string;
  x: number;
  y: number;
  lineStart: number;
  iconStart: number;
};

const DOMAINS: Domain[] = [
  { label: "程式", emoji: "💻", color: CAT_CODE, x: 480, y: 760, lineStart: 25, iconStart: 42 },
  { label: "企劃", emoji: "📋", color: CAT_PLAN, x: 960, y: 760, lineStart: 60, iconStart: 77 },
  { label: "美術", emoji: "🎨", color: CAT_ART, x: 1440, y: 760, lineStart: 95, iconStart: 112 },
];

export const Page2AIToPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // AI 節點：進場彈入，聚合時淡出
  const aiIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const aiFadeOut = interpolate(frame, [CONV, CONV + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aiOpacity =
    interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) * aiFadeOut;

  // 手把（聚合結果）
  const hubScale = spring({
    frame: frame - HUB,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const hubVisible = frame >= HUB;
  const pulse = hubVisible ? 0.55 + 0.45 * Math.sin((frame - HUB) / 12) : 0;
  const labelProg = interpolate(frame, [HUB + 12, HUB + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineFade = interpolate(frame, [CONV, CONV + 18], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 連接線 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {DOMAINS.map((d) => {
          const x1 = AI.x;
          const y1 = AI.y + AI_R;
          const x2 = d.x;
          const y2 = d.y - NODE_R;
          const len = Math.hypot(x2 - x1, y2 - y1);
          const progress = interpolate(frame, [d.lineStart, d.lineStart + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <line
              key={d.label}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={d.color}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - progress)}
              opacity={lineFade}
            />
          );
        })}
      </svg>

      {/* AI 節點 */}
      <div
        style={{
          position: "absolute",
          left: AI.x,
          top: AI.y,
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

      {/* 三個領域節點（聚合時往中央收合並淡出） */}
      {DOMAINS.map((d) => {
        const built = spring({
          frame: frame - d.iconStart,
          fps,
          config: { damping: 11, stiffness: 130 },
        });
        const conv = interpolate(frame, [CONV, CONV_END], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        const cx = interpolate(conv, [0, 1], [d.x, CENTER.x]);
        const cy = interpolate(conv, [0, 1], [d.y, CENTER.y]);
        const scale = built * interpolate(conv, [0, 1], [1, 0.2]);
        const fade = interpolate(frame, [CONV + 24, CONV_END], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={d.label}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              width: NODE_R * 2,
              height: NODE_R * 2,
              marginLeft: -NODE_R,
              marginTop: -NODE_R,
              transform: `scale(${scale})`,
              opacity: (built <= 0 ? 0 : 1) * fade,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: WHITE,
                border: `5px solid ${d.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 68,
                boxShadow: `0 12px 30px ${withAlpha(BLACK, 0.08)}`,
              }}
            >
              {d.emoji}
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
                opacity: interpolate(frame, [CONV, CONV + 14], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {d.label}
            </div>
          </div>
        );
      })}

      {/* 聚合結果：可玩的原型 */}
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
              transform: `translate(-50%, ${interpolate(labelProg, [0, 1], [20, 0])}px)`,
              marginTop: 28,
              fontSize: 52,
              fontWeight: 800,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
              opacity: labelProg,
            }}
          >
            可遊玩的遊戲原型
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
