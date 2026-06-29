import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLUE, NEUTRAL_300, NEUTRAL_50, SUBTLE, TEXT_DARK } from "../../theme/colors";
import { FONT, clamp } from "../../theme/motion";

// 第 1 集・第 10 頁・S26：製作團隊與素材來源上捲（480 幀，依既有實作節奏）
const CONTENT_OUT = [450, 480] as const;
const SCROLL_END = 450;
const SCROLL_DISTANCE = 3000;
const FS_TITLE = 60;
const FS_BODY = 32;
const FS_LABEL = 26;
const FS_META = 24;

export const Ch1Page10S26Credits: React.FC = () => {
  const frame = useCurrentFrame();

  const contentOpacity = interpolate(frame, CONTENT_OUT, [1, 0], clamp);
  const scrollY = interpolate(frame, [0, SCROLL_END], [0, -SCROLL_DISTANCE], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
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
          <div style={{ marginTop: 660, display: "flex", flexDirection: "column", alignItems: "center" }}>
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

            <div style={{ marginTop: 48, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
              製作單位
            </div>
            <div style={{ marginTop: 10, fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 500 }}>
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
                <div key={member.name} style={{ display: "flex", alignItems: "center", gap: 24 }}>
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

            <div style={{ marginTop: 56, width: 560, height: 2, background: NEUTRAL_300 }} />

            <div style={{ marginTop: 48, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
              經費補助單位
            </div>
            <div style={{ marginTop: 10, fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 700 }}>
              國科會
            </div>

            <div style={{ marginTop: 36, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
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
              STEAM教育新篇章：以永續發展教育培育產業導向之高層次思維能力課程發展與評估－應用STEAM導向之探索解謎遊戲培育數位遊戲產業高層次思維之永續發展人才(3/3)
            </div>

            <div style={{ marginTop: 170, fontSize: FS_TITLE, fontWeight: 800, color: BLUE, letterSpacing: 4 }}>
              素材來源
            </div>

            <div style={{ marginTop: 48, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
              背景音樂
            </div>
            <div style={{ marginTop: 10, fontSize: FS_BODY, color: TEXT_DARK, fontWeight: 500 }}>
              “Background Music” — NastelBom
            </div>
            <div style={{ marginTop: 8, fontSize: FS_META, color: SUBTLE, fontWeight: 500 }}>
              Pixabay · Pixabay Content License · 2026/2/19
            </div>

            <div style={{ marginTop: 36, fontSize: FS_LABEL, color: SUBTLE, fontWeight: 600 }}>
              音效
            </div>
            <div style={{ marginTop: 10, fontSize: FS_BODY, lineHeight: 1.5, color: TEXT_DARK, fontWeight: 500 }}>
              “Opening bottle with falling cap” — freesound_community
            </div>
            <div style={{ marginTop: 8, fontSize: FS_META, color: SUBTLE, fontWeight: 500 }}>
              Pixabay · Pixabay Content License · 2022/8/31
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
