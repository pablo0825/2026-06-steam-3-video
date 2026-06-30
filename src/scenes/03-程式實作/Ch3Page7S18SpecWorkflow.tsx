import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  NEUTRAL_50,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

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

// 順流式串接：每個節點出現後，連線往右畫出去帶出下一個節點
const STRIDE = 44;
const nodeStart = (i: number) => 6 + i * STRIDE;

// 箭頭長度：連線只畫到箭頭底部，由三角形當尖端，避免線戳出箭頭
const ARROW_LEN = 30;

// 回饋迴圈：起點離節點底部留間距，整體往下壓，避免黃線貼著黃節點
const FB_Y = NODE_CY + NODE_H / 2 + 36;
const FB_DEPTH = 850;
const FB_LABEL_Y = 786;

export const Ch3Page7S18SpecWorkflow: React.FC = () => {
  // 開場白底先停留 HOLD 幀：整段往後延（負幀時 spring／interpolate 自動維持初始＝白底）
  const HOLD = 24;
  const frame = useCurrentFrame() - HOLD;
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  // 節點間四段連線（i = 0..3）：節點出現後才畫，畫到端點時帶出下一個節點
  const segDraw = (i: number) =>
    interpolate(
      frame,
      [28 + i * STRIDE, 56 + i * STRIDE],
      [0, 1],
      easeStandard,
    );
  const segArrow = (i: number) =>
    interpolate(frame, [50 + i * STRIDE, 62 + i * STRIDE], [0, 1], clamp);
  // 手動驗證高亮
  const verifyHi = interpolate(frame, [218, 238], [0, 1], easeStandard);
  // 回饋曲線 + 標籤
  const fbDraw = interpolate(frame, [250, 308], [0, 1], easeStandard);
  const fbArrow = interpolate(frame, [300, 312], [0, 1], clamp);
  const fbLabel = interpolate(frame, [286, 306], [0, 1], easeStandard);
  const out = interpolate(frame, [366, 388], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
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
                d={`M${x1} ${NODE_CY} L${x2 - ARROW_LEN} ${NODE_CY}`}
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

        {/* 回饋曲線：手動驗證 → Spec（驗證失敗）；起點離節點底部留間距、整體下壓 */}
        <path
          d={`M${NODE_CX[4]} ${FB_Y} C${NODE_CX[4]} ${FB_DEPTH} ${NODE_CX[1]} ${FB_DEPTH} ${NODE_CX[1]} ${FB_Y + ARROW_LEN}`}
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
          transform={`translate(${NODE_CX[1]} ${FB_Y}) rotate(-90)`}
        >
          <path d="M0 0 L-30 -16 L-30 16 Z" fill={YELLOW} />
        </g>
      </svg>

      {/* 回饋標籤（壓在迴圈底部，白底斷開連線） */}
      <div
        style={{
          position: "absolute",
          left: (NODE_CX[1] + NODE_CX[4]) / 2,
          top: FB_LABEL_Y,
          transform: "translate(-50%, -50%)",
          opacity: fbLabel,
          padding: "8px 22px",
          borderRadius: 999,
          fontSize: 28,
          fontWeight: 800,
          color: TEXT_DARK,
          backgroundColor: WHITE,
          border: `2px solid ${withAlpha(YELLOW, 0.7)}`,
          boxShadow: `0 6px 16px ${withAlpha(TEXT_DARK, 0.08)}`,
        }}
      >
        驗證失敗 → 回 Spec
      </div>

      {/* 五節點 */}
      {NODES.map((label, i) => {
        const p = spring({
          frame: frame - nodeStart(i),
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
