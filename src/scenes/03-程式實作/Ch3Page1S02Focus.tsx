import React from "react";
import { FocusCards, FocusCard } from "../../components/FocusCards";

// 第 3 集・第 1 頁・S02：本次重點（264 幀，開場白底先停留 24 幀）
//   時序整體 +24（inRange／firstFrame／outRange），讓開場白底多停一拍再淡入。
const FOCUS_CARDS: FocusCard[] = [
  { icon: "📝", parts: [{ text: "撰寫 User Story" }] },
  { icon: "🤖", parts: [{ text: "基於 Spec 的開發" }] },
];

export const Ch3Page1S02Focus: React.FC = () => (
  <FocusCards
    cards={FOCUS_CARDS}
    firstFrame={52}
    step={32}
    inRange={[24, 44]}
    outRange={[242, 262]}
  />
);
