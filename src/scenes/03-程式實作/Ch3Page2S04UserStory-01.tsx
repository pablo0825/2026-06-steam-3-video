import React from "react";
import {
  DefinitionCard,
  DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 3 集・第 2 頁・S04-01：User Story 定義（360 幀）
const SEGMENTS: DefinitionSegment[] = [
  { text: "用一句話，來描述" },
  { text: "使用者的需求", highlight: true },
];

export const Ch3Page2S04UserStory01: React.FC = () => (
  <DefinitionCard title="User Story" segments={SEGMENTS} />
);
