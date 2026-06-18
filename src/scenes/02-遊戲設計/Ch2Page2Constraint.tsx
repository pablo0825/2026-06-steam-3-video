import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CHIP_BG, SUBTLE, TEXT_DARK, WHITE, YELLOW, withAlpha } from "../../theme/colors";

// 第 2 集・第 2 頁：限制設計（定義 ＋ Game Jam ＋ 轉場提問）
//   S4：標題「限制設計」＋定義句（關鍵詞「有限的條件」黃色粗體強調、說明句 SUBTLE 弱化）→ 帶出「Game Jam」例子
//   S5：① 標題「Game Jam」先升起 → ② 圖片由下往上滑入 → ③ 大圖滑左縮小＋說明 A → ④ 說明 A 上滑替換成說明 B
//   S6：轉場提問卡（整頁單獨呈現）「『遊戲本體』的限制設計呢？」（遊戲本體黃色強調）＋藍色箭頭 → 接下一頁節奏醫生

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const GAMEJAM = staticFile("02-遊戲設計/gamejam.png"); // Game Jam 情境照（Global Game Jam・教學用途）

const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ── 節奏（30fps；總長 930 frames）──
// S4：0–224 ｜（留白 ~0.8s）｜ S5：248–724 ｜ S6 轉場卡：716–930
const A_OUT = [196, 224] as const; // S4 提前淡完，避免與 S5 重疊
const S5_OUT = [694, 720] as const;

// S4 內部
const DEF_START = 40;
const GJ_TAG_START = 150;

// S5 內部
const TITLE_IN = [248, 278] as const; // ① 標題「Game Jam」先升起淡入
const IMG_IN = [288, 326] as const; // ② 圖片後出（由下往上滑入）
const MOVE = [372, 408] as const; // ③ 大圖滑左＋縮小
const ESTAB_OUT = [372, 402] as const; // 標題／圖註於移動時淡出
const A_IN = [414, 442] as const; // 說明 A 進場
const A_OUT_T = [534, 558] as const; // 說明 A 上滑離場
const B_IN = [556, 586] as const; // 說明 B 上滑進場

// S6 轉場卡內部
const CARD_IN = [722, 758] as const;
const ARROW_START = 820;

// 重點字（黃色粗體＝強調色，依 token 語意 YELLOW＝強調）
const KEY: React.CSSProperties = { color: YELLOW, fontWeight: 800 };

