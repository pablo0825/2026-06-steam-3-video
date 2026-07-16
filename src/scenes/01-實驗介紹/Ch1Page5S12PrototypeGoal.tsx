import React from "react";
import {
  DefinitionCard,
  type DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 1 集・第 5 頁・S12：原型的目的（240 幀；開場留 30 幀白底）
const HOLD = 30; // 開場白底停留幀數
const SEGMENTS: DefinitionSegment[] = [
  { text: "不是為了「完成」，而是用" },
  { text: "最低成本", highlight: true },
  { text: "驗證問題" },
];

export const Ch1Page5S12PrototypeGoal: React.FC = () => (
  <DefinitionCard title="原型的目的" segments={SEGMENTS} openingHoldFrames={HOLD} />
);
