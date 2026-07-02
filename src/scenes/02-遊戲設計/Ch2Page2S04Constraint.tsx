import React from "react";
import {
  DefinitionCard,
  type DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 2 集・第 2 頁・S04：限制設計定義（270 幀，前 30 幀白底停留）
const SEGMENTS: DefinitionSegment[] = [
  { text: "在" },
  { text: "有限的條件", highlight: true },
  { text: "下，去設計產品" },
];

export const Ch2Page2S04Constraint: React.FC = () => (
  <DefinitionCard title="限制設計" segments={SEGMENTS} openingHoldFrames={30} />
);
