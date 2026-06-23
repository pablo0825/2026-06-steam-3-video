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
  BLUE,
  CARD_BORDER,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const NODE_W = 280;
const NODE_H = 120;
const NODE_CY = 470;
// 五節點中心 x
const NODE_CX = [230, 590, 950, 1310, 1670] as const;
const NODES = [
  "User Story",
  "Spec",
  "Plan",
  "AI／使用者實作",
  "手動驗證",
] as const;

export const Ch3Page7SpecWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  // 節點間四段連線（i = 0..3）
  const segDraw = (i: number) =>
    interpolate(frame, [80 + i * 30, 110 + i * 30], [0, 1], ease);
  const segArrow = (i: number) =>
    interpolate(frame, [104 + i * 30, 116 + i * 30], [0, 1], clamp);
  // 手動驗證高亮
  const verifyHi = interpolate(frame, [210, 230], [0, 1], ease);
  // 回饋曲線 + 標籤
  const fbDraw = interpolate(frame, [240, 300], [0, 1], ease);
  const fbArrow = interpolate(frame, [292, 304], [0, 1], clamp);
  const fbLabel = interpolate(frame, [280, 300], [0, 1], ease);
  // 開始實作
  const startIn = interpolate(frame, [320, 350], [0, 1], ease);
  const out = interpolate(frame, [368, 388], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 60,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 2,
        }}
      >
        Spec 實作流程
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* 節點間連線 + 箭頭 */}
        {[0, 1, 2, 3].map((i) => {
          const x1 = NODE_CX[i] + NODE_W / 2;
          const x2 = NODE_CX[i + 1] - NODE_W / 2;
          return (
            <g key={`seg-${i}`}>
              <path
                d={`M${x1} ${NODE_CY} L${x2} ${NODE_CY}`}
                fill="none"
                stroke={BLUE}
                strokeWidth="6"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - segDraw(i)}
              />
              <g opacity={segArrow(i)} transform={`translate(${x2} ${NODE_CY})`}>
                <path d="M0 0 L-30 -16 L-30 16 Z" fill={BLUE} />
              </g>
            </g>
          );
        })}

        {/* 回饋曲線：手動驗證底 → Spec 底（驗證失敗） */}
        <path
          d={`M${NODE_CX[4]} ${NODE_CY + NODE_H / 2} C${NODE_CX[4]} 760 ${NODE_CX[1]} 760 ${NODE_CX[1]} ${NODE_CY + NODE_H / 2}`}
          fill="none"
          stroke={YELLOW}
          strokeWidth="6"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - fbDraw}
        />
        <g
          opacity={fbArrow}
          transform={`translate(${NODE_CX[1]} ${NODE_CY + NODE_H / 2}) rotate(-90)`}
        >
          <path d="M0 0 L-30 -16 L-30 16 Z" fill={YELLOW} />
        </g>
      </svg>

      {/* 回饋標籤 */}
      <div
        style={{
          position: "absolute",
          left: (NODE_CX[1] + NODE_CX[4]) / 2,
          top: 730,
          transform: "translate(-50%, -50%)",
          opacity: fbLabel,
          padding: "8px 20px",
          borderRadius: 999,
          fontSize: 28,
          fontWeight: 800,
          color: TEXT_DARK,
          backgroundColor: withAlpha(YELLOW, 0.16),
          border: `2px solid ${withAlpha(YELLOW, 0.7)}`,
        }}
      >
        驗證失敗 → 回 Spec
      </div>

      {/* 五節點 */}
      {NODES.map((label, i) => {
        const p = spring({
          frame: frame - (20 + i * 28),
          fps,
          config: { damping: 17, stiffness: 115, overshootClamping: true },
        });
        const isVerify = i === 4;
        const hi = isVerify ? verifyHi : 0;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: NODE_CX[i],
              top: NODE_CY,
              width: NODE_W,
              height: NODE_H,
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
              opacity: p,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 14px",
              fontSize: i === 3 ? 26 : 32,
              fontWeight: 900,
              color: hi > 0.15 ? YELLOW : TEXT_DARK,
              backgroundColor: WHITE,
              border: `3px solid ${hi > 0.15 ? YELLOW : CARD_BORDER}`,
              boxShadow: `0 16px 38px ${withAlpha(hi > 0.15 ? YELLOW : TEXT_DARK, hi > 0.15 ? 0.16 : 0.08)}`,
            }}
          >
            {label}
          </div>
        );
      })}

      {/* 開始實作 轉場 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 900,
          transform: `translateX(-50%) translateY(${interpolate(startIn, [0, 1], [16, 0])}px)`,
          opacity: startIn,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: 4,
          color: BLUE,
        }}
      >
        開始實作 →
      </div>
    </AbsoluteFill>
  );
};
