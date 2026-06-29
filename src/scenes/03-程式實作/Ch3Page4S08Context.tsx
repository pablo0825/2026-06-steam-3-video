import React from "react";
import {
  DefinitionCard,
  DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 3 集・第 4 頁・S08：Context 定義（240 幀）
const SEGMENTS: DefinitionSegment[] = [
  { text: "Context 是 AI 的" },
  { text: "短期記憶", highlight: true },
  { text: "，我們和 AI 的對話，會" },
  { text: "暫時存在", highlight: true },
  { text: " Context 裡" },
];

export const Ch3Page4S08Context: React.FC = () => (
  <DefinitionCard title="Context" segments={SEGMENTS} defMaxWidth={1540} />
);
