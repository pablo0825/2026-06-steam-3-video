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
  DOT_RED,
  GREEN,
  NEUTRAL_50,
  NEUTRAL_100,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";

// 第 3 集・第 4 頁・S09-02：Context 視窗裝滿（2×4）→ 新檔案擠掉最舊的（420 幀）
//   沿用 S12 視窗 chrome（三圓點）。8 檔逐一在視窗內出現（淡入＋pop）→
//   第 9 個新檔從上落下、最舊（左上）滑出、其餘 FIFO 依序遞補。
const WIN_W = 960;
const WIN_H = 540; // 加高：讓上下排與視窗邊緣留白
const COL0 = 645; // 第一欄檔案中心 X（場景座標）
const COL_STEP = 210;
const ROW_Y = [430, 630] as const; // 上排／下排檔案中心 Y（與視窗邊緣各留約 70px）
const DROP_START_Y = 200; // 新檔案自視窗上方落下的起點 Y
const FILES_FIRST = 20; // 第一個檔案出現
const FILES_STEP = 11; // 逐一出現的間隔
const PUSH_AT = 170; // 新檔案落下＋最舊擠出＋其餘遞補
const PUSH_DUR = 42;
const ENDING_FADE = [258, 282] as const; // 結尾淡入滿版 NEUTRAL_50（收白）

const FILES = [
  { id: "a", name: "需求.md" },
  { id: "b", name: "規則.md" },
  { id: "c", name: "對話.md" },
  { id: "d", name: "修改.md" },
  { id: "e", name: "測試.md" },
  { id: "f", name: "紀錄.md" },
  { id: "g", name: "問題.md" },
  { id: "h", name: "筆記.md" },
] as const;
const NEW_FILE = { name: "新檔案.md" };

// 閱讀順序 slot（0–7）→ 場景座標
const slotPos = (idx: number) => ({
  x: COL0 + (idx % 4) * COL_STEP,
  y: ROW_Y[Math.floor(idx / 4)],
});

// 折角文件 icon（accent＝新檔案，改藍色強調）
const FileGlyph: React.FC<{ size: number; accent?: boolean }> = ({
  size,
  accent,
}) => {
  const stroke = accent ? BLUE : CARD_BORDER;
  const line = accent ? BLUE : SUBTLE;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M24 8 H60 L80 28 V92 H24 Z"
        fill={WHITE}
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d="M60 8 V28 H80 Z"
        fill={accent ? withAlpha(BLUE, 0.15) : NEUTRAL_100}
      />
      <path
        d="M60 8 V28 H80"
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <line
        x1={34}
        y1={48}
        x2={70}
        y2={48}
        stroke={line}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={34}
        y1={62}
        x2={70}
        y2={62}
        stroke={line}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={34}
        y1={76}
        x2={56}
        y2={76}
        stroke={line}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
};

const FileNode: React.FC<{
  x: number;
  y: number;
  opacity: number;
  name: string;
  accent?: boolean;
  scale?: number;
}> = ({ x, y, opacity, name, accent, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}
  >
    <FileGlyph size={104} accent={accent} />
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 0.5,
        color: accent ? BLUE : SUBTLE,
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </div>
  </div>
);

export const Ch3Page4S09ContextLimit02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winEnter = spring({
    frame: frame - 6,
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  const pushProgress = interpolate(
    frame,
    [PUSH_AT, PUSH_AT + PUSH_DUR],
    [0, 1],
    easeStandard,
  );
  const endFill = interpolate(frame, ENDING_FADE, [0, 1], clamp);
  const captionIn = interpolate(frame, [120, 148], [0, 1], easeStandard);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      {/* 視窗（沿用 S12 chrome） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 500,
          width: WIN_W,
          height: WIN_H,
          transform: `translate(-50%, -50%) scale(${interpolate(winEnter, [0, 1], [0.9, 1])})`,
          opacity: winEnter,
          borderRadius: 22,
          overflow: "hidden",
          background: WHITE,
          border: `3px solid ${CARD_BORDER}`,
          boxShadow: `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
        }}
      >
        <div
          style={{
            height: 60,
            background: WINDOW_BAR,
            borderBottom: `1px solid ${CARD_BORDER}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 22px",
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: DOT_RED,
            }}
          />
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: YELLOW,
            }}
          />
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: GREEN,
            }}
          />
          <div
            style={{
              marginLeft: 12,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 1,
              color: TEXT_DARK,
            }}
          >
            Context
          </div>
        </div>
        <div style={{ height: WIN_H - 60, background: NEUTRAL_50 }} />
      </div>

      {/* 8 檔逐一在視窗內出現（淡入＋pop）；擠出時最舊滑出、其餘 FIFO 遞補 */}
      {FILES.map((file, i) => {
        // 各檔於原位錯開淡入＋輕微放大 pop
        const enter = spring({
          frame: frame - (FILES_FIRST + i * FILES_STEP),
          fps,
          config: { damping: 16, stiffness: 120 },
        });
        const enterOpacity = interpolate(enter, [0, 1], [0, 1], clamp);
        const scale = interpolate(enter, [0, 1], [0.9, 1]);

        if (i === 0) {
          // 最舊：滑出視窗左側＋淡出
          const x = interpolate(
            pushProgress,
            [0, 1],
            [slotPos(0).x, 480 - 160],
            easeStandard,
          );
          const opacity =
            enterOpacity *
            interpolate(pushProgress, [0, 0.7, 1], [1, 1, 0], clamp);
          return (
            <FileNode
              key={file.id}
              x={x}
              y={slotPos(0).y}
              opacity={opacity}
              scale={scale}
              name={file.name}
            />
          );
        }

        // 其餘：FIFO 依序遞補一格（slot i → slot i-1）
        const to = slotPos(i - 1);
        const from = slotPos(i);
        const x = interpolate(
          pushProgress,
          [0, 1],
          [from.x, to.x],
          easeStandard,
        );
        const y = interpolate(
          pushProgress,
          [0, 1],
          [from.y, to.y],
          easeStandard,
        );
        return (
          <FileNode
            key={file.id}
            x={x}
            y={y}
            opacity={enterOpacity}
            scale={scale}
            name={file.name}
          />
        );
      })}

      {/* 第 9 個新檔案：於 PUSH_AT 落下，進入右下 slot7 */}
      {(() => {
        const drop = spring({
          frame: frame - PUSH_AT,
          fps,
          config: { damping: 15, stiffness: 120 },
        });
        const y = interpolate(drop, [0, 1], [DROP_START_Y, slotPos(7).y]);
        const opacity = interpolate(
          frame,
          [PUSH_AT, PUSH_AT + 8],
          [0, 1],
          clamp,
        );
        return (
          <FileNode
            x={slotPos(7).x}
            y={y}
            opacity={opacity}
            name={NEW_FILE.name}
            accent
          />
        );
      })()}

      {/* 視窗下方說明 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 880,
          transform: `translate(-50%, ${interpolate(captionIn, [0, 1], [18, 0])}px)`,
          opacity: captionIn,
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: 2,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        Context 有容量限制
      </div>

      {/* 結尾淡入滿版白底（收白） */}
      <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, opacity: endFill }} />
    </AbsoluteFill>
  );
};
