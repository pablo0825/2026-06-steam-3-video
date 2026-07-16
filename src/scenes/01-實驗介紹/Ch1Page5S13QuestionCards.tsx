import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DIVIDER, NEUTRAL_50, SUBTLE, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp, easeOutExpo } from "../../theme/motion";

// 第 1 集・第 5 頁・S13：三個可透過原型驗證的問題（420 幀）
//   三組「大字＋輔助問句」以虛線隔開，逐一進場。
//   開場先留 30 幀白底 → 內容一律以 f = frame - HOLD 計時（與 S08 同慣例），
//   CONTENT_OUT 則用絕對 frame。
const HOLD = 30; // 開場留白：內容延後這麼多幀才開始
const CONTENT_OUT = [398, 419] as const;

const GROUP_STARTS = [0, 75, 150] as const;
const HELPER_DELAY = 12; // 輔助文字晚於大字，讓兩者有主從關係
const DIVIDER_LEAD = 8; // 虛線先於它右邊那組淡入：先有格線，內容才填進去
const DIVIDER_FADE = 12;
const DIVIDER_H = 300;
const RISE = 18; // 滑入類動畫的長度
// 視覺重量集中在上方的大字，幾何置中會顯得偏低；整組往上提 24px 補償。
const OPTICAL_LIFT = 48;

// 彈性進場：ζ≈0.55，衝到約 1.13 倍再彈回 1.0（與 S11 膠囊同一組手感）。
const POP = { damping: 16, stiffness: 200 } as const;

const GROUPS = [
  { title: "玩法", helper: "有趣嗎？" },
  { title: "畫面", helper: "風格對嗎？" },
  { title: "技術", helper: "做得到嗎？" },
] as const;

export const Ch1Page5S13QuestionCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - HOLD; // 內容的時間軸（開場留白後才起算）
  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: OPTICAL_LIFT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {GROUPS.map((group, index) => {
            const start = GROUP_STARTS[index];
            const titleIn = spring({ frame: f - start, fps, config: POP });
            const helperStart = start + HELPER_DELAY;
            const helperIn = interpolate(
              f,
              [helperStart, helperStart + RISE],
              [0, 1],
              easeOutExpo,
            );
            // 每條虛線屬於它左邊那組之後、右邊那組之前的空隙。
            const dividerStart = start - DIVIDER_LEAD;
            const dividerIn = interpolate(
              f,
              [dividerStart, dividerStart + DIVIDER_FADE],
              [0, 1],
              clamp,
            );

            return (
              <React.Fragment key={group.title}>
                {index > 0 && (
                  <div
                    style={{
                      width: 0,
                      height: DIVIDER_H,
                      borderLeft: `3px dashed ${DIVIDER}`,
                      opacity: dividerIn,
                    }}
                  />
                )}
                <div style={{ width: 460, textAlign: "center" }}>
                  <div
                    style={{
                      transform: `scale(${titleIn})`,
                      fontSize: 130,
                      fontWeight: 900,
                      color: TEXT_DARK,
                      lineHeight: 1.2,
                    }}
                  >
                    {group.title}
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      opacity: helperIn,
                      transform: `translateY(${interpolate(helperIn, [0, 1], [16, 0])}px)`,
                      fontSize: 48,
                      fontWeight: 700,
                      color: SUBTLE,
                    }}
                  >
                    {group.helper}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
