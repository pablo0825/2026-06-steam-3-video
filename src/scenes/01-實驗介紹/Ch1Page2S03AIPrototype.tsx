import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLACK,
  BLUE,
  CAT_ART,
  CAT_CODE,
  CAT_PLAN,
  GREEN,
  NEUTRAL_50,
  NEUTRAL_200,
  NEUTRAL_400,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { WindowFrame } from "../../components/WindowFrame";
import { VerdictBadge } from "../../components/VerdictBadge";
import { FONT, clamp, easeOutExpo, easeStandard } from "../../theme/motion";

// 第 1 集・第 2 頁・S03：AI → 程式/企劃/美術 → 聚合成可以玩的遊戲原型（390 幀）
//   原本被拆成 S03(AI 出現)/S04(連三領域)/S05(聚合) 三顆，此處合併回單一連續鏡頭：
//   開場先留 30 幀白底 → AI 置中彈入 → 上移到上方 → 線往下連三領域 → 三領域聚合淡出、
//   視窗成形，視窗內角色跳過兩個平台抵達終點（迷你遊戲原型），下方出「可以玩的遊戲原型」。
//   內容一律以 f = frame - HOLD 計時（與 S22 同慣例），CONTENT_OUT 則用絕對 frame。
const HOLD = 30; // 開場留白：內容延後這麼多幀才開始
// 提早幾幀淡完，讓完全淡出的白底留住尾巴（386~389 維持全淡出），避免只閃 1 幀。
const CONTENT_OUT = [380, 385] as const;

const AI_X = 960;
const AI_Y_CENTER = 540;
const AI_Y_TOP = 300;
const AI_R = 95;

const NODE_R = 78;
const DOMAIN_Y = 760;
const CENTER = { x: 960, y: 540 };

// AI 上移
const AI_MOVE = [48, 78] as const;
// 三領域聚合
const CONVERGE = [210, 258] as const;

// 第三拍：視窗內迷你跳關（視窗成形 → 角色跳兩平台到終點）
const WIN_START = 232;
const WIN_LEFT = 440;
const WIN_TOP = 200;
const WIN_W = 1040;
const TITLE_H = 56;
const CANVAS_H = 520;
const FLOOR_Y = 440; // 地板頂面（canvas 座標）
const CHAR_W = 56;
const CHAR_H = 84;
const JUMP_H = 90;
// 平台（canvas 座標）：A、B、終點 C
const PLATFORMS = [
  { x: 290, y: 350, w: 150 },
  { x: 545, y: 265, w: 150 },
  { x: 800, y: 180, w: 170 },
] as const;
// 落點（角色底部中心，canvas 座標）
const W0 = { x: 150, y: FLOOR_Y };
const WP = [
  { x: 365, y: 350 },
  { x: 620, y: 265 },
  { x: 885, y: 180 },
] as const;
const HOPS = [
  { from: W0, to: WP[0], t0: 256, t1: 270 },
  { from: WP[0], to: WP[1], t0: 272, t1: 286 },
  { from: WP[1], to: WP[2], t0: 288, t1: 302 },
] as const;

type Domain = {
  label: string;
  emoji: string;
  color: string;
  x: number;
  lineStart: number;
  iconStart: number;
};

const DOMAINS: Domain[] = [
  { label: "程式", emoji: "💻", color: CAT_CODE, x: 480, lineStart: 90, iconStart: 107 },
  { label: "企劃", emoji: "📋", color: CAT_PLAN, x: 960, lineStart: 118, iconStart: 135 },
  { label: "美術", emoji: "🎨", color: CAT_ART, x: 1440, lineStart: 146, iconStart: 163 },
];