export const Ch2Page2Constraint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { ...clamp, easing: EASE };

  // ── S4 ──
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const defOpacity = interpolate(frame, [DEF_START, DEF_START + 18], [0, 1], clamp);
  const gjTag = spring({ frame: frame - GJ_TAG_START, fps, config: { damping: 15, stiffness: 120 } });
  const aOpacity = interpolate(frame, A_OUT, [1, 0], clamp);

  // ── S5 ──
  const s5Opacity = interpolate(frame, S5_OUT, [1, 0], clamp); // 僅整段淡出
  // ① 標題「Game Jam」先升起
  const gjTitleOp = interpolate(frame, TITLE_IN, [0, 1], clamp) * interpolate(frame, ESTAB_OUT, [1, 0], clamp);
  const gjTitleRise = interpolate(frame, TITLE_IN, [20, 0], ease);
  // ② 圖片由下往上滑入（不放大）
  const imgOpacity = interpolate(frame, IMG_IN, [0, 1], clamp);
  const imgRise = interpolate(frame, IMG_IN, [70, 0], ease);
  // ③ 大圖滑左縮小
  const imgCx = interpolate(frame, MOVE, [960, 548], ease);
  const imgScale = interpolate(frame, MOVE, [1, 0.62], ease);
  const capOpacity = interpolate(frame, IMG_IN, [0, 1], clamp) * interpolate(frame, ESTAB_OUT, [1, 0], clamp);
  // 說明 A：進場下→上、離場上滑淡出
  const aTy = interpolate(frame, A_IN, [30, 0], clamp) + interpolate(frame, A_OUT_T, [0, -44], clamp);
  const aOp = interpolate(frame, A_IN, [0, 1], clamp) * interpolate(frame, A_OUT_T, [1, 0], clamp);
  // 說明 B：上滑進場
  const bTy = interpolate(frame, B_IN, [44, 0], clamp);
  const bOp = interpolate(frame, B_IN, [0, 1], clamp);

  // ── S6 轉場卡 ──
  const cardIn = interpolate(frame, CARD_IN, [0, 1], clamp);
  const arrowOpacity = interpolate(frame, [ARROW_START, ARROW_START + 20], [0, 1], clamp);
  // 箭頭「只往右」輕推（0→8→0，提供前進方向感，不左右搖晃）
  const arrowNudge = frame >= ARROW_START ? ((1 - Math.cos((frame - ARROW_START) / 7)) / 2) * 8 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* ── S4：定義 ── */}
      {frame < 228 && (
        <AbsoluteFill style={{ opacity: aOpacity, justifyContent: "center", alignItems: "center" }}>
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
            限制設計
          </div>

          <div
            style={{
              marginTop: 56,
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: defOpacity,
              whiteSpace: "nowrap",
            }}
          >
            就是在<span style={KEY}>有限的條件</span>下，去做設計
          </div>

          <div
            style={{
              marginTop: 64,
              fontSize: 34,
              fontWeight: 700,
              color: TEXT_DARK,
              background: CHIP_BG,
              padding: "16px 40px",
              borderRadius: 999,
              letterSpacing: 2,
              opacity: gjTag,
              transform: `translateY(${interpolate(gjTag, [0, 1], [30, 0])}px)`,
            }}
          >
            💡 大家都知道的例子：Game Jam
          </div>
        </AbsoluteFill>
      )}

      {/* ── S5：Game Jam（標題先出 → 圖片上滑 → 滑左縮小 → 說明 A／B） ── */}
      {frame >= 244 && frame < 730 && (
        <AbsoluteFill style={{ opacity: s5Opacity }}>
          {/* ① 標題（先升起淡入） */}
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 196,
              transform: `translate(-50%, calc(-50% + ${gjTitleRise}px))`,
              fontSize: 60,
              fontWeight: 800,
              letterSpacing: 4,
              color: TEXT_DARK,
              opacity: gjTitleOp,
            }}
          >
            Game Jam
          </div>

          {/* ② 圖片（由下往上滑入）→ ③ 滑左縮小 */}
          <Img
            src={GAMEJAM}
            style={{
              position: "absolute",
              left: imgCx,
              top: 540,
              width: 820,
              height: 512,
              objectFit: "cover",
              transform: `translate(-50%, calc(-50% + ${imgRise}px)) scale(${imgScale})`,
              opacity: imgOpacity,
              borderRadius: 20,
              boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.16)}`,
            }}
          />

          {/* 圖註（隨圖片一起由下往上升＋淡入，移動時淡出） */}
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 838,
              transform: `translate(-50%, calc(-50% + ${imgRise}px))`,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 1,
              color: SUBTLE,
              opacity: capOpacity,
            }}
          >
            Global Game Jam・教學用途
          </div>

          {/* 說明 A：限時 → 激發創意 */}
          <div style={{ position: "absolute", left: 1010, top: 540, transform: "translateY(-50%)", width: 800 }}>
            <div style={{ opacity: aOp, transform: `translateY(${aTy}px)` }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: TEXT_DARK, letterSpacing: 1 }}>
                ⏱ 限時 1～3 天做出遊戲
              </div>
              <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, color: SUBTLE, lineHeight: 1.5 }}>
                用時間壓力，激發開發者的創意
              </div>
            </div>
          </div>

          {/* 說明 B：限制偏活動層面（上滑替換 A） */}
          <div style={{ position: "absolute", left: 1010, top: 540, transform: "translateY(-50%)", width: 800 }}>
            <div style={{ opacity: bOp, transform: `translateY(${bTy}px)` }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: TEXT_DARK, letterSpacing: 1 }}>
                不過，它的限制偏<span style={KEY}>「活動層面」</span>
              </div>
              <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, color: SUBTLE, lineHeight: 1.5 }}>
                與遊戲本體較無關
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── S6：轉場提問卡（整頁單獨呈現） ── */}
      {frame >= 716 && (
        <AbsoluteFill
          style={{
            opacity: cardIn,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: 4,
              color: TEXT_DARK,
              transform: `scale(${interpolate(cardIn, [0, 1], [0.94, 1])})`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={KEY}>「遊戲本體」</span>的限制設計呢？
          </div>

          <div
            style={{
              marginTop: 56,
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: 3,
              color: BLUE,
              opacity: arrowOpacity,
            }}
          >
            來看下一個案例{" "}
            <span style={{ display: "inline-block", transform: `translateX(${arrowNudge}px)` }}>→</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
