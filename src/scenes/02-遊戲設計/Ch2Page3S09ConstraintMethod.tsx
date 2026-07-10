import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FIGURE,
  NEUTRAL_50,
  NEUTRAL_300,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 2 集・第 3 頁・S09：限制＝激發靈感（281 幀）
//   開場先停留空白底一拍 → 設計師淡入、獨自停留一拍 → 虛線框從大收緊框住他 →
//   設計師搖晃、微縮 → 臨界爆發（放大＋黃光）、框被撐開一下後消失 →
//   6 張玩法小卡片自中心噴出 → 整體淡出，結尾留幾格乾淨的米白底。
const CENTER_X = 960;
const CENTER_Y = 500;

// 開場空白底停留的幀數；設計師的進場以「扣掉停留後的幀」為基準。
const OPENING_HOLD = 15;
// 設計師先獨自停留這麼多幀，虛線框之後的所有動作才起跑。
const FRAME_DELAY = 15;

// 時間軸
const DESIGNER_IN = [0, 16] as const;
const FRAME_OPACITY_IN = [16, 40] as const;
const SHRINK = [30, 116] as const; // 框收緊 / 設計師張力累積
const BURST_AT = 116; // 爆發時點
const FLY_START = 126; // 卡片開始噴出
const FLY_STAGGER = 3;
// 最後一格是 280；淡出提早 8 格歸零，尾巴留一拍空白底。
const CONTENT_OUT = [218, 242] as const;

// 6 張玩法小卡片（中心相對座標＋旋轉）
const CARDS = [
  { emoji: "🕹️", text: "只用一個按鍵", x: -600, y: -250, r: -6 },
  { emoji: "⏱️", text: "限時 10 秒", x: 600, y: -255, r: 5 },
  { emoji: "⬛", text: "只有黑與白", x: -720, y: 20, r: -4 },
  { emoji: "🚫", text: "不能跳躍", x: 680, y: 25, r: 4 },
  { emoji: "🔄", text: "畫面無法回頭", x: -560, y: 290, r: 5 },
  { emoji: "📺", text: "只有一格螢幕", x: 580, y: 300, r: -5 },
] as const;

export const Ch2Page3S09ConstraintMethod: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 扣掉開場停留：f < 0 的期間所有動畫都還沒起跑，畫面維持空白底。
  const f = frame - OPENING_HOLD;
  // 虛線框之後的所有動作再延後一拍，讓設計師先獨自站一會兒。
  const fb = f - FRAME_DELAY;

  const contentOut = interpolate(fb, CONTENT_OUT, [1, 0], clamp);

  // 設計師進場（淡入＋微放大）
  const dInOp = interpolate(f, DESIGNER_IN, [0, 1], clamp);
  const dInScale = interpolate(f, DESIGNER_IN, [0.6, 1], easeStandard);

  // 搖晃：sin 震盪 × 張力包絡（越接近爆發越大），爆發時收斂
  const tension = interpolate(fb, [72, BURST_AT], [0, 1], clamp);
  const shakeWindow = interpolate(fb, [BURST_AT, BURST_AT + 8], [1, 0], clamp);
  const osc = Math.sin((fb - 44) * 0.85);
  const shakeX = osc * 16 * tension * shakeWindow;
  const shakeRot = osc * 5 * tension * shakeWindow;

  // 設計師 scale：跟著框收緊被壓縮（1→0.82）→ 爆發 1.25 → 回 1
  const dReact =
    fb < BURST_AT
      ? interpolate(fb, [96, BURST_AT], [1, 0.82], easeStandard)
      : fb < BURST_AT + 12
        ? interpolate(fb, [BURST_AT, BURST_AT + 12], [0.82, 1.25], easeStandard)
        : interpolate(
            fb,
            [BURST_AT + 12, BURST_AT + 36],
            [1.25, 1],
            easeStandard,
          );
  const glow =
    interpolate(fb, [BURST_AT, BURST_AT + 12], [0, 1], clamp) *
    interpolate(fb, [BURST_AT + 12, BURST_AT + 36], [1, 0], clamp);

  // 虛線框：收緊（900→320）→ 爆發撐開（320→370）→ 淡出
  const frameW =
    fb < BURST_AT
      ? interpolate(fb, SHRINK, [1040, 400], easeStandard)
      : interpolate(fb, [BURST_AT, BURST_AT + 8], [400, 460], easeStandard);
  const frameH =
    fb < BURST_AT
      ? interpolate(fb, SHRINK, [650, 400], easeStandard)
      : interpolate(fb, [BURST_AT, BURST_AT + 8], [400, 460], easeStandard);
  const frameOpacity =
    interpolate(fb, FRAME_OPACITY_IN, [0, 1], clamp) *
    interpolate(fb, [BURST_AT + 6, BURST_AT + 22], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: contentOut }}>
        {/* 虛線框 */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X,
            top: CENTER_Y,
            width: frameW,
            height: frameH,
            transform: "translate(-50%, -50%)",
            border: `4px dashed ${FIGURE}`,
            borderRadius: 28,
            opacity: frameOpacity,
          }}
        />

        {/* 設計師 */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X,
            top: CENTER_Y,
            transform: `translate(-50%, -50%) translateX(${shakeX}px) rotate(${shakeRot}deg) scale(${
              dInScale * dReact
            })`,
            opacity: dInOp,
            fontSize: 240,
            lineHeight: 1,
            zIndex: 2,
            filter:
              glow > 0.01
                ? `drop-shadow(0 0 ${40 * glow}px ${withAlpha(YELLOW, 0.8 * glow)})`
                : "none",
          }}
        >
          🧑‍💻
        </div>

        {/* 6 張玩法小卡片：自中心噴出（spring overshoot） */}
        {CARDS.map((c, i) => {
          const p = spring({
            frame: fb - (FLY_START + i * FLY_STAGGER),
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.8 },
          });
          const x = interpolate(p, [0, 1], [0, c.x]);
          const y = interpolate(p, [0, 1], [0, c.y]);
          const scale = interpolate(p, [0, 1], [0.3, 1]);
          const op = interpolate(p, [0, 0.35], [0, 1], clamp);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CENTER_X,
                top: CENTER_Y,
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${c.r}deg)`,
                opacity: op,
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: 16,
                whiteSpace: "nowrap",
                background: WHITE,
                border: `2px solid ${NEUTRAL_300}`,
                borderRadius: 20,
                padding: "18px 30px",
                fontSize: 40,
                fontWeight: 700,
                color: TEXT_DARK,
                boxShadow: `0 10px 26px ${withAlpha(TEXT_DARK, 0.1)}`,
              }}
            >
              <span style={{ fontSize: 46 }}>{c.emoji}</span>
              {c.text}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
