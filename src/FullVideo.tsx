import React from "react";
import { Series } from "remotion";
import { Ch1Page1S01Opening } from "./scenes/01-實驗介紹/Ch1Page1S01Opening";
import { Ch1Page1S02Title } from "./scenes/01-實驗介紹/Ch1Page1S02Title";
import { Ch1Page2S03AINode } from "./scenes/01-實驗介紹/Ch1Page2S03AINode";
import { Ch1Page2S04Domains } from "./scenes/01-實驗介紹/Ch1Page2S04Domains";
import { Ch1Page2S05PlayablePrototype } from "./scenes/01-實驗介紹/Ch1Page2S05PlayablePrototype";
import { Ch1Page3S06Question } from "./scenes/01-實驗介紹/Ch1Page3S06Question";
import { Ch1Page3S07DefinitionRange } from "./scenes/01-實驗介紹/Ch1Page3S07DefinitionRange";
import { Ch1Page3S08FastPlayable } from "./scenes/01-實驗介紹/Ch1Page3S08FastPlayable";
import { Ch1Page3S09ValidateQuestion } from "./scenes/01-實驗介紹/Ch1Page3S09ValidateQuestion";
import { Ch1Page4S10PrototypeVideo } from "./scenes/01-實驗介紹/Ch1Page4S10PrototypeVideo";
import { Ch1Page4S11GameplayQuestion } from "./scenes/01-實驗介紹/Ch1Page4S11GameplayQuestion";
import { Ch1Page5S12PrototypeGoal } from "./scenes/01-實驗介紹/Ch1Page5S12PrototypeGoal";
import { Ch1Page5S13QuestionCards } from "./scenes/01-實驗介紹/Ch1Page5S13QuestionCards";
import { Ch1Page5S14Validated } from "./scenes/01-實驗介紹/Ch1Page5S14Validated";
import { Ch1Page6S15ExperimentFlow } from "./scenes/01-實驗介紹/Ch1Page6S15ExperimentFlow";
import { Ch1Page6S16CurrentPart } from "./scenes/01-實驗介紹/Ch1Page6S16CurrentPart";
import { Ch1Page7S17CodexAgent } from "./scenes/01-實驗介紹/Ch1Page7S17CodexAgent";
import { Ch1Page7S18ComputerAccess } from "./scenes/01-實驗介紹/Ch1Page7S18ComputerAccess";
import { Page8Compare } from "./scenes/01-實驗介紹/Page8Compare";
import { Page9Placeholder } from "./scenes/01-實驗介紹/Page9Placeholder";
import { Page10Ending } from "./scenes/01-實驗介紹/Page10Ending";

// 整支影片：10 頁依序接起來（第 9 頁為佔位卡）
// 各頁長度加總 = 4630 frames（見 Root.tsx 的 FullVideo composition）

export const FullVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={120}>
        <Ch1Page1S01Opening />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page1S02Title />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <Ch1Page2S03AINode />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page2S04Domains />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <Ch1Page2S05PlayablePrototype />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <Ch1Page3S06Question />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <Ch1Page3S07DefinitionRange />
      </Series.Sequence>
      <Series.Sequence durationInFrames={180}>
        <Ch1Page3S08FastPlayable />
      </Series.Sequence>
      <Series.Sequence durationInFrames={180}>
        <Ch1Page3S09ValidateQuestion />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page4S10PrototypeVideo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={430}>
        <Ch1Page4S11GameplayQuestion />
      </Series.Sequence>
      <Series.Sequence durationInFrames={210}>
        <Ch1Page5S12PrototypeGoal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={240}>
        <Ch1Page5S13QuestionCards />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page5S14Validated />
      </Series.Sequence>
      <Series.Sequence durationInFrames={210}>
        <Ch1Page6S15ExperimentFlow />
      </Series.Sequence>
      <Series.Sequence durationInFrames={180}>
        <Ch1Page6S16CurrentPart />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page7S17CodexAgent />
      </Series.Sequence>
      <Series.Sequence durationInFrames={210}>
        <Ch1Page7S18ComputerAccess />
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
