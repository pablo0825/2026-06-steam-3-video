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

// 第 3 集・第 4 頁・S09-02：Context 視窗裝滿 → 新檔案擠掉最舊的（360 幀）
//   沿用 S12 視窗 chrome（三圓點）。視窗彈入 → 4 個檔案從上方落入裝滿 →
//   第 5 個落下、最舊（最左）滑出視窗、其餘左移補位。
const WIN_W = 960;
const WIN_H = 460;
const SLOT0 = 637; // 第一格檔案中心 X（場景座標）
const SLOT_STEP = 215;
const TARGET_Y = 530; // 檔案落定的中心 Y（視窗內容區中央）
const DROP_START_Y = 200; // 檔案自視窗上方落下的起點 Y
const FILE_FIRST = 44; // 第一個檔案落下
const FILE_STEP = 32; // 每個檔案間隔
const PUSH_AT = 200; // 第 5 個檔案落下＋最舊擠出的時點
const PUSH_DUR = 40;
const CAPTION_IN = [268, 298] as const;

const FILES = [
  { id: "a", name: "需求.md" },
  { id: "b", name: "規則.md" },
  { id: "c", name: "對話.md" },
  { id: "d", name: "紀錄.md" },
] as const;
const NEW_FILE = { name: "新檔案.md" };

const slotX = (idx: number) => SLOT0 + idx * SLOT_STEP;

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
        d="M60 8 V28 H80"
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M60 8 V28 H80 Z" fill={accent ? withAlpha(BLUE, 0.15) : NEUTRAL_100} />
      <line x1={34} y1={48} x2={70} y2={48} stroke={line} strokeWidth={4} strokeLinecap="round" />
      <line x1={34} y1={62} x2={70} y2={62} stroke={line} strokeWidth={4} strokeLinecap="round" />
      <line x1={34} y1={76} x2={56} y2={76} stroke={line} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

const FileNode: React.FC<{
  x: number;
  y: number;
  opacity: number;
  name: string;
  accent?: boolean;
}> = ({ x, y, opacity, name, accent }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
    }}
  >
    <FileGlyph size={132} accent={accent} />
    <div
      style={{
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: 0.5,
        color: accent ? BLUE : TEXT_DARK,
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
  const captionIn = interpolate(frame, CAPTION_IN, [0, 1], easeStandard);
  const pushProgress = interpolate(
    frame,
    [PUSH_AT, PUSH_AT + PUSH_DUR],
    [0, 1],
    easeStandard,
  );

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
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: DOT_RED }} />
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: YELLOW }} />
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: GREEN }} />
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

      {/* 檔案（場景座標，浮在視窗上方，自上落入視窗內部槽位） */}
      {FILES.map((file, i) => {
        const dropAt = FILE_FIRST + i * FILE_STEP;
        const drop = spring({
          frame: frame - dropAt,
          fps,
          config: { damping: 15, stiffness: 120 },
        });
        const y = interpolate(drop, [0, 1], [DROP_START_Y, TARGET_Y]);
        const dropOpacity = interpolate(frame, [dropAt, dropAt + 8], [0, 1], clamp);

        const isOldest = i === 0;
        // 擠出：最舊滑出視窗左側＋淡出；其餘左移一格補位
        const x = isOldest
          ? interpolate(pushProgress, [0, 1], [slotX(0), 480 - 140], easeStandard)
          : slotX(interpolate(pushProgress, [0, 1], [i, i - 1]));
        const opacity = isOldest
          ? dropOpacity * interpolate(pushProgress, [0, 0.7, 1], [1, 1, 0], clamp)
          : dropOpacity;

        return (
          <FileNode key={file.id} x={x} y={y} opacity={opacity} name={file.name} />
        );
      })}

      {/* 第 5 個新檔案：於 PUSH_AT 落下，進入最右格 */}
      {(() => {
        const drop = spring({
          frame: frame - PUSH_AT,
          fps,
          config: { damping: 15, stiffness: 120 },
        });
        const y = interpolate(drop, [0, 1], [DROP_START_Y, TARGET_Y]);
        const opacity = interpolate(frame, [PUSH_AT, PUSH_AT + 8], [0, 1], clamp);
        return (
          <FileNode x={slotX(3)} y={y} opacity={opacity} name={NEW_FILE.name} accent />
        );
      })()}

      {/* 收尾字 */}
      <div
        aria-label="Context 有容量上限，裝滿後新檔案會擠掉最舊的"
        style={{
          position: "absolute",
          left: 960,
          top: 828,
          transform: `translate(-50%, ${interpolate(captionIn, [0, 1], [18, 0])}px)`,
          opacity: captionIn,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 1,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        Context 有<span style={{ color: YELLOW }}>容量上限</span>
        ，裝滿後新檔案會<span style={{ color: YELLOW }}>擠掉最舊的</span>
      </div>
    </AbsoluteFill>
  );
};
