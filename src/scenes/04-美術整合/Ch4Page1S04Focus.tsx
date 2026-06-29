import React from "react";
import { FocusCards, FocusCard } from "../../components/FocusCards";

// 第 4 集・第 1 頁・S04：本次重點三卡（245 幀）
const FOCUS_CARDS: FocusCard[] = [
  { icon: "📋", parts: [{ text: "撰寫美術規格表" }] },
  { icon: "🤖", parts: [{ text: "用 AI 生假素材" }] },
  { icon: "✅", parts: [{ text: "Unity 驗證規格" }] },
];

export const Ch4Page1S04Focus: React.FC = () => (
  <FocusCards
    cards={FOCUS_CARDS}
    firstFrame={37}
    step={26}
    inRange={[5, 29]}
    outRange={[217, 245]}
  />
);
