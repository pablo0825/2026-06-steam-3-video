import React from "react";
import { Series } from "remotion";
import { Page1Opening } from "./scenes/01-實驗介紹/Page1Opening";
import { Page2AIToPrototype } from "./scenes/01-實驗介紹/Page2AIToPrototype";
import { Page3Prototype } from "./scenes/01-實驗介紹/Page3Prototype";
import { Page4PrototypeVideo } from "./scenes/01-實驗介紹/Page4PrototypeVideo";
import { Page5PrototypeGoal } from "./scenes/01-實驗介紹/Page5PrototypeGoal";
import { Page6Flow } from "./scenes/01-實驗介紹/Page6Flow";
import { Page7Codex } from "./scenes/01-實驗介紹/Page7Codex";
import { Page8Compare } from "./scenes/01-實驗介紹/Page8Compare";
import { Page9Placeholder } from "./scenes/01-實驗介紹/Page9Placeholder";
import { Page10Ending } from "./scenes/01-實驗介紹/Page10Ending";

// 整支影片：10 頁依序接起來（第 9 頁為佔位卡）
// 各頁長度加總 = 4630 frames（見 Root.tsx 的 FullVideo composition）

export const FullVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={270}>
        <Page1Opening />
      </Series.Sequence>
      <Series.Sequence durationInFrames={330}>
        <Page2AIToPrototype />
      </Series.Sequence>
      <Series.Sequence durationInFrames={540}>
        <Page3Prototype />
      </Series.Sequence>
      <Series.Sequence durationInFrames={580}>
        <Page4PrototypeVideo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={600}>
        <Page5PrototypeGoal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={390}>
        <Page6Flow />
      </Series.Sequence>
      <Series.Sequence durationInFrames={360}>
        <Page7Codex />
      </Series.Sequence>
      <Series.Sequence durationInFrames={630}>
        <Page8Compare />
      </Series.Sequence>
      <Series.Sequence durationInFrames={360}>
        <Page9Placeholder />
      </Series.Sequence>
      <Series.Sequence durationInFrames={570}>
        <Page10Ending />
      </Series.Sequence>
    </Series>
  );
};
