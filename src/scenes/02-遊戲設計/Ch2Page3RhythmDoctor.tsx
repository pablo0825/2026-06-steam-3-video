import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  BORDER_LIGHT,
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 2 集・第 3 頁：限制設計案例 — 節奏醫生
//   S6：標題「節奏醫生」→ 影片置中播放（建立）
//   S7：影片滑左縮小 → 右側依序帶出限制標註（第 7 拍／一個按鍵／節拍 × 時間）→ 小結卡「約束 → 激發靈感」
//
// 影片以 <Sequence durationInFrames> 限制只播放 0–16 秒，原檔 rhythm-doctor.mp4 完全不動（保留原檔）。

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const VIDEO = staticFile("02-遊戲設計/rhythm-doctor.mp4");
const VIDEO_VOLUME = 0.2; // 遊戲原聲（旁白為主）；要全靜音改 0
const VIDEO_SECONDS = 16; // 只播 0–16 秒

// 影片框（橫式 16:9）
const VW = 900;
const VH = 506;
const VY = 610; // S7 影片垂直中心（略低，讓上方標題有空間）
const VY_S8 = 540; // S8 影片上移到畫面中央（標題已淡出，整體置中更平衡）
const VX_CENTER = 960; // 建立：置中
const VX_LEFT = 600; // 說明：滑到左邊讓出右側
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// 節奏（30fps；總長 700 frames）
const SHIFT = [150, 186] as const; // 影片置中 → 滑左縮小
const COL_X = 1430; // 右側欄位中心
const HEAD_START = 196; // 右側標題
const ANN_START = [222, 264, 306] as const; // 三個限制標註依序
const AB_OUT = [452, 480] as const; // 建立／說明段一起淡出

// S9 小結（分階段建立：① 有約束升起 → ③ 左移 → ④ 箭頭 → ⑤ 激發靈感 → ⑥ 輔助文字）
const CON_RISE = [488, 518] as const; // ① 有約束 由下升起
const CON_MOVE = [556, 586] as const; // ③ 有約束 左移讓位
const ARROW_IN = [590, 614] as const; // ④ 箭頭淡入
const INSPIRE_IN = [612, 644] as const; // ⑤ 激發靈感 升起
const CAP_IN = [652, 678] as const; // ⑥ 輔助文字（收尾）
const CON_X_CENTER = 960; // 有約束 升起時置中
const CON_X_LEFT = 720; // 有約束 左移定位
const ARROW_X = 970;
const INSPIRE_X = 1200;
const S9_LINE_Y = 505;
const S9_CAP_Y = 615;

// 重點字（黃色粗體＝強調色）
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const ANNS: { emoji: string; node: React.ReactNode }[] = [
  { emoji: "⌨️", node: <>節奏到第 7 拍，才按下空白鍵</> },
  {
    emoji: "☝️",
    node: (
      <>
        全程<span style={KEY}>只靠一個按鍵</span>
      </>
    ),
  },
  {
    emoji: "🎯",
    node: (
      <>
        注意力集中在<span style={KEY}>節拍 × 時間</span>
      </>
    ),
  },
];

