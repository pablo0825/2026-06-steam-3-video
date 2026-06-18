import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  BLUE,
  CHIP_BG,
  GREEN,
  HAIRLINE,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
  YELLOW,
} from "../theme/colors";

// 第 3 頁：什麼是遊戲原型
//   S6+S7：問句「遊戲原型 ＝ ？」彈出 → 周圍放射飄出定義詞
//   S8：💡想法 →（最快的方法）→ 🎮可玩的版本
//   S9：「完成遊戲 ✗」淡出 / 「驗證問題 ✓」放大

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// ── S6 + S7：問句 + 放射定義詞 ──────────────────────────────
const QuestionWords: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const qIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const markPulse = 1 + 0.08 * Math.sin(frame / 10);

  const cx = 960;
  const cy = 540;
  const R = 430;
  const words = ["草圖", "紙上原型", "可玩 demo", "概念驗證", "測試版", "電子原型"];

  return (
    <AbsoluteFill>
      {words.map((w, i) => {
        const ang = ((-90 + (i * 360) / words.length) * Math.PI) / 180;
        const tx = cx + Math.cos(ang) * R;
        const ty = cy + Math.sin(ang) * R;
        const p = interpolate(frame, [48 + i * 7, 48 + i * 7 + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE,
        });
        const x = interpolate(p, [0, 1], [cx, tx]);
        const y = interpolate(p, [0, 1], [cy, ty]);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              opacity: p,
              background: CHIP_BG,
              color: SUBTLE,
              fontSize: 36,
              fontWeight: 600,
              padding: "12px 26px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {w}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${qIn})`,
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontSize: 100,
          fontWeight: 800,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        遊戲原型
        <span style={{ color: SUBTLE, fontWeight: 500 }}>＝</span>
        <span style={{ color: YELLOW, transform: `scale(${markPulse})`, display: "inline-block" }}>
          ？
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── S8：最快的捷徑 ─────────────────────────────────────────
const ShortcutPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const left = { x: 360, y: 520 };
  const right = { x: 1560, y: 520 };
  const NR = 92;

  const ideaIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const playIn = spring({ frame: frame - 48, fps, config: { damping: 11, stiffness: 130 } });

  const GAP = 44; // 線/箭頭與圓形之間留白，避免箭頭被圓形蓋住
  const lineStartX = left.x + NR + GAP;
  const lineEndX = right.x - NR - GAP;
  const lineP = interpolate(frame, [22, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const tipX = interpolate(lineP, [0, 1], [lineStartX, lineEndX]);
  const midX = (lineStartX + lineEndX) / 2;

  const labelOp = interpolate(frame, [28, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const skipOp = interpolate(frame, [58, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Node: React.FC<{ x: number; emoji: string; label: string; color: string; scale: number }> = ({
    x,
    emoji,
    label,
    color,
    scale,
  }) => (
    <div style={{ position: "absolute", left: x, top: left.y, marginLeft: -NR, marginTop: -NR, width: NR * 2, height: NR * 2, transform: `scale(${scale})`, opacity: scale <= 0 ? 0 : 1 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: WHITE, border: `5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, boxShadow: `0 12px 30px ${withAlpha(BLACK, 0.08)}` }}>
        {emoji}
      </div>
      <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 18, fontSize: 38, fontWeight: 700, color: TEXT_DARK, whiteSpace: "nowrap" }}>
        {label}
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      {/* 捷徑虛線 + 箭頭 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {lineP > 0 && (
          <line
            x1={lineStartX}
            y1={left.y}
            x2={tipX}
            y2={left.y}
            stroke={BLUE}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="20 16"
          />
        )}
        {lineP > 0.05 && (
          <polygon
            points={`${tipX},${left.y - 16} ${tipX + 26},${left.y} ${tipX},${left.y + 16}`}
            fill={BLUE}
          />
        )}
      </svg>

      <Node x={left.x} emoji="💡" label="想法" color={YELLOW} scale={ideaIn} />
      <Node x={right.x} emoji="🎮" label="可玩的版本" color={BLUE} scale={playIn} />

      {/* 最快的方法（線上方） */}
      <div style={{ position: "absolute", left: midX, top: left.y - 96, transform: "translate(-50%, -50%)", opacity: labelOp, color: BLUE, fontSize: 40, fontWeight: 800, whiteSpace: "nowrap" }}>
        最快的方法
      </div>

      {/* 略過完整製作（線下方） */}
      <div style={{ position: "absolute", left: midX, top: left.y + 92, transform: "translate(-50%, -50%)", opacity: skipOp, display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
        <span style={{ color: SUBTLE, fontSize: 30 }}>略過</span>
        <span style={{ color: SUBTLE, fontSize: 34, fontWeight: 600 }}>完整製作</span>
      </div>
    </AbsoluteFill>
  );
};

// ── S9：不是完成，而是驗證 ─────────────────────────────────
const Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftIn = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  const rightIn = spring({ frame: frame - 8, fps, config: { damping: 13, stiffness: 120 } });

  const leftDim = interpolate(frame, [45, 75], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightGrow = interpolate(frame, [45, 75], [1, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const stamp = spring({ frame: frame - 52, fps, config: { damping: 9, stiffness: 140 } });

  const Card: React.FC<{
    x: number;
    cap: string;
    capColor: string;
    title: string;
    mark: string;
    markColor: string;
    scale: number;
    opacity: number;
    borderColor: string;
  }> = ({ x, cap, capColor, title, mark, markColor, scale, opacity, borderColor }) => (
    <div style={{ position: "absolute", left: x, top: 520, transform: `translate(-50%, -50%) scale(${scale})`, opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 36, fontWeight: 700, color: capColor, marginBottom: 24 }}>{cap}</div>
      <div style={{ width: 460, height: 300, borderRadius: 32, background: WHITE, border: `5px solid ${borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.08)}` }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: markColor, lineHeight: 1 }}>{mark}</div>
        <div style={{ fontSize: 54, fontWeight: 800, color: TEXT_DARK }}>{title}</div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <Card x={620} cap="目的不是" capColor={SUBTLE} title="完成遊戲" mark="✗" markColor={RED} scale={leftIn} opacity={leftIn * leftDim} borderColor={HAIRLINE} />
      <Card x={1300} cap="而是" capColor={GREEN} title="驗證問題" mark="✓" markColor={GREEN} scale={rightIn * rightGrow} opacity={rightIn} borderColor={GREEN} />

      {/* 右卡上的「重點」印章 */}
      {stamp > 0 && (
        <div style={{ position: "absolute", left: 1300 + 200, top: 520 - 150, transform: `translate(-50%, -50%) rotate(-12deg) scale(${stamp})`, background: GREEN, color: WHITE, fontSize: 30, fontWeight: 800, padding: "10px 22px", borderRadius: 12 }}>
          重點
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── 主場景 ─────────────────────────────────────────────────
export const Page3Prototype: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      <Sequence durationInFrames={180}>
        <QuestionWords />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <ShortcutPath />
      </Sequence>
      <Sequence from={360} durationInFrames={180}>
        <Comparison />
      </Sequence>
    </AbsoluteFill>
  );
};
