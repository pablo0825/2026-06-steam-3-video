import React from "react";
import {
  DefinitionCard,
  DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 3 集・第 5 頁・S11：AGENTS.md 定義（180 幀）
//   壓縮高亮時序（hlStart/hlStagger）讓兩個高亮約 108 幀亮完，
//   之後留約 1 秒停留，再於 [140,168] 淡出。
const SEGMENTS: DefinitionSegment[] = [
  { text: "讓 AI 不會忘記，你的" },
  { text: "所有要求", highlight: true },
];

export const Ch3Page5S11AgentsDefinition: React.FC = () => (
  <DefinitionCard
    title="AGENTS.md"
    segments={SEGMENTS}
    hlStart={66}
    hlStagger={20}
  />
);
