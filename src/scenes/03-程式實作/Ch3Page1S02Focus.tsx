import React from "react";
import { FocusCards, FocusCard } from "../../components/FocusCards";

// 第 3 集・第 1 頁・S02：本次重點（240 幀）
const FOCUS_CARDS: FocusCard[] = [
  { icon: "📝", parts: [{ text: "撰寫 User Story" }] },
  { icon: "🤖", parts: [{ text: "基於 Spec 的開發" }] },
];

export const Ch3Page1S02Focus: React.FC = () => (
  <FocusCards
    cards={FOCUS_CARDS}
    firstFrame={28}
    step={32}
    inRange={[0, 20]}
    outRange={[218, 240]}
  />
);
