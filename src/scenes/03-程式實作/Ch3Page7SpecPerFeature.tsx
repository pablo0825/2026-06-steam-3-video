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
  GREEN,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 7 頁 S18 前半：左右對比「一個功能，一份 Spec」
//   左＝正例：三個功能各自連到一份獨立文件 → ✓
//   右＝反例：三個功能全部塞進同一份文件 → ✗
//   兩邊用相同的正常顏色，差別只在「結構 ＋ ✓／✗」，靠對比讓觀眾理解。

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };

const FEATURES = ["跳躍", "衝刺", "攀牆"] as const;
const DOC_NAMES = ["jump-spec.md", "dash-spec.md", "climb-spec.md"] as const;
const ROW_Y = [300, 440, 580] as const;

const PILL_W = 150;
const PILL_H = 84;
const PILL_CY = (i: number) => ROW_Y[i] + PILL_H / 2;

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

// 判定徽章：✓（綠）正例／✗（紅）反例
const Verdict: React.FC<{ kind: "pass" | "fail"; scale: number }> = ({
  kind,
  scale,
}) => {
  const color = kind === "pass" ? GREEN : RED;
  return (
    <div
      style={{
        width: 92,
        height: 92,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        boxShadow: `0 14px 30px ${withAlpha(color, 0.32)}`,
      }}
    >
      <span
        style={{ color: WHITE, fontSize: 54, fontWeight: 900, lineHeight: 1 }}
      >
        {kind === "pass" ? "✓" : "✗"}
      </span>
    </div>
  );
};

export const Ch3Page7SpecPerFeature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const linesDraw = interpolate(frame, [110, 160], [0, 1], ease);
  const badDocIn = spring({
    frame: frame - 60,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const passIn = spring({
    frame: frame - 172,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const failIn = spring({
    frame: frame - 188,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const out = interpolate(frame, [300, 330], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ backgroundColor: WHITE, fontFamily: FONT, opacity: out }}
    >
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 96,
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
          top: 250,
          height: 470,
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
            strokeDashoffset={1 - linesDraw}
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
            strokeDashoffset={1 - linesDraw}
          />
        ))}
      </svg>

      {/* 正例：左功能膠囊 */}
      {FEATURES.map((label, i) => {
        const p = spring({
          frame: frame - (24 + i * 12),
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
          frame: frame - (54 + i * 12),
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

      {/* 反例：左功能膠囊 */}
      {FEATURES.map((label, i) => {
        const p = spring({
          frame: frame - (24 + i * 12),
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
          top: 772,
          transform: "translateX(-50%)",
          opacity: passIn,
        }}
      >
        <Verdict kind="pass" scale={passIn} />
      </div>
      <div
        style={{
          position: "absolute",
          left: BAD_DOC_X,
          top: 772,
          transform: "translateX(-50%)",
          opacity: failIn,
        }}
      >
        <Verdict kind="fail" scale={failIn} />
      </div>
    </AbsoluteFill>
  );
};
