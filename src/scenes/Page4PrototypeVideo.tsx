import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  BLUE,
  BORDER_LIGHT,
  CHIP_BG,
  RED,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
  YELLOW,
} from "../theme/colors";

// 第 4 頁：播放原型實機影片（直式）+ 右側關鍵詞標註
//   S10：例如，這是我自己做的一個遊戲原型
//   S10.5：先承認「完整度不高」（素材風格不一致 / 還沒有 UI）作為鋪陳，短暫停留後淡出
//   S11：想驗證「觀察機關移動 / 一次出手 / 定生死」的體驗有不有趣

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const VIDEO = staticFile("prototype-demo.mp4");
const VIDEO_VOLUME = 0.25; // 遊戲原聲音量（旁白為主）；要全靜音改成 0

// 影片框（直式 714×1270 → 等比）
const VH = 900;
const VW = Math.round((VH * 714) / 1270); // ≈ 506
const VY = 565;
const VX_CENTER = 960; // S10：置中當主角
const VX_LEFT = 620; // S11：滑到左邊讓出右側
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// S10 → S11 影片移位時間點
const SHIFT_START = 120;
const SHIFT_END = 150;

// S10.5「先承認完整度不高」缺點標註（影片滑到左邊後出現，作為鋪陳）
const FLAW_X = 920; // 缺點標籤起始 x（影片右側，◀ 指回影片）
const FLAW_LEAD_START = 160; // 領頭「完整度不高」
const FLAW_ITEM_START = [184, 206]; // 兩個具體缺點依序出現
const FLAW_OUT_START = 285; // 一起淡出
const FLAW_OUT_END = 308;
const FLAWS: { text: string; y: number }[] = [
  { text: "素材風格不一致", y: 410 },
  { text: "還沒有 UI", y: 540 },
];

// 右側「核心玩法」流程（缺點淡出後接著進場）
const CORE_START = 305; // 核心玩法標題進場
const COL_X = 1400;
type Step = { label: string; color: string; start: number };
const STEPS: Step[] = [
  { label: "觀察機關規律", color: BLUE, start: 325 },
  { label: "抓準時機出手", color: YELLOW, start: 365 },
  { label: "一次定生死", color: RED, start: 405 },
];
const Q_START = 480; // 「想驗證」問句出現

export const Page4PrototypeVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const headIn = spring({ frame: frame - CORE_START, fps, config: { damping: 14, stiffness: 120 } });
  const flawOut = interpolate(frame, [FLAW_OUT_START, FLAW_OUT_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flawLeadIn = spring({ frame: frame - FLAW_LEAD_START, fps, config: { damping: 16, stiffness: 130 } });
  const qIn = spring({ frame: frame - Q_START, fps, config: { damping: 14, stiffness: 120 } });

  // 影片：S10 置中＋微放大 → S11 滑到左邊縮回原寸
  const videoX = interpolate(frame, [SHIFT_START, SHIFT_END], [VX_CENTER, VX_LEFT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const videoScale = interpolate(frame, [SHIFT_START, SHIFT_END], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* 影片框 */}
      <div
        style={{
          position: "absolute",
          left: videoX,
          top: VY,
          width: VW,
          height: VH,
          marginLeft: -VW / 2,
          marginTop: -VH / 2,
          transform: `scale(${videoScale})`,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: `0 24px 60px ${withAlpha(BLACK, 0.18)}`,
          border: `1px solid ${BORDER_LIGHT}`,
          backgroundColor: BLACK,
        }}
      >
        <OffthreadVideo
          src={VIDEO}
          volume={VIDEO_VOLUME}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 「我的原型」標籤 */}
      <div
        style={{
          position: "absolute",
          left: videoX,
          top: VY - VH / 2 - 55,
          transform: "translateX(-50%)",
          opacity: chipOp,
          background: CHIP_BG,
          color: TEXT_DARK,
          fontSize: 34,
          fontWeight: 700,
          padding: "10px 30px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        我的原型
      </div>

      {/* S10.5 缺點標註（鋪陳）：領頭「完整度不高」＋兩個指向影片的灰色小標籤，停留後一起淡出 */}
      <div
        style={{
          position: "absolute",
          left: FLAW_X,
          top: 250,
          opacity: flawLeadIn * flawOut,
          transform: `translateX(${interpolate(flawLeadIn, [0, 1], [20, 0])}px)`,
          fontSize: 32,
          fontWeight: 800,
          color: SUBTLE,
          letterSpacing: 1,
          whiteSpace: "nowrap",
        }}
      >
        完整度不高
      </div>
      {FLAWS.map((f, i) => {
        const fi = spring({ frame: frame - FLAW_ITEM_START[i], fps, config: { damping: 16, stiffness: 140 } });
        return (
          <div
            key={f.text}
            style={{
              position: "absolute",
              left: FLAW_X,
              top: f.y,
              opacity: fi * flawOut,
              transform: `translateX(${interpolate(fi, [0, 1], [24, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: SUBTLE, fontSize: 30, fontWeight: 800 }}>◀</span>
            <span
              style={{
                background: CHIP_BG,
                color: SUBTLE,
                border: `1px solid ${BORDER_LIGHT}`,
                fontSize: 30,
                fontWeight: 700,
                padding: "10px 24px",
                borderRadius: 14,
                whiteSpace: "nowrap",
              }}
            >
              {f.text}
            </span>
          </div>
        );
      })}

      {/* 右側標題：核心玩法 */}
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 150,
          transform: `translate(-50%, ${interpolate(headIn, [0, 1], [20, 0])}px)`,
          opacity: headIn,
          fontSize: 40,
          fontWeight: 800,
          color: SUBTLE,
          letterSpacing: 2,
        }}
      >
        核心玩法
      </div>

      {/* 三步驟流程（向下箭頭串接） */}
      {STEPS.map((st, i) => {
        const s = spring({ frame: frame - st.start, fps, config: { damping: 14, stiffness: 120 } });
        const y = 290 + i * 150;
        const arrowOp = interpolate(frame, [st.start - 12, st.start], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <React.Fragment key={st.label}>
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: COL_X,
                  top: y - 75,
                  transform: "translate(-50%, -50%)",
                  opacity: arrowOp,
                  color: SUBTLE,
                  fontSize: 46,
                  fontWeight: 800,
                }}
              >
                ↓
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: COL_X,
                top: y,
                transform: `translate(-50%, -50%) scale(${s})`,
                opacity: s <= 0 ? 0 : 1,
                background: WHITE,
                border: `4px solid ${st.color}`,
                color: TEXT_DARK,
                fontSize: 48,
                fontWeight: 800,
                padding: "18px 44px",
                borderRadius: 18,
                whiteSpace: "nowrap",
                boxShadow: `0 10px 24px ${withAlpha(BLACK, 0.06)}`,
              }}
            >
              {st.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* 想驗證的是 */}
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 700,
          transform: `translate(-50%, ${interpolate(qIn, [0, 1], [20, 0])}px)`,
          opacity: qIn,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, color: SUBTLE, marginBottom: 18 }}>
          想驗證的是
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.4, whiteSpace: "nowrap" }}>
          這樣好玩嗎？
          <br />
          會讓人想一直玩嗎？
        </div>
      </div>
    </AbsoluteFill>
  );
};
