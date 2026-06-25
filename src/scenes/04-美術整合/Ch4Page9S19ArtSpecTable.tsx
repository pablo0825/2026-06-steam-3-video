import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARD_BORDER,
  HEADER_BG,
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard as ease } from "../../theme/motion";

// 第 4 集・第 9 頁・S19：美術規格表（360 幀）
//   白底 8 欄表格，外框淡入 → 表頭依序出現 → 三列逐列填入 → 底部範本註，結尾淡出到 NEUTRAL_50。

const ENDING_FADE = [281, 309] as const; // 內容 206 到齊 → 停留 2.5 秒 → 淡出到 NEUTRAL_50

type Column = { label: string; width: number };
const COLUMNS: Column[] = [
  { label: "素材", width: 140 },
  { label: "用途", width: 180 },
  { label: "尺寸", width: 190 },
  { label: "PPU", width: 100 },
  { label: "類型", width: 220 },
  { label: "背景", width: 130 },
  { label: "內容", width: 560 },
  { label: "備註", width: 200 },
];

const ROWS: string[][] = [
  ["圓球", "玩家角色", "128×128", "128", "單張", "透明", "球狀玩家角色，置中、完整顯示", ""],
  ["地板", "場景 tile", "512×512", "128", "Sprite Sheet 4×4", "不透明", "4×4 地板變化：正常、印記、破損、其他變化", "每格 128×128"],
  ["尖刺", "場景物件", "1024×128", "128", "Sprite Sheet 4×1", "不透明", "4×1 場景物件，每格一個獨立物件", "每格 128×128"],
];

const TABLE_W = COLUMNS.reduce((s, c) => s + c.width, 0); // 1720
const GRID_COLS = COLUMNS.map((c) => `${c.width}px`).join(" ");
const TABLE_TOP = 300;
const HEADER_H = 76;
const ROW_H = 120;
const TABLE_H = HEADER_H + ROWS.length * ROW_H; // 436

export const Ch4Page9S19ArtSpecTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(frame, ENDING_FADE, [1, 0], clamp);
  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const frameIn = interpolate(frame, [20, 50], [0, 1], ease);
  const rowIn = (r: number) =>
    interpolate(frame, [60 + r * 45, 84 + r * 45], [0, 1], ease);
  const noteIn = interpolate(frame, [182, 206], [0, 1], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 120,
            transform: `translateX(-50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
            opacity: titleIn,
            fontSize: 64,
            fontWeight: 900,
            color: TEXT_DARK,
            letterSpacing: 4,
          }}
        >
          美術規格表
        </div>

        <div
          style={{
            position: "absolute",
            left: (1920 - TABLE_W) / 2,
            top: TABLE_TOP,
            width: TABLE_W,
            height: TABLE_H,
            backgroundColor: WHITE,
            border: `2px solid ${CARD_BORDER}`,
            borderRadius: 10,
            overflow: "hidden",
            opacity: frameIn,
            boxShadow: `0 16px 40px ${withAlpha(TEXT_DARK, 0.06)}`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: GRID_COLS }}>
            {COLUMNS.map((c, i) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: HEADER_H,
                  padding: "0 10px",
                  fontSize: 28,
                  fontWeight: 800,
                  color: TEXT_DARK,
                  backgroundColor: HEADER_BG,
                  borderRight:
                    i < COLUMNS.length - 1
                      ? `1px solid ${CARD_BORDER}`
                      : undefined,
                  borderBottom: `1px solid ${CARD_BORDER}`,
                }}
              >
                {c.label}
              </div>
            ))}
          </div>

          {ROWS.map((row, r) => (
            <div
              key={row[0]}
              style={{
                display: "grid",
                gridTemplateColumns: GRID_COLS,
                opacity: rowIn(r),
              }}
            >
              {row.map((cell, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    height: ROW_H,
                    padding: "0 12px",
                    fontSize: i === 6 ? 24 : 26,
                    lineHeight: 1.35,
                    color: TEXT_DARK,
                    borderRight:
                      i < COLUMNS.length - 1
                        ? `1px solid ${CARD_BORDER}`
                        : undefined,
                    borderBottom:
                      r < ROWS.length - 1
                        ? `1px solid ${CARD_BORDER}`
                        : undefined,
                  }}
                >
                  {cell || "—"}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: (1920 - TABLE_W) / 2,
            top: TABLE_TOP + TABLE_H + 18,
            fontSize: 24,
            color: SUBTLE,
            opacity: noteIn,
          }}
        >
          以上表格只是範本，可依需求自行調整內容
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
