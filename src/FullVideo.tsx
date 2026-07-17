import React from "react";
import { Series } from "remotion";
import { Ch1Page1S02Title } from "./scenes/01-實驗介紹/Ch1Page1S02Title";
import { Ch1Page2S03AIPrototype } from "./scenes/01-實驗介紹/Ch1Page2S03AIPrototype";
import { Ch1Page3S06Prototype } from "./scenes/01-實驗介紹/Ch1Page3S06Prototype";
import { Ch1Page3S08FastPlayable } from "./scenes/01-實驗介紹/Ch1Page3S08FastPlayable";
import { Ch1Page3S09ValidateQuestion } from "./scenes/01-實驗介紹/Ch1Page3S09ValidateQuestion";
import { Ch1Page4S10PrototypeVideo } from "./scenes/01-實驗介紹/Ch1Page4S10PrototypeVideo";
import { Ch1Page4S11GameplayQuestion } from "./scenes/01-實驗介紹/Ch1Page4S11GameplayQuestion";
import { Ch1Page5S12PrototypeGoal } from "./scenes/01-實驗介紹/Ch1Page5S12PrototypeGoal";
import { Ch1Page5S13QuestionCards } from "./scenes/01-實驗介紹/Ch1Page5S13QuestionCards";
import { Ch1Page6S15ExperimentFlow } from "./scenes/01-實驗介紹/Ch1Page6S15ExperimentFlow";
import { Ch1Page7S17Codex } from "./scenes/01-實驗介紹/Ch1Page7S17Codex";
import { Ch1Page8S19Comparison } from "./scenes/01-實驗介紹/Ch1Page8S19Comparison";
import { Ch1Page9S20Overlay } from "./scenes/01-實驗介紹/Ch1Page9S20Overlay";
import { Ch1Page10S25Thanks } from "./scenes/01-實驗介紹/Ch1Page10S25Thanks";
import { Ch1Page10S26Credits } from "./scenes/01-實驗介紹/Ch1Page10S26Credits";

// 整支影片：10 頁依序接起來
// 目前已實作內容長度加總 = 4505 frames（S23-S24 螢幕錄影待補）

export const FullVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page1S02Title />
      </Series.Sequence>
      <Series.Sequence durationInFrames={390}>
        <Ch1Page2S03AIPrototype />
      </Series.Sequence>
      <Series.Sequence durationInFrames={180}>
        <Ch1Page3S06Prototype />
      </Series.Sequence>
      <Series.Sequence durationInFrames={210}>
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
      <Series.Sequence durationInFrames={240}>
        <Ch1Page5S12PrototypeGoal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={420}>
        <Ch1Page5S13QuestionCards />
      </Series.Sequence>
      <Series.Sequence durationInFrames={420}>
        <Ch1Page6S15ExperimentFlow />
      </Series.Sequence>
      <Series.Sequence durationInFrames={385}>
        <Ch1Page7S17Codex />
      </Series.Sequence>
      <Series.Sequence durationInFrames={630}>
        <Ch1Page8S19Comparison />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Ch1Page9S20Overlay />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <Ch1Page10S25Thanks />
      </Series.Sequence>
      <Series.Sequence durationInFrames={480}>
        <Ch1Page10S26Credits />
      </Series.Sequence>
    </Series>
  );
};
