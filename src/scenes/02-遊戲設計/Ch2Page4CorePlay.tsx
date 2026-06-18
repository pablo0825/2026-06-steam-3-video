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

// 第 2 集・第 4 頁：核心玩法（Celeste）
//   S10：標題「核心玩法」＋定義＋「👀 觀察：哪些動作最常重複？」→ 淡出短暫留白
//   S11：「Celeste」標題先升起（上）→ 影片由下往上進場並置中播放（建立）
//   S12：影片滑左縮小＋上移、標題淡出 → 右側三動作（跳躍／攀牆／衝刺）依序彈入
//
// 影片以 <Sequence from> 從建立段才開始播；原檔 celeste-coreplay.mp4 不動。

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const VIDEO = staticFile("02-遊戲設計/celeste-coreplay.mp4");
const VIDEO_VOLUME = 0.2; // 旁白為主；要全靜音改 0

// 影片框（橫式 16:9）
const VW = 900;
const VH = 506;
const VY = 610; // S11 建立：影片置中（略低，讓上方標題有空間）
const VY_S12 = 540; // S12：標題淡出，影片上移置中
const VX_CENTER = 960;
const VX_LEFT = 600;
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// 節奏（30fps；總長 660 frames）
const A_OUT = [184, 212] as const; // S10 淡出（提示後多停留）
const TITLE_IN = [230, 260] as const; // ①「Celeste」標題先升起
const VIDEO_START = 270; // ② 標題建立後，影片才進場並開始播放
const VIDEO_IN = [270, 308] as const;
const SHIFT = [492, 532] as const; // 影片滑左縮小＋上移、標題淡出
const COL_X = 1430; // 右側欄位中心
const ACT_HEAD = 282; // 右側標題
const INFO_START = 544; // Celeste 標題完全淡出後，留白 12 frames 再建立右欄
const ACT_START = [578, 620, 662] as const; // 三動作依序

// 重點字（黃色粗體＝強調色）
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

const ACTIONS: { emoji: string; label: string }[] = [
  { emoji: "⬆️", label: "跳躍" },
  { emoji: "🧗", label: "攀牆" },
  { emoji: "💨", label: "衝刺" },
];

export const Ch2Page4CorePlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const ease = { ...clamp, easing: EASE };

  // ── S10：標題＋定義＋觀察提示 ──
  const aOut = interpolate(frame, A_OUT, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const defOp = interpolate(frame, [24, 54], [0, 1], clamp);
  // 提示：等定義句出現一陣子後才升起；用 interpolate＋ease-out（比照 P1，無 spring 回彈／抖動）
  const promptOp = interpolate(frame, [92, 114], [0, 1], clamp);
  const promptY = interpolate(frame, [92, 112], [30, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // ── 影片：標題建立後由下往上淡入 → 滑左縮小＋上移 ──
  const videoOp = interpolate(frame, VIDEO_IN, [0, 1], clamp);
  const videoRise = interpolate(frame, VIDEO_IN, [70, 0], ease);
  const videoX = interpolate(frame, SHIFT, [VX_CENTER, VX_LEFT], ease);
  const videoY = interpolate(frame, SHIFT, [VY, VY_S12], ease);
  const videoScale = interpolate(frame, SHIFT, [1, 0.82], ease);

  // ── Celeste 標題：先升起建立，再讓影片進場；滑左時淡出 ──
  const celOp = interpolate(frame, TITLE_IN, [0, 1], clamp);
  const celRise = interpolate(frame, TITLE_IN, [20, 0], ease);
  const headerOut = interpolate(frame, SHIFT, [1, 0], clamp);

  // ── S12：右側三動作 ──
  const headIn = spring({
    frame: frame - INFO_START,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S10：標題＋定義＋觀察提示 ── */}
      {frame < 220 && (
        <AbsoluteFill
          style={{
            opacity: aOut,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEXT_DARK,
              transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
              opacity: titleIn,
            }}
          >
            核心玩法
          </div>
          <div
            style={{
              marginTop: 56,
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: defOp,
              whiteSpace: "nowrap",
            }}
          >
            玩家在遊戲中<span style={KEY}>最常重複的動作</span>
          </div>
          <div
            style={{
              marginTop: 64,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 2,
              color: TEXT_DARK,
              background: CHIP_BG,
              padding: "18px 44px",
              borderRadius: 999,
              opacity: promptOp,
              transform: `translateY(${promptY}px)`,
              whiteSpace: "nowrap",
            }}
          >
            👀 觀察：哪些動作最常重複？
          </div>
        </AbsoluteFill>
      )}

      {/* ── Celeste 標題（S11 建立 → S12 淡出） ── */}
      {frame >= TITLE_IN[0] && frame < 544 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 215,
            transform: `translate(-50%, ${celRise}px)`,
            opacity: celOp * headerOut,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: 4,
            color: TEXT_DARK,
            whiteSpace: "nowrap",
          }}
        >
          Celeste
        </div>
      )}

      {/* ── 影片（置中建立 → 滑左縮小＋上移）；Sequence 從建立段才開始播 ── */}
      {frame >= VIDEO_START && (
        <div
          style={{
            position: "absolute",
            left: videoX,
            top: videoY,
            width: VW,
            height: VH,
            transform: `translate(-50%, calc(-50% + ${videoRise}px)) scale(${videoScale})`,
            opacity: videoOp,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: `0 24px 60px ${withAlpha(BLACK, 0.18)}`,
            border: `1px solid ${BORDER_LIGHT}`,
            backgroundColor: BLACK,
          }}
        >
          <Sequence from={VIDEO_START} layout="none">
            <OffthreadVideo
              src={VIDEO}
              volume={VIDEO_VOLUME}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Sequence>
        </div>
      )}

      {/* ── S12：右側三動作（跳躍／攀牆／衝刺） ── */}
      {frame >= INFO_START && (
        <>
          <div
            style={{
              position: "absolute",
              left: COL_X,
              top: ACT_HEAD,
              transform: `translate(-50%, ${interpolate(headIn, [0, 1], [20, 0])}px)`,
              opacity: headIn,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: 2,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            最常重複的 3 個動作
          </div>

          {ACTIONS.map((a, i) => {
            const s = spring({
              frame: frame - ACT_START[i],
              fps,
              config: { damping: 15, stiffness: 130 },
            });
            const y = 437 + i * 160;
            return (
              <div
                key={a.label}
                style={{
                  position: "absolute",
                  left: COL_X,
                  top: y,
                  transform: `translate(-50%, -50%) translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
                  opacity: s,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: WHITE,
                  border: `2px solid ${BORDER_LIGHT}`,
                  borderRadius: 18,
                  padding: "20px 48px",
                  boxShadow: `0 12px 28px ${withAlpha(BLACK, 0.06)}`,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 48 }}>{a.emoji}</span>
                <span
                  style={{
                    fontSize: 46,
                    fontWeight: 800,
                    color: TEXT_DARK,
                    letterSpacing: 2,
                  }}
                >
                  {a.label}
                </span>
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
