import React from "react";
import { DefinitionCard } from "../../components/DefinitionCard";

// 第 4 集・第 4 頁・S11：PPU 定義卡（duration 依 Root；沿用共用 DefinitionCard）
export const Ch4Page4S11PPU: React.FC = () => (
  <DefinitionCard
    title="Pixels Per Unit"
    segments={[
      { text: "PPU (Pixels Per Unit) 決定" },
      { text: "多少 px = 1 unit", highlight: true },
    ]}
  />
);
