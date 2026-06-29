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
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { VerdictBadge } from "../../components/VerdictBadge";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 7 頁 S18 前半：左右對比「一個功能，一份 Spec」
//   左＝正例：三個功能各自連到一份獨立文件 → ✓（先完整出現）
//   右＝反例：三個功能全部塞進同一份文件 → ✗（後出現，形成對比）
//   兩邊用相同的正常顏色，差別只在「結構 ＋ ✓／✗」，靠對比讓觀眾理解。

const FEATURES = ["跳躍", "衝刺", "攀牆"] as const;
const DOC_NAMES = ["jump-spec.md", "dash-spec.md", "climb-spec.md"] as const;
const ROW_Y = [356, 496, 636] as const;

const PILL_W = 150;
const PILL_H = 84;
const PILL_CY = (i: number) => ROW_Y[i] + PILL_H / 2;

const TITLE_TOP = 118;
const VERDICT_TOP = 812;

// 正例：左欄膠囊 x ／ 右欄文件 x（面板置中於 x=440）
const GOOD_PILL_X = 180;
const GOOD_DOC_X = 440;
// 反例：左欄膠囊 x ／ 單一文件 x、中心 y（面板置中於 x=1480，與正例對稱）
const BAD_PILL_X = 1220;
const BAD_DOC_X = 1480;
const BAD_DOC_CY = PILL_CY(1);

// 連接線中性藍灰：不預先暗示好壞，由 ✓／✗ 傳達對比
const LINE = withAlpha(BLUE, 0.5);

// 文件卡：藍色標題列（檔名）＋ 數條內容示意列
const MiniDoc: React.FC<{ name: string; width?: number; rows?: number }> = ({
  name,
  width = 260,
  rows = 2,
}) => (
  <div
    style={{
      width,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: WHITE,
      border: `3px solid ${CARD_BORDER}`,
      boxShadow: `0 14px 30px ${withAlpha(TEXT_DARK, 0.1)}`,
    }}
  >
    <div
      style={{
        height: 40,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        color: WHITE,
        backgroundColor: BLUE,
        fontSize: 19,
        fontWeight: 800,
        letterSpacing: 0.5,
      }}
    >
      {name}
    </div>
    <div style={{ padding: "14px 16px", display: "grid", gap: 9 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 9,
            width: `${78 - i * 8}%`,
            borderRadius: 999,
            backgroundColor:
              i === 0 ? withAlpha(BLUE, 0.3) : withAlpha(SUBTLE, 0.24),
          }}
        />
      ))}
    </div>
  </div>
);

const Pill: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      width: PILL_W,
      height: PILL_H,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      fontWeight: 900,
      letterSpacing: 2,
      color: WHITE,
      backgroundColor: BLUE,
      boxShadow: `0 12px 26px ${withAlpha(BLUE, 0.26)}`,
    }}
  >
    {label}
  </div>
);

export const Ch3Page7S18SpecPerFeature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  // 正例先（~0–135），反例後（~140–270），最後兩邊並陳 hold 再淡出
  const goodLines = interpolate(frame, [62, 104], [0, 1], easeStandard);
  const badLines = interpolate(frame, [196, 238], [0, 1], easeStandard);
  const badDocIn = spring({
    frame: frame - 170,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const passIn = spring({
    frame: frame - 110,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const failIn = spring({
    frame: frame - 244,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const out = interpolate(frame, [300, 330], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: TITLE_TOP,
          transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          fontSize: 64,
          fontWeight: 900,
          color: TEXT_DARK,
          letterSpacing: 3,
        }}
      >
        一個功能，一份 Spec
      </div>

      {/* 中央分隔線 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 308,
          height: 480,
          transform: "translateX(-50%)",
          borderLeft: `2px dashed ${withAlpha(SUBTLE, 0.35)}`,
          opacity: titleIn,
        }}
      />

      {/* 連線 */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* 正例：每個功能 → 各自文件 */}
        {ROW_Y.map((_, i) => (
          <path
            key={`good-${i}`}
            d={`M${GOOD_PILL_X + PILL_W} ${PILL_CY(i)} L${GOOD_DOC_X} ${PILL_CY(i)}`}
            fill="none"
            stroke={LINE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - goodLines}
          />
        ))}
        {/* 反例：三個功能 → 匯聚到單一文件 */}
        {ROW_Y.map((_, i) => (
          <path
            key={`bad-${i}`}
            d={`M${BAD_PILL_X + PILL_W} ${PILL_CY(i)} C${BAD_DOC_X - 60} ${PILL_CY(i)} ${BAD_DOC_X - 60} ${BAD_DOC_CY} ${BAD_DOC_X} ${BAD_DOC_CY}`}
            fill="none"
            stroke={LINE}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - badLines}
          />
        ))}
      </svg>

      {/* 正例：左功能膠囊 */}
      {FEATURES.map((label, i) => {
        const p = spring({
          frame: frame - (8 + i * 10),
          fps,
          config: { damping: 17, stiffness: 120 },
        });
        return (
          <div
            key={`gf-${label}`}
            style={{
              position: "absolute",
              left: GOOD_PILL_X,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
            }}
          >
            <Pill label={label} />
          </div>
        );
      })}

      {/* 正例：右獨立文件 */}
      {DOC_NAMES.map((name, i) => {
        const p = spring({
          frame: frame - (34 + i * 10),
          fps,
          config: { damping: 18, stiffness: 120 },
        });
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: GOOD_DOC_X,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [26, 0])}px)`,
            }}
          >
            <MiniDoc name={name} />
          </div>
        );
      })}

      {/* 反例：左功能膠囊（後出現） */}
      {FEATURES.map((label, i) => {
        const p = spring({
          frame: frame - (140 + i * 10),
          fps,
          config: { damping: 17, stiffness: 120 },
        });
        return (
          <div
            key={`bf-${label}`}
            style={{
              position: "absolute",
              left: BAD_PILL_X,
              top: ROW_Y[i],
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
            }}
          >
            <Pill label={label} />
          </div>
        );
      })}

      {/* 反例：單一文件（內容塞滿） */}
      <div
        style={{
          position: "absolute",
          left: BAD_DOC_X,
          top: BAD_DOC_CY,
          opacity: badDocIn,
          transform: `translateY(-50%) translateX(${interpolate(badDocIn, [0, 1], [26, 0])}px)`,
        }}
      >
        <MiniDoc name="all-spec.md" width={280} rows={6} />
      </div>

      {/* 判定：✓ 正例 ／ ✗ 反例 */}
      <div
        style={{
          position: "absolute",
          left: GOOD_DOC_X,
          top: VERDICT_TOP,
          transform: `translateX(-50%) scale(${passIn})`,
          opacity: passIn,
        }}
      >
        <VerdictBadge kind="pass" size={92} shadow />
      </div>
      <div
        style={{
          position: "absolute",
          left: BAD_DOC_X,
          top: VERDICT_TOP,
          transform: `translateX(-50%) scale(${failIn})`,
          opacity: failIn,
        }}
      >
        <VerdictBadge kind="fail" size={92} shadow />
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
