import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLACK, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

// 第 2 集・第 3 頁・S08：節奏醫生限制說明透明 Overlay（480 幀）
//   資訊區：兩段大小標題原地替換（cross-fade）＋下方 7 個圓點＝7 拍。
//   圓點依序點亮（白）、第 7 點被點亮時放大縮小，一路不中斷地循環到淡出。
const BAR_OUT = [48, 72] as const;
const VEIL_IN = [102, 130] as const;
const RISE_IN = [138, 168] as const; // 整組進場位移
const INFO_OUT = [418, 446] as const;
const VEIL_OUT = [448, 478] as const;
const END_FILL = [452, 478] as const;

// 兩段訊息與各自的顯示區間（第一段停留後淡出、換第二段淡入停留到結尾）
const MESSAGES = [
  { big: "只有一個按鍵", small: "極簡化玩家的操作" },
  { big: "集中注意力", small: "專注在節拍與時機上" },
] as const;
const MSG1_IN = [138, 168] as const;
const MSG1_OUT = [258, 288] as const;
const MSG2_IN = [290, 320] as const; // 第一段淡出結束後才升入，兩段時間不重疊
const MSG_SHIFT = 90; // 切換時的垂直位移（第一段往上走、第二段自下方升入）

// 圓點節奏（貫穿兩段、持續循環）
const DOTS = 7;
const DOTS_IN = [156, 180] as const;
const DOT_START = 156; // 圓點開始掃描
const DOT_STEP = 12; // 每點間隔（≈0.4 秒）
const DOT_RAMP = 6; // 單點點亮的緩入幀數
const DOT_LAST = (DOTS - 1) * DOT_STEP; // 第 7 點被點亮的時點（cycle 內）
const CYCLE = 90; // 一輪長度（掃完 7 點＋第 7 點脈動）

export const Ch2Page3S08LimitOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.54], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);
  const riseIn = interpolate(frame, RISE_IN, [0, 1], easeStandard);
  const infoOut = interpolate(frame, INFO_OUT, [1, 0], clamp);
  const dotsIn = interpolate(frame, DOTS_IN, [0, 1], clamp);

  // 兩段訊息的顯示透明度（cross-fade）與垂直位移（往上切換）
  const msgEnv = [
    interpolate(frame, MSG1_IN, [0, 1], clamp) *
      interpolate(frame, MSG1_OUT, [1, 0], clamp),
    interpolate(frame, MSG2_IN, [0, 1], clamp),
  ];
  const msgTy = [
    interpolate(frame, MSG1_OUT, [0, -MSG_SHIFT], easeStandard), // 第一段往上離開
    interpolate(frame, MSG2_IN, [MSG_SHIFT, 0], easeOutExpo), // 第二段自下方升到定點
  ];

  // 圓點播放頭（持續循環）；frame < DOT_START 時維持暗色軌
  const cyc = (((frame - DOT_START) % CYCLE) + CYCLE) % CYCLE;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: veilOpacity }} />

      {/* 底部教學標示條 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: withAlpha(BLACK, 0.82),
          opacity: barOpacity,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          此影片僅用於教學實驗
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            color: WHITE,
          }}
        >
          節奏醫生 Rhythm Doctor
        </div>
      </div>

      {/* 資訊區（整組置中）：兩段大小標題 cross-fade＋下方七個圓點 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 500,
          transform: `translate(-50%, calc(-50% + ${interpolate(riseIn, [0, 1], [16, 0])}px))`,
          opacity: infoOut,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textShadow: `0 3px 18px ${withAlpha(BLACK, 0.45)}`,
        }}
      >
        {/* 文字區：兩段訊息絕對疊放，原地替換 */}
        <div style={{ position: "relative", width: 1200, height: 200 }}>
          {MESSAGES.map((m, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: `translateX(-50%) translateY(${msgTy[i]}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: msgEnv[i],
              }}
            >
              <div
                style={{
                  fontSize: 128,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: WHITE,
                  whiteSpace: "nowrap",
                }}
              >
                {m.big}
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontSize: 48,
                  fontWeight: 500,
                  letterSpacing: 3,
                  color: withAlpha(WHITE, 0.82),
                  whiteSpace: "nowrap",
                }}
              >
                {m.small}
              </div>
            </div>
          ))}
        </div>

        {/* 七個圓點（＝7 拍）：依序點亮、第 7 點脈動、持續循環 */}
        <div
          style={{
            marginTop: 150,
            display: "flex",
            gap: 44,
            alignItems: "center",
            opacity: dotsIn,
          }}
        >
          {Array.from({ length: DOTS }).map((_, i) => {
            const thr = i * DOT_STEP;
            const lit =
              frame < DOT_START
                ? 0
                : interpolate(cyc, [thr, thr + DOT_RAMP], [0, 1], clamp);

            // 第 7 點：被點亮那拍放大→縮小（上升快、下降稍慢）
            const isLast = i === DOTS - 1;
            const pulse =
              isLast && frame >= DOT_START
                ? interpolate(cyc, [DOT_LAST, DOT_LAST + 6], [0, 1], clamp) *
                  interpolate(cyc, [DOT_LAST + 6, DOT_LAST + 18], [1, 0], clamp)
                : 0;
            const scale = 1 + 0.7 * pulse;

            return (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  transform: `scale(${scale})`,
                  backgroundColor: withAlpha(WHITE, 0.22 + 0.78 * lit),
                  boxShadow:
                    lit > 0.01
                      ? `0 0 ${24 * lit}px ${withAlpha(WHITE, 0.55 * lit)}`
                      : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: endFill }} />
    </AbsoluteFill>
  );
};
