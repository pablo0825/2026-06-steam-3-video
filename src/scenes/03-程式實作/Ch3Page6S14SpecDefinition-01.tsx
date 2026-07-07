import React from "react";
import {
  DefinitionCard,
  DefinitionSegment,
} from "../../components/DefinitionCard";

// 第 3 集・第 6 頁・S14-01：Spec 定義（180 幀）
//   壓縮高亮時序（hlStart/hlStagger）讓兩個高亮約 108 幀亮完，
//   之後留約 1 秒停留，再於 [140,168] 淡出。
const SEGMENTS: DefinitionSegment[] = [
  { text: "把討論整理成，可長期保存" },
  { text: "的" },
  { text: "規格文件", highlight: true },
];

export const Ch3Page6S14SpecDefinition01: React.FC = () => (
  <DefinitionCard
    title="Spec"
    segments={SEGMENTS}
    hlStart={66}
    hlStagger={20}
  />
);
