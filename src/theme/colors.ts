// 全片共用色票（Design Tokens）
// 所有顏色集中在此檔；要調整配色只改這裡，各場景透過 import 使用。

// ── 文字 ──────────────────────────────────────────────
export const TEXT_DARK = "#44403a"; // 主要文字
export const SUBTLE = "#8a857d"; // 次要／弱化文字

// ── 品牌語意色 ────────────────────────────────────────
export const BLUE = "#2D5A7B"; // 主色／節點／Codex（原 AI_FILL）
export const YELLOW = "#e8b007"; // 強調／想法／Logo（原 LOGO_YELLOW）
export const GREEN = "#3fa66a"; // 成功／已驗證
export const RED = "#c75a54"; // 否定／✗

// ── 分類角色色（Page2 程式/企劃/美術；較亮，刻意獨立於品牌色）──
export const CAT_CODE = "#3B82C4"; // 程式
export const CAT_PLAN = "#E8A33D"; // 企劃
export const CAT_ART = "#D9645F"; // 美術

// ── 純色 ──────────────────────────────────────────────
export const WHITE = "#ffffff";
export const BLACK = "#000000"; // 影片框底色

// ── 中性色階（暖灰，淺 → 深）──────────────────────────
// 收斂自原本十多個相近米灰，整片背景／邊框共用這一條色階。
export const NEUTRAL_50 = "#faf9f6";
export const NEUTRAL_100 = "#f2efe9";
export const NEUTRAL_200 = "#e8e5de";
export const NEUTRAL_300 = "#ddd9cf";
export const NEUTRAL_400 = "#d0cbc0";

// ── 表面 / 背景（語意別名，指向中性色階）────────────────
export const PANEL_BG = NEUTRAL_50; // 佔位框背景
export const CHIP_BG = NEUTRAL_100; // chip 膠囊背景
export const WINDOW_BAR = NEUTRAL_100; // 視窗標題列
export const HEADER_BG = NEUTRAL_100; // 對比欄標題背景
export const BOX_GREY = NEUTRAL_200; // 流程方塊基底

// ── 邊框 / 分隔線（語意別名，指向中性色階）──────────────
export const BORDER_LIGHT = NEUTRAL_200; // 影片框細邊
export const BORDER_SOFT = NEUTRAL_300; // 視窗邊框
export const DIVIDER = NEUTRAL_300; // 垂直虛線分隔
export const HAIRLINE = NEUTRAL_400; // 水平虛線
export const CARD_BORDER = NEUTRAL_400; // 卡片外框
export const DASH_BORDER = NEUTRAL_400; // 佔位虛線框

// ── 裝飾 ──────────────────────────────────────────────
export const DOT_RED = "#e2655c"; // 視窗「紅綠燈」紅點（黃/綠點沿用 YELLOW/GREEN）

// ── 工具：在既有顏色上疊加透明度（光暈／陰影用）──────────
// 支援 #rgb 或 #rrggbb，回傳 rgba(...) 字串。
export const withAlpha = (hex: string, alpha: number): string => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
