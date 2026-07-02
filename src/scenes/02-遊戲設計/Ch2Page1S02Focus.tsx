import React from "react";
import { FocusCards, FocusCard } from "../../components/FocusCards";

// 第 2 集・第 1 頁・S02：本次重點（240 幀）
const HOLD = 24; // 開場白底先停留一段，內容再進場
const CONTENT_IN = [0 + HOLD, 20 + HOLD] as const;
const CONTENT_OUT = [214, 238] as const; // 238 前淡出完全，末兩幀維持全淡出

const FOCUS_CARDS: FocusCard[] = [
  { icon: "📄", parts: [{ text: "撰寫遊戲設計文件" }] },
  { icon: "🎬", parts: [{ text: "繪製 Storyboard" }] },
];

export const Ch2Page1S02Focus: React.FC = () => (
  <FocusCards
    cards={FOCUS_CARDS}
    firstFrame={28 + HOLD}
    step={26}
    inRange={CONTENT_IN}
    outRange={CONTENT_OUT}
  />
);
