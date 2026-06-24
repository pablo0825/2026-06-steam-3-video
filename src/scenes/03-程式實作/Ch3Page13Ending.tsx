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
import {
  BLACK,
  BLUE,
  NEUTRAL_300,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 13 頁：結尾（連續上捲）
//   S24：主持人照片＋感謝聆聽 → 製作團隊、補助計畫與素材來源上捲 → 黑場

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const HOST_PHOTO = staticFile("01-實驗介紹/host-yujia.jpg");

const HOLD_FRAMES = 120;
const SCROLL_START = HOLD_FRAMES;
const SCROLL_END = 660;
const SCROLL_DISTANCE = 3200;
const FADE_START = 630;
const FADE_END = 660;

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
  label: "遊戲畫面";
  items: CreditSource[];
};

const CREDIT_SECTIONS: CreditSection[] = [
  {
    label: "遊戲畫面",
    items: [
      {
        title: "Rhythm Doctor",
        creator: "7th Beat Games",
        detail: "遊戲畫面自行錄製",
      },
      {
        title: "Celeste",
        creator: "Extremely OK Games",
        detail: "遊戲畫面自行錄製 · 遊戲發行於 2018/01/25",
      },
    ],
  },
];

const PROJECT_NAME =
  "STEAM教育新篇章：以永續發展教育培育產業導向之高層次思維能力課程發展與評估－應用STEAM導向之探索解謎遊戲培育數位遊戲產業高層次思維之永續發展人才(3/3)";

export const Ch3Page13Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const scrollY = interpolate(
    frame,
    [SCROLL_START, SCROLL_END],
    [0, -SCROLL_DISTANCE],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const blackIn = interpolate(frame, [FADE_START, FADE_END], [0, 1], {
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
        }}
      >
        {/* S24：主持人照片與感謝文字 */}
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
          <Img
            src={HOST_PHOTO}
            style={{
              width: 600,
              height: "auto",
              borderRadius: 12,
              boxShadow: `0 16px 40px ${withAlpha(BLACK, 0.12)}`,
            }}
            from={-13}
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

        {/* 製作團隊、計畫資訊與素材來源 */}
        <div
          style={{
            marginTop: 360,
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

      <AbsoluteFill style={{ backgroundColor: BLACK, opacity: blackIn }} />
    </AbsoluteFill>
  );
};