export const Ch2Page3RhythmDoctor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { ...clamp, easing: EASE };

  const abOut = interpolate(frame, AB_OUT, [1, 0], clamp);
  // 標題／副標：影片滑左縮小的「同時」淡出（比照 S5 大圖移動時標題淡出）
  const headerOut = interpolate(frame, SHIFT, [1, 0], clamp);

  // 標題
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });

  // 影片：淡入 → 滑左縮小、同時上移置中
  const videoOp = interpolate(frame, [16, 46], [0, 1], clamp) * abOut;
  const videoX = interpolate(frame, SHIFT, [VX_CENTER, VX_LEFT], ease);
  const videoY = interpolate(frame, SHIFT, [VY, VY_S8], ease);
  const videoScale = interpolate(frame, SHIFT, [1.04, 0.85], ease);

  // 右側標題
  const headIn = spring({ frame: frame - HEAD_START, fps, config: { damping: 14, stiffness: 120 } });

  // S9 小結（分階段）
  const conRise = interpolate(frame, CON_RISE, [0, 1], clamp);
  const conRiseY = interpolate(frame, CON_RISE, [50, 0], ease);
  const conX = interpolate(frame, CON_MOVE, [CON_X_CENTER, CON_X_LEFT], ease);
  const arrowIn = interpolate(frame, ARROW_IN, [0, 1], clamp);
  const inspireOp = interpolate(frame, INSPIRE_IN, [0, 1], clamp);
  const inspireY = interpolate(frame, INSPIRE_IN, [40, 0], ease);
  const capOp = interpolate(frame, CAP_IN, [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 標題「節奏醫生」（頂部置中） */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 215,
          transform: `translate(-50%, ${interpolate(titleIn, [0, 1], [16, 0])}px)`,
          opacity: titleIn * headerOut,
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: 4,
          color: TEXT_DARK,
          whiteSpace: "nowrap",
        }}
      >
        節奏醫生 <span style={{ fontSize: 40, color: SUBTLE, fontWeight: 700 }}>Rhythm Doctor</span>
      </div>

      {/* 影片框（置中 → 滑左縮小＋上移置中）；Sequence 限制只播 0–16 秒 */}
      <div
        style={{
          position: "absolute",
          left: videoX,
          top: videoY,
          width: VW,
          height: VH,
          transform: `translate(-50%, -50%) scale(${videoScale})`,
          opacity: videoOp,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: `0 24px 60px ${withAlpha(BLACK, 0.18)}`,
          border: `1px solid ${BORDER_LIGHT}`,
          backgroundColor: BLACK,
        }}
      >
        <Sequence durationInFrames={Math.round(VIDEO_SECONDS * fps)} layout="none">
          <OffthreadVideo
            src={VIDEO}
            volume={VIDEO_VOLUME}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </div>

      {/* 右側：限制標註 */}
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 282,
          transform: `translate(-50%, ${interpolate(headIn, [0, 1], [20, 0])}px)`,
          opacity: headIn * abOut,
          fontSize: 40,
          fontWeight: 800,
          color: SUBTLE,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        它的「限制」在哪？
      </div>

      {ANNS.map((a, i) => {
        const s = spring({ frame: frame - ANN_START[i], fps, config: { damping: 15, stiffness: 130 } });
        const y = 437 + i * 160;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: COL_X,
              top: y,
              transform: `translate(-50%, -50%) translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
              opacity: s * abOut,
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: WHITE,
              border: `2px solid ${BORDER_LIGHT}`,
              borderRadius: 18,
              padding: "22px 34px",
              boxShadow: `0 12px 28px ${withAlpha(BLACK, 0.06)}`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 44 }}>{a.emoji}</span>
            <span style={{ fontSize: 38, fontWeight: 600, color: TEXT_DARK, letterSpacing: 1 }}>{a.node}</span>
          </div>
        );
      })}

      {/* S9 小結（分階段建立）：有約束升起 → 左移 → 箭頭 → 激發靈感 → 輔助文字 */}
      {frame >= 482 && (
        <AbsoluteFill>
          {/* ① 有約束 膠囊（由下升起 → ③ 左移讓位） */}
          <div
            style={{
              position: "absolute",
              left: conX,
              top: S9_LINE_Y,
              transform: `translate(-50%, calc(-50% + ${conRiseY}px))`,
              opacity: conRise,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 2,
              color: TEXT_DARK,
              background: CHIP_BG,
              padding: "16px 44px",
              borderRadius: 20,
              whiteSpace: "nowrap",
            }}
          >
            有約束
          </div>

          {/* ④ 箭頭 */}
          <div
            style={{
              position: "absolute",
              left: ARROW_X,
              top: S9_LINE_Y,
              transform: "translate(-50%, -50%)",
              opacity: arrowIn,
              fontSize: 60,
              fontWeight: 800,
              color: SUBTLE,
            }}
          >
            →
          </div>

          {/* ⑤ 激發靈感（黃字升起） */}
          <div
            style={{
              position: "absolute",
              left: INSPIRE_X,
              top: S9_LINE_Y,
              transform: `translate(-50%, calc(-50% + ${inspireY}px))`,
              opacity: inspireOp,
              fontSize: 72,
              letterSpacing: 4,
              whiteSpace: "nowrap",
              ...KEY,
            }}
          >
            激發靈感
          </div>

          {/* ⑥ 輔助文字（收尾小標） */}
          <div
            style={{
              position: "absolute",
              left: 960,
              top: S9_CAP_Y,
              transform: "translateX(-50%)",
              opacity: capOp,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            限制設計，是不錯的發想方法
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
