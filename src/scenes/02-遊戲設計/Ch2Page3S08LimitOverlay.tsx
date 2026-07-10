import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLACK, NEUTRAL_50, WHITE, withAlpha } from "../../theme/colors";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

// 第 2 集・第 3 頁・S08：節奏醫生限制說明透明 Overlay（650 幀）
//   依旁白順序分三拍：7 個圓點先單獨演完兩輪（＝「節奏到第七拍才按空白鍵」）→
//   圓點退場 →「只有一個按鍵」→「集中注意力」，兩段大小標題原地替換（cross-fade）。
//   每一拍完全退場後，畫面先留白 HOLD 幀，下一拍才進來。
const BAR_OUT = [48, 72] as const;
const VEIL_IN = [102, 130] as const;
const RISE_IN = [130, 160] as const; // 整組進場位移
const INFO_OUT = [586, 614] as const;
const VEIL_OUT = [618, 648] as const;
const END_FILL = [622, 648] as const;

// 前一拍淡出結束後、下一拍進場前的留白。
const HOLD = 15;

// 圓點節奏：先單獨跑滿兩輪，退場後文字才進來。
const DOTS = 7;
const DOT_START = 142; // 圓點開始掃描
const DOT_STEP = 12; // 每點間隔（≈0.4 秒）
const DOT_RAMP = 6; // 單點點亮的緩入幀數
const DOT_LAST = (DOTS - 1) * DOT_STEP; // 第 7 點被點亮的時點（cycle 內）
const CYCLE = 90; // 一輪長度（掃完 7 點＋第 7 點脈動）
const DOT_CYCLES = 2;
const DOTS_RUN = CYCLE * DOT_CYCLES; // 跑滿兩輪後停在「七點全亮」
const DOTS_IN = [130, 154] as const;
const DOTS_OUT = [DOT_START + DOTS_RUN, DOT_START + DOTS_RUN + 24] as const;

// 圓點組的說明字（沒有大字，只有一行小字）
const BEAT_CAPTION = "在第七拍，按下空白鍵";

// 兩段訊息原地替換：圓點退場、留白一拍後才開始，時間互不重疊；皆自下方升入。
const MSG_SHIFT = 90; // 切換時的垂直位移
const MSG_FADE = 30; // 單段進場／離場的長度
const MSG_READ = 60; // 單段停在畫面上可閱讀的幀數
// 時點全部由「上一拍結束 ＋ HOLD」推導，改任何一段都不必手算後面的數字。
const MSG1_IN = [DOTS_OUT[1] + HOLD, DOTS_OUT[1] + HOLD + MSG_FADE] as const;
const MSG1_OUT = [
  MSG1_IN[1] + MSG_READ,
  MSG1_IN[1] + MSG_READ + MSG_FADE,
] as const;
const MSG2_IN = [MSG1_OUT[1] + HOLD, MSG1_OUT[1] + HOLD + MSG_FADE] as const;

type Msg = {
  big: string;
  small: string;
  in: readonly [number, number];
  out?: readonly [number, number];
};
const MESSAGES: Msg[] = [
  {
    big: "只有一個按鍵",
    small: "極簡化玩家的操作",
    in: MSG1_IN,
    out: MSG1_OUT,
  },
  { big: "集中注意力", small: "專注在節拍與時機上", in: MSG2_IN },
];

export const Ch2Page3S08LimitOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const veilOpacity =
    interpolate(frame, VEIL_IN, [0, 0.54], clamp) *
    interpolate(frame, VEIL_OUT, [1, 0], clamp);
  const barOpacity = interpolate(frame, BAR_OUT, [1, 0], clamp);
  const endFill = interpolate(frame, END_FILL, [0, 1], clamp);
  const riseIn = interpolate(frame, RISE_IN, [0, 1], easeStandard);
  const infoOut = interpolate(frame, INFO_OUT, [1, 0], clamp);
  const dotsOpacity =
    interpolate(frame, DOTS_IN, [0, 1], clamp) *
    interpolate(frame, DOTS_OUT, [1, 0], clamp);

  // 各段訊息的顯示透明度（cross-fade）與垂直位移（自下方升入、往上離開）
  const msgEnv = MESSAGES.map(
    (m) =>
      interpolate(frame, m.in, [0, 1], clamp) *
      (m.out ? interpolate(frame, m.out, [1, 0], clamp) : 1),
  );
  const msgTy = MESSAGES.map(
    (m) =>
      (m.out ? interpolate(frame, m.out, [0, -MSG_SHIFT], easeStandard) : 0) +
      interpolate(frame, m.in, [MSG_SHIFT, 0], easeOutExpo),
  );

  // 圓點播放頭：跑滿兩輪後夾在最後一格，停在七點全亮，不會再繞回全暗。
  const elapsed = Math.min(Math.max(frame - DOT_START, 0), DOTS_RUN - 1);
  const cyc = elapsed % CYCLE;

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

      {/* 圓點組（畫面正中）：一行小字＋七個圓點＝7 拍，演完兩輪後整組退場。
          與下方訊息區時間不重疊，所以各自置中、不共用排版盒。 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          transform: `translate(-50%, calc(-50% + ${interpolate(riseIn, [0, 1], [16, 0])}px))`,
          opacity: dotsOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 72,
          textShadow: `0 3px 18px ${withAlpha(BLACK, 0.45)}`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: 3,
            color: withAlpha(WHITE, 0.82),
            whiteSpace: "nowrap",
          }}
        >
          {BEAT_CAPTION}
        </div>

        {/* 七個圓點（＝7 拍）：依序點亮、第 7 點脈動 */}
        <div style={{ display: "flex", gap: 44, alignItems: "center" }}>
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

      {/* 訊息區（整組置中）：兩段大小標題 cross-fade */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 480,
          transform: "translate(-50%, -50%)",
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
      </div>

      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: endFill }} />
    </AbsoluteFill>
  );
};