export const Ch1Page2S03AIPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - HOLD; // 內容的時間軸（開場留白後才起算）

  const opacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);

  // AI：置中彈入 → 上移到上方 → 聚合階段淡出。
  const aiIn = spring({ frame: f, fps, config: { damping: 12, stiffness: 120 } });
  const aiY = interpolate(f, AI_MOVE, [AI_Y_CENTER, AI_Y_TOP], easeOutExpo);
  const aiOpacity =
    interpolate(f, [0, 10], [0, 1], clamp) *
    interpolate(f, [210, 245], [1, 0], clamp);

  // 三領域聚合進度、連線淡出。
  const converge = interpolate(f, CONVERGE, [0, 1], easeStandard);
  const lineFade = interpolate(f, [210, 228], [1, 0], clamp);

  // 第三拍：視窗成形、角色跳關、旗子升起、下方標籤。
  const winSpring = spring({
    frame: f - WIN_START,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const winVisible = f >= WIN_START - 2;
  const flagRaise = interpolate(f, [300, 314], [0, 1], easeOutExpo);
  // 旗子升完後，字才進場（原本兩者幾乎同時）。
  const labelIn = interpolate(f, [320, 336], [0, 1], easeOutExpo);

  // 角色位置（逐段拋物線跳躍）＋落地壓扁。
  let charX = W0.x;
  let charBottom = W0.y;
  let charSy = 1;
  for (let i = 0; i < HOPS.length; i++) {
    const h = HOPS[i];
    if (f >= h.t1) {
      charX = h.to.x;
      charBottom = h.to.y;
    } else if (f >= h.t0) {
      const p = (f - h.t0) / (h.t1 - h.t0);
      charX = interpolate(p, [0, 1], [h.from.x, h.to.x]);
      const baseY = interpolate(p, [0, 1], [h.from.y, h.to.y]);
      charBottom = baseY - JUMP_H * Math.sin(Math.PI * p);
      break;
    } else {
      charX = h.from.x;
      charBottom = h.from.y;
      break;
    }
  }
  for (const h of HOPS) {
    if (f >= h.t1 && f < h.t1 + 6) {
      charSy = interpolate((f - h.t1) / 6, [0, 1], [0.82, 1]);
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity }}>
        {/* AI 定位到上方後，線往下連三領域 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {DOMAINS.map((domain) => {
            const x1 = AI_X;
            const y1 = AI_Y_TOP + AI_R;
            const x2 = domain.x;
            const y2 = DOMAIN_Y - NODE_R;
            const len = Math.hypot(x2 - x1, y2 - y1);
            const progress = interpolate(
              f,
              [domain.lineStart, domain.lineStart + 18],
              [0, 1],
              easeOutExpo,
            );

            return (
              <line
                key={domain.label}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={domain.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - progress)}
                opacity={0.6 * lineFade}
              />
            );
          })}
        </svg>

        {/* AI 節點 */}
        <div
          style={{
            position: "absolute",
            left: AI_X,
            top: aiY,
            width: AI_R * 2,
            height: AI_R * 2,
            marginLeft: -AI_R,
            marginTop: -AI_R,
            borderRadius: "50%",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WHITE,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: 2,
            transform: `scale(${aiIn})`,
            opacity: aiOpacity,
            boxShadow: `0 20px 50px ${withAlpha(BLUE, 0.35)}`,
          }}
        >
          AI
        </div>

        {/* 三領域節點：連線後彈入，聚合階段移向中央、縮小淡出 */}
        {DOMAINS.map((domain) => {
          const built = spring({
            frame: f - domain.iconStart,
            fps,
            config: { damping: 11, stiffness: 130 },
          });
          const cx = interpolate(converge, [0, 1], [domain.x, CENTER.x]);
          const cy = interpolate(converge, [0, 1], [DOMAIN_Y, CENTER.y]);
          const scale = built * interpolate(converge, [0, 1], [1, 0.2]);
          const nodeFade = interpolate(f, [234, 258], [1, 0], clamp);

          return (
            <div
              key={domain.label}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                width: NODE_R * 2,
                height: NODE_R * 2,
                marginLeft: -NODE_R,
                marginTop: -NODE_R,
                transform: `scale(${scale})`,
                opacity: built <= 0 ? 0 : nodeFade,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: WHITE,
                  border: `5px solid ${domain.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 68,
                  boxShadow: `0 12px 30px ${withAlpha(BLACK, 0.08)}`,
                }}
              >
                {domain.emoji}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 18,
                  fontSize: 40,
                  fontWeight: 700,
                  color: TEXT_DARK,
                  whiteSpace: "nowrap",
                  opacity: interpolate(f, [210, 224], [1, 0], clamp),
                }}
              >
                {domain.label}
              </div>
            </div>
          );
        })}

        {/* 第三拍：視窗（Ch4 風格）內的迷你跳關 */}
        {winVisible && (
          <WindowFrame
            title="遊戲原型"
            titleStyle={{ letterSpacing: 2 }}
            barHeight={TITLE_H}
            style={{
              position: "absolute",
              left: WIN_LEFT,
              top: WIN_TOP,
              width: WIN_W,
              opacity: winSpring,
              transform: `scale(${interpolate(winSpring, [0, 1], [0.94, 1])})`,
              transformOrigin: "center center",
            }}
          >
            {/* 遊戲畫面 */}
            <div style={{ position: "relative", width: WIN_W, height: CANVAS_H, background: WHITE, overflow: "hidden" }}>
              {/* 地板 */}
              <div style={{ position: "absolute", left: 0, top: FLOOR_Y, width: WIN_W, height: CANVAS_H - FLOOR_Y, display: "flex" }}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "100%",
                      background: NEUTRAL_200,
                      borderRight: `1px solid ${NEUTRAL_400}`,
                      borderTop: `3px solid ${NEUTRAL_400}`,
                    }}
                  />
                ))}
              </div>

              {/* 平台 */}
              {PLATFORMS.map((p) => (
                <div
                  key={p.x}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: p.w,
                    height: 22,
                    background: NEUTRAL_200,
                    borderTop: `4px solid ${NEUTRAL_400}`,
                    borderRadius: 8,
                  }}
                />
              ))}

              {/* 終點旗杆（角色抵達時展開旗面） */}
              <div
                style={{
                  position: "absolute",
                  left: PLATFORMS[2].x + PLATFORMS[2].w - 26,
                  top: PLATFORMS[2].y - 90,
                  width: 4,
                  height: 90,
                  background: SUBTLE,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: PLATFORMS[2].x + PLATFORMS[2].w - 22,
                  top: PLATFORMS[2].y - 88,
                  width: 46,
                  height: 30,
                  background: GREEN,
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  transform: `scaleX(${flagRaise})`,
                  transformOrigin: "left center",
                }}
              />

              {/* 角色 */}
              <div
                style={{
                  position: "absolute",
                  left: charX - CHAR_W / 2,
                  top: charBottom - CHAR_H,
                  width: CHAR_W,
                  height: CHAR_H,
                  transform: `scaleY(${charSy})`,
                  transformOrigin: "center bottom",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      transform: "translateX(-50%)",
                      width: "54%",
                      aspectRatio: "1",
                      borderRadius: "50%",
                      background: BLUE,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 0,
                      transform: "translateX(-50%)",
                      width: "78%",
                      height: "62%",
                      borderRadius: "42% 42% 20% 20%",
                      background: BLUE,
                    }}
                  />
                </div>
              </div>
            </div>
          </WindowFrame>
        )}

        {/* 下方標籤：綠色 ✓ 徽章（原位置再下移 16px） */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: WIN_TOP + TITLE_H + CANVAS_H + 44 + 16,
            transform: `translate(-50%, ${interpolate(labelIn, [0, 1], [20, 0])}px)`,
            opacity: labelIn,
          }}
        >
          <VerdictBadge
            kind="pass"
            label="可以玩的遊戲原型"
            labelSize={52}
            labelColor={TEXT_DARK}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
