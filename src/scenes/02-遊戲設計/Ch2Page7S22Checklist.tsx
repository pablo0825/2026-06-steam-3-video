import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARD_BORDER,
  NEUTRAL_50,
  NEUTRAL_400,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 2 集・第 7 頁・S22：繪製分鏡圖的重點（306 幀）
//   開場先留 30 幀白底 → 標題（無 icon／無高亮）→ 2×2 編號卡片，逐張黃色高亮掃過，
//   掃到第 4 張時停住高亮並彈出「最重要」標籤，整塊垂直置中。
//   內容一律以 f = frame - HOLD 計時（與 S03 同慣例），CONTENT_OUT 則用絕對 frame。
const HOLD = 30; // 開場留白：內容延後這麼多幀才開始
const CONTENT_IN = [0, 24] as const;
const CONTENT_OUT = [284, 305] as const;

// 四個重點（編號由 index 補零產生）；start 為各卡進場幀。
const CHECKLIST = [
  { label: "完整開始與結尾", start: 50 },
  { label: "情境連貫", start: 100 },
  { label: "去複雜化", start: 150 },
  { label: "夥伴看得懂", start: 200 },
] as const;

const TAG_START = 224; // 「最重要」標籤彈入（第 4 張高亮落定後）

type ChecklistCardProps = {
  number: string;
  label: string;
  progress: number; // 進場 0→1
  accentProgress: number; // 高亮 0→1
  showTag?: boolean; // 是否顯示「最重要」
  tagProgress?: number; // 標籤彈入 0→1
};

const ChecklistCard: React.FC<ChecklistCardProps> = ({
  number,
  label,
  progress,
  accentProgress,
  showTag = false,
  tagProgress = 0,
}) => {
  const borderColor = interpolateColors(
    accentProgress,
    [0, 1],
    [CARD_BORDER, YELLOW],
  );
  const numberColor = interpolateColors(
    accentProgress,
    [0, 1],
    [NEUTRAL_400, YELLOW],
  );

  return (
    <div
      style={{
        position: "relative",
        width: 660,
        height: 210,
        boxSizing: "border-box",
        borderRadius: 24,
        border: `4px solid ${borderColor}`,
        backgroundColor: WHITE,
        boxShadow: `0 16px 38px ${withAlpha(
          accentProgress > 0.45 ? YELLOW : TEXT_DARK,
          accentProgress > 0.45 ? 0.12 : 0.07,
        )}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 16,
        padding: "34px 48px",
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px) scale(${interpolate(progress, [0, 1], [0.96, 1])})`,
      }}
    >
      <div
        style={{
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: 2,
          lineHeight: 1,
          color: numberColor,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 3,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>

      {showTag && (
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 32,
            padding: "8px 20px",
            borderRadius: 999,
            backgroundColor: YELLOW,
            color: WHITE,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 2,
            whiteSpace: "nowrap",
            boxShadow: `0 10px 24px ${withAlpha(YELLOW, 0.34)}`,
            opacity: tagProgress,
            transform: `translateY(${interpolate(tagProgress, [0, 1], [10, 0])}px) scale(${interpolate(tagProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          最重要
        </div>
      )}
    </div>
  );
};

export const Ch2Page7S22Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - HOLD; // 內容的時間軸（開場留白後才起算）

  const opacity =
    interpolate(f, CONTENT_IN, [0, 1], clamp) *
    interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const titleProgress = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const tagProgress = spring({
    frame: f - TAG_START,
    fps,
    config: { damping: 15, stiffness: 140 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 96,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: 5,
            color: TEXT_DARK,
            opacity: titleProgress,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          繪製分鏡圖的重點
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "660px 660px",
            gap: "40px 52px",
          }}
        >
          {CHECKLIST.map((item, index) => {
            const progress = spring({
              frame: f - item.start,
              fps,
              config: { damping: 14, stiffness: 125 },
            });
            const accentProgress =
              index === 3
                ? progress
                : f < item.start + 42
                  ? progress
                  : interpolate(f, [item.start + 42, item.start + 70], [1, 0], clamp);

            return (
              <ChecklistCard
                key={item.label}
                number={String(index + 1).padStart(2, "0")}
                label={item.label}
                progress={progress}
                accentProgress={accentProgress}
                showTag={index === 3}
                tagProgress={tagProgress}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
