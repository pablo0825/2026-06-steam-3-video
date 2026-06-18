import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, BLUE, NEUTRAL_300, SUBTLE, TEXT_DARK, WHITE, withAlpha } from "../theme/colors";

// 第 10 頁：結尾（連續上捲）
//   ① 主持人照片 ＋「感謝各位聆聽！」置中停住讓人讀
//   ② 整張畫布等速上捲，帶出「感謝製作團隊」名單
//   ③ 名單最後接知點 logo，捲到定位後停住收尾

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LOGO = staticFile("知點LOGO_FIN-03.png");
const HOST_PHOTO = staticFile("host-yujia.jpg"); // 主持人照片

// ── 節奏（30fps）──
// 流程：①照片停住讓人讀 → ②名單整段上捲「離開畫面」 → ③獨立 logo 結尾卡淡入置中
const HOLD_FRAMES = 90; // ① 停住讓人讀的時間
const SCROLL_START = HOLD_FRAMES; // 開始上捲
const SCROLL_END = 540; // 名單捲動結束（此時內容已捲離畫面上緣）
const SCROLL_DISTANCE = 3000; // 名單往上捲的總距離（px；需大於內容總高，確保完全離開畫面）
const LOGO_IN_START = 520; // ③ logo 結尾卡開始淡入（與名單離場略重疊，避免空檔）
const LOGO_IN_END = 560; // logo 完全到位（淡入縮短為 40 frames，收尾更俐落）

// ── 名單字級階梯（藍＝標題、深＝內容、灰＝標籤）──
const FS_TITLE = 60; // 段落標題（製作團隊）
const FS_BODY = 32; // 內容（單位、人名、值、計畫全文）
const FS_LABEL = 26; // 標籤（製作單位、role、經費補助單位、計畫名稱）
const FS_META = 24; // 引用 meta 小字（來源・授權・日期）

export const Page10Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ① 進場：照片＋文字淡入
  const introIn = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });

  // ② 名單整段上捲（捲離畫面上緣）
  const scrollY = interpolate(frame, [SCROLL_START, SCROLL_END], [0, -SCROLL_DISTANCE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ③ 獨立 logo 結尾卡：淡入＋微放大，停在畫面正中央
  const logoIn = interpolate(frame, [LOGO_IN_START, LOGO_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoIn, [0, 1], [0.86, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT, overflow: "hidden" }}>
      {/* 上捲的長畫布：①感謝聆聽 → ②名單 → ③logo */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 0,
          transform: `translate(-50%, ${scrollY}px)`,
          width: 1120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* ── ① 主持人照片 ＋ 感謝各位聆聽 ──────────────── */}
        {/* 起始時這一塊置中於畫面（top 210 + 半高 ≈ 540） */}
        <div
          style={{
            marginTop: 210,
            opacity: introIn,
            transform: `scale(${interpolate(introIn, [0, 1], [0.92, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 主持人照片（完整顯示，3:2） */}
          <Img
            src={HOST_PHOTO}
            style={{
              width: 600,
              height: "auto",
              borderRadius: 12,
              boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.12)}`,
            }}
          />

          <div
            style={{
              marginTop: 44,
              fontSize: 100,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            感謝各位聆聽！
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 46,
              fontWeight: 500,
              letterSpacing: 4,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            祝大家開發順利
          </div>
        </div>

        {/* ── ② 製作團隊名單（在第①段下方，捲動時進場）────── */}
        <div style={{ marginTop: 360, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: FS_TITLE, fontWeight: 800, color: BLUE, letterSpacing: 4 }}>
            製作團隊
          </div>

          {/* L4 標籤 → L3 製作單位（南臺多樂 › 知點人培室，由大到小） */}
          <div style={{ marginTop: 48, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
            製作單位
          </div>
          <div style={{ marginTop: 10, fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 500 }}>
            南臺科技大學 多媒體與電腦娛樂科學系
          </div>

          {/* L4 標籤 + L3 人名 */}
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { role: "教授", name: "黃永銘" },
              { role: "研究助理", name: "郭育嘉" },
              { role: "研究生", name: "李哲偉" },
            ].map((m) => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span
                  style={{
                    width: 190,
                    textAlign: "right",
                    fontSize: FS_LABEL,
                    color: SUBTLE,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.role}
                </span>
                <span
                  style={{ width: 200, textAlign: "left", fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 700 }}
                >
                  {m.name}
                </span>
              </div>
            ))}
          </div>

          {/* 分隔線 */}
          <div style={{ marginTop: 56, width: 560, height: 2, background: NEUTRAL_300 }} />

          {/* L4 標籤 → L3 內容 */}
          <div style={{ marginTop: 48, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
            經費補助單位
          </div>
          <div style={{ marginTop: 10, fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 700 }}>
            國科會
          </div>

          <div style={{ marginTop: 36, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>計畫名稱</div>
          <div
            style={{
              marginTop: 10,
              maxWidth: 920,
              fontSize: FS_BODY,
              lineHeight: 1.7,
              color: TEXT_DARK,
              fontWeight: 500,
            }}
          >
            STEAM教育新篇章：以永續發展教育培育產業導向之高層次思維能力課程發展與評估－應用STEAM導向之探索解謎遊戲培育數位遊戲產業高層次思維之永續發展人才(3/3)
          </div>

          {/* ── ③ 音樂與音效引用（Freesound・CC0；名單最後、logo 之前）── */}
          <div style={{ marginTop: 170, fontSize: FS_TITLE, fontWeight: 800, color: BLUE, letterSpacing: 4 }}>
            音樂與音效
          </div>

          {/* 背景音樂 */}
          <div style={{ marginTop: 48, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>背景音樂</div>
          <div style={{ marginTop: 10, fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 500 }}>
            “Background Music” — NastelBom
          </div>
          <div style={{ marginTop: 8, fontSize: FS_META, color: SUBTLE, fontWeight: 500 }}>
            Freesound.org · CC0 · 2026/1/9
          </div>

          {/* 音效 */}
          <div style={{ marginTop: 36, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>音效</div>
          <div style={{ marginTop: 10, fontSize: FS_BODY, lineHeight: 1.5, color: TEXT_DARK, fontWeight: 500 }}>
            “Opening bottle with falling cap” — freesound_community
          </div>
          <div style={{ marginTop: 8, fontSize: FS_META, color: SUBTLE, fontWeight: 500 }}>
            Freesound.org · CC0 · 2022/8/31
          </div>
        </div>
      </div>

      {/* ── ③ 知點 logo 結尾卡：名單捲離後，於畫面正中央淡入收尾 ── */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={LOGO}
          style={{
            width: 360,
            height: "auto",
            opacity: logoIn,
            transform: `scale(${logoScale})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
