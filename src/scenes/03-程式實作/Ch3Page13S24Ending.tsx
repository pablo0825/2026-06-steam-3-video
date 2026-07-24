import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLUE, NEUTRAL_300, SUBTLE, TEXT_DARK, WHITE } from "../../theme/colors";
import { FONT } from "../../theme/motion";

// 第 3 集・第 13 頁・S24：結尾——製作團隊、補助計畫與素材來源上捲，最後淡出收尾。
//   內容直接從畫面下方捲上來（比照 Ch2 S23／Ch1 S26），無主持人照片開場、無黑場。
//   本集沒有使用圖片素材，素材來源僅列遊戲畫面／背景音樂／音效。
const SCROLL_END = 562;
const SCROLL_FROM = 1120; // 開場：第一行落在畫面底部下方（畫面外）
const SCROLL_TO = -1790; // 結尾：素材來源捲到上方（跑滿全片），最後 30 幀邊捲邊淡出
const FADE_START = 532;
const FADE_END = 562;

const FS_TITLE = 60;
const FS_BODY = 32;
const FS_LABEL = 26;
const FS_META = 24;

type CreditSource = {
  title: string;
  creator: string;
  detail: string;
  domain?: string;
};

type CreditSection = {
  label: "遊戲畫面" | "背景音樂" | "音效";
  items: CreditSource[];
};

const CREDIT_SECTIONS: CreditSection[] = [
  {
    label: "遊戲畫面",
    items: [
      {
        title: "Celeste",
        creator: "Extremely OK Games",
        detail: "遊戲畫面自行錄製 · 遊戲發行於 2018/01/25",
      },
      {
        title: "Rhythm Doctor",
        creator: "7th Beat Games",
        detail: "遊戲畫面自行錄製 · 遊戲發行於 2025/12/07",
      },
    ],
  },
  {
    label: "背景音樂",
    items: [
      {
        title:
          "“3AM Silence - minimal lo-fi beat with deep atmosphere and slow rhythm”",
        creator: "nyxaurora",
        detail: "Pixabay · Pixabay Content License · 2026/05/04",
      },
    ],
  },
  {
    label: "音效",
    items: [
      {
        title: "“Opening bottle with falling cap”",
        creator: "freesound_community",
        detail: "Pixabay · Pixabay Content License · 2022/8/31",
      },
    ],
  },
];

const PROJECT_NAME =
  "STEAM教育新篇章：以永續發展教育培育產業導向之高層次思維能力課程發展與評估－應用STEAM導向之探索解謎遊戲培育數位遊戲產業高層次思維之永續發展人才(3/3)";

export const Ch3Page13S24Ending: React.FC = () => {
  const frame = useCurrentFrame();

  const scrollY = interpolate(frame, [0, SCROLL_END], [SCROLL_FROM, SCROLL_TO], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentOpacity = interpolate(frame, [FADE_START, FADE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: WHITE, fontFamily: FONT, overflow: "hidden" }}
    >
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
          opacity: contentOpacity,
        }}
      >
        {/* 製作團隊、計畫資訊與素材來源 */}
        <div
          style={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: FS_TITLE,
              fontWeight: 800,
              color: BLUE,
              letterSpacing: 4,
            }}
          >
            製作團隊
          </div>

          <div
            style={{
              marginTop: 48,
              fontSize: FS_LABEL,
              color: SUBTLE,
              fontWeight: 600,
            }}
          >
            製作單位
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: FS_BODY,
              color: TEXT_DARK,
              fontWeight: 500,
            }}
          >
            南臺科技大學 多媒體與電腦娛樂科學系
          </div>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              { role: "教授", name: "黃永銘" },
              { role: "研究助理", name: "郭育嘉" },
              { role: "研究生", name: "李哲偉" },
            ].map((member) => (
              <div
                key={member.name}
                style={{ display: "flex", alignItems: "center", gap: 24 }}
              >
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
                  {member.role}
                </span>
                <span
                  style={{
                    width: 200,
                    textAlign: "left",
                    fontSize: FS_BODY,
                    color: TEXT_DARK,
                    fontWeight: 700,
                  }}
                >
                  {member.name}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 56,
              width: 560,
              height: 2,
              background: NEUTRAL_300,
            }}
          />

          <div
            style={{
              marginTop: 48,
              fontSize: FS_LABEL,
              color: SUBTLE,
              fontWeight: 600,
            }}
          >
            經費補助單位
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: FS_BODY,
              color: TEXT_DARK,
              fontWeight: 700,
            }}
          >
            國科會
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: FS_LABEL,
              color: SUBTLE,
              fontWeight: 600,
            }}
          >
            計畫名稱
          </div>
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
            {PROJECT_NAME}
          </div>

          <div
            style={{
              marginTop: 170,
              fontSize: FS_TITLE,
              fontWeight: 800,
              color: BLUE,
              letterSpacing: 4,
            }}
          >
            素材來源
          </div>

          {CREDIT_SECTIONS.map((section) => (
            <div
              key={section.label}
              style={{
                marginTop: 48,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: FS_LABEL,
                  color: SUBTLE,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                {section.label}
              </div>

              {section.items.map((item) => (
                <div
                  key={`${section.label}-${item.title}`}
                  style={{
                    marginTop: 18,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      maxWidth: 1020,
                      fontSize: FS_BODY,
                      lineHeight: 1.45,
                      color: TEXT_DARK,
                      fontWeight: 600,
                    }}
                  >
                    {item.title} — {item.creator}
                  </div>
                  <div
                    style={{
                      marginTop: 7,
                      fontSize: FS_META,
                      lineHeight: 1.45,
                      color: SUBTLE,
                      fontWeight: 500,
                    }}
                  >
                    {item.detail}
                    {item.domain ? ` · ${item.domain}` : ""}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
