import "./index.css";
import { CalculateMetadataFunction, Composition, Series } from "remotion";
import { Page0LogoIntro } from "./scenes/01-實驗介紹/Page0LogoIntro";
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
import { Ch2Page1S01Opening } from "./scenes/02-遊戲設計/Ch2Page1S01Opening";
import { Ch2Page1S02Focus } from "./scenes/02-遊戲設計/Ch2Page1S02Focus";
import { Ch2Page1S03KnowledgeNav } from "./scenes/02-遊戲設計/Ch2Page1S03KnowledgeNav";
import { Ch2Page2S04Constraint } from "./scenes/02-遊戲設計/Ch2Page2S04Constraint";
import { Ch2Page2S05GameJam } from "./scenes/02-遊戲設計/Ch2Page2S05GameJam";
import { Ch2Page2S06Question } from "./scenes/02-遊戲設計/Ch2Page2S06Question";
import { Ch2Page3S07RhythmDoctor } from "./scenes/02-遊戲設計/Ch2Page3S07RhythmDoctor";
import { Ch2Page3S07RhythmDoctorOverlay } from "./scenes/02-遊戲設計/Ch2Page3S07RhythmDoctorOverlay";
import { Ch2Page3S08Limit } from "./scenes/02-遊戲設計/Ch2Page3S08Limit";
import { Ch2Page3S08LimitOverlay } from "./scenes/02-遊戲設計/Ch2Page3S08LimitOverlay";
import { Ch2Page3S09ConstraintMethod } from "./scenes/02-遊戲設計/Ch2Page3S09ConstraintMethod";
import { Ch2Page4CorePlay } from "./scenes/02-遊戲設計/Ch2Page4CorePlay";
import { Ch2Page4CorePlayOverlay } from "./scenes/02-遊戲設計/Ch2Page4CorePlayOverlay";
import { Ch2Page5CoreLoop } from "./scenes/02-遊戲設計/Ch2Page5CoreLoop";
import { Ch2Page6LoopCeleste } from "./scenes/02-遊戲設計/Ch2Page6LoopCeleste";
import { Ch2Page7Storyboard } from "./scenes/02-遊戲設計/Ch2Page7Storyboard";
import { Ch2Page10Ending } from "./scenes/02-遊戲設計/Ch2Page10Ending";
import { Ch3Page1S01Opening } from "./scenes/03-程式實作/Ch3Page1S01Opening";
import { Ch3Page1S02Focus } from "./scenes/03-程式實作/Ch3Page1S02Focus";
import { Ch3Page1S03KnowledgeNav } from "./scenes/03-程式實作/Ch3Page1S03KnowledgeNav";
import { Ch3Page2S04UserStory } from "./scenes/03-程式實作/Ch3Page2S04UserStory";
import { Ch3Page2S05Format } from "./scenes/03-程式實作/Ch3Page2S05Format";
import { Ch3Page3S06RhythmDoctor } from "./scenes/03-程式實作/Ch3Page3S06RhythmDoctor";
import { Ch3Page3S06RhythmDoctorOverlay } from "./scenes/03-程式實作/Ch3Page3S06RhythmDoctorOverlay";
import { Ch3Page3S07UserStory } from "./scenes/03-程式實作/Ch3Page3S07UserStory";
import { Ch3Page3S07UserStoryOverlay } from "./scenes/03-程式實作/Ch3Page3S07UserStoryOverlay";
import { Ch3Page4S08Context } from "./scenes/03-程式實作/Ch3Page4S08Context";
import { Ch3Page4S09ContextLimit } from "./scenes/03-程式實作/Ch3Page4S09ContextLimit";
import { Ch3Page5S11AgentsDefinition } from "./scenes/03-程式實作/Ch3Page5S11AgentsDefinition";
import { Ch3Page5S12AgentsFlow } from "./scenes/03-程式實作/Ch3Page5S12AgentsFlow";
import { Ch3Page5S13AgentsDemo } from "./scenes/03-程式實作/Ch3Page5S13AgentsDemo";
import { Ch3Page6S14SpecDefinition } from "./scenes/03-程式實作/Ch3Page6S14SpecDefinition";
import { Ch3Page6S14SpecWorkflow } from "./scenes/03-程式實作/Ch3Page6S14SpecWorkflow";
import { Ch3Page6S15SpecStructure } from "./scenes/03-程式實作/Ch3Page6S15SpecStructure";
import { Ch3Page7S16CelesteSpec } from "./scenes/03-程式實作/Ch3Page7S16CelesteSpec";
import { Ch3Page7S16CelesteSpecOverlay } from "./scenes/03-程式實作/Ch3Page7S16CelesteSpecOverlay";
import { Ch3Page7S17CelesteSpec } from "./scenes/03-程式實作/Ch3Page7S17CelesteSpec";
import { Ch3Page7S17CelesteSpecOverlay } from "./scenes/03-程式實作/Ch3Page7S17CelesteSpecOverlay";
import { Ch3Page7S18SpecPerFeature } from "./scenes/03-程式實作/Ch3Page7S18SpecPerFeature";
import { Ch3Page7S18SpecWorkflow } from "./scenes/03-程式實作/Ch3Page7S18SpecWorkflow";
import { Ch3Page12S23Fundamentals } from "./scenes/03-程式實作/Ch3Page12S23Fundamentals";
import { Ch3Page13S24Ending } from "./scenes/03-程式實作/Ch3Page13S24Ending";
import { Ch4Page1S01Opening } from "./scenes/04-美術整合/Ch4Page1S01Opening";
import { Ch4Page1S02Role } from "./scenes/04-美術整合/Ch4Page1S02Role";
import { Ch4Page1S03Flow } from "./scenes/04-美術整合/Ch4Page1S03Flow";
import { Ch4Page1S04Focus } from "./scenes/04-美術整合/Ch4Page1S04Focus";
import { Ch4Page2S05Knowledge } from "./scenes/04-美術整合/Ch4Page2S05Knowledge";
import { Ch4Page2S05Knowledge2 } from "./scenes/04-美術整合/Ch4Page2S05Knowledge-2";
import { Ch4Page2S05Knowledge3 } from "./scenes/04-美術整合/Ch4Page2S05Knowledge-3";
import { Ch4Page2S06SizeCards } from "./scenes/04-美術整合/Ch4Page2S06SizeCards";
import { Ch4Page2S07ScreenSizes } from "./scenes/04-美術整合/Ch4Page2S07ScreenSizes";
import { Ch4Page2S08WhySize } from "./scenes/04-美術整合/Ch4Page2S08WhySize";
import { Ch4Page4S09ToUnity } from "./scenes/04-美術整合/Ch4Page4S09ToUnity";
import { Ch4Page4S10BaseUnit } from "./scenes/04-美術整合/Ch4Page4S10BaseUnit";
import { Ch4Page4S11PPU } from "./scenes/04-美術整合/Ch4Page4S11PPU";
import { Ch4Page4S12Comparison } from "./scenes/04-美術整合/Ch4Page4S12Comparison";
import { Ch4Page6S14Definition } from "./scenes/04-美術整合/Ch4Page6S14Definition";
import { Ch4Page6S15Contrast } from "./scenes/04-美術整合/Ch4Page6S15Contrast";
import { Ch4Page6S16SpriteSheetExample } from "./scenes/04-美術整合/Ch4Page6S16SpriteSheetExample";
import { Ch4Page8S18ArtWorkflow } from "./scenes/04-美術整合/Ch4Page8S18ArtWorkflow";
import { Ch4Page9S19ArtSpecTable } from "./scenes/04-美術整合/Ch4Page9S19ArtSpecTable";
import { FullVideo } from "./FullVideo";

const calculateAlphaOverlayMetadata: CalculateMetadataFunction<
  Record<string, unknown>
> = async () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

const Ch4PageS01S04: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={210}>
      <Ch4Page1S01Opening />
    </Series.Sequence>
    <Series.Sequence durationInFrames={210}>
      <Ch4Page1S02Role />
    </Series.Sequence>
    <Series.Sequence durationInFrames={605}>
      <Ch4Page1S03Flow />
    </Series.Sequence>
    <Series.Sequence durationInFrames={245}>
      <Ch4Page1S04Focus />
    </Series.Sequence>
  </Series>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={4630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page0-LogoIntro"
        component={Page0LogoIntro}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page1-Opening"
        component={Page1Opening}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page2-AI"
        component={Page2AIToPrototype}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page3-Prototype"
        component={Page3Prototype}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page4-PrototypeVideo"
        component={Page4PrototypeVideo}
        durationInFrames={580}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page5-Goal"
        component={Page5PrototypeGoal}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page6-Flow"
        component={Page6Flow}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page7-Codex"
        component={Page7Codex}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page8-Compare"
        component={Page8Compare}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page9-Placeholder"
        component={Page9Placeholder}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Page10-Ending"
        component={Page10Ending}
        durationInFrames={570}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 第 2 集・遊戲設計 ── */}
      <Composition
        id="Ch2-Page1-S01-Opening"
        component={Ch2Page1S01Opening}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page1-S02-Focus"
        component={Ch2Page1S02Focus}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page1-S03-KnowledgeNav"
        component={Ch2Page1S03KnowledgeNav}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page2-S04-Constraint"
        component={Ch2Page2S04Constraint}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page2-S05-GameJam"
        component={Ch2Page2S05GameJam}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page2-S06-Question"
        component={Ch2Page2S06Question}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page3-S07-RhythmDoctor"
        component={Ch2Page3S07RhythmDoctor}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page3-S07-RhythmDoctor-Overlay"
        component={Ch2Page3S07RhythmDoctorOverlay}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch2-Page3-S08-Limit"
        component={Ch2Page3S08Limit}
        durationInFrames={339}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page3-S08-Limit-Overlay"
        component={Ch2Page3S08LimitOverlay}
        durationInFrames={339}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch2-Page3-S09-ConstraintMethod"
        component={Ch2Page3S09ConstraintMethod}
        durationInFrames={251}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page4-CorePlay"
        component={Ch2Page4CorePlay}
        durationInFrames={700}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page4-CorePlay-Overlay"
        component={Ch2Page4CorePlayOverlay}
        durationInFrames={700}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch2-Page5-CoreLoop"
        component={Ch2Page5CoreLoop}
        durationInFrames={1170}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page6-LoopCeleste"
        component={Ch2Page6LoopCeleste}
        durationInFrames={840}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page7-Storyboard"
        component={Ch2Page7Storyboard}
        durationInFrames={1470}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch2-Page10-Ending"
        component={Ch2Page10Ending}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 第 3 集・程式實作 ── */}
      <Composition
        id="Ch3-Page1-S01-Opening"
        component={Ch3Page1S01Opening}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page1-S02-Focus"
        component={Ch3Page1S02Focus}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page1-S03-KnowledgeNav"
        component={Ch3Page1S03KnowledgeNav}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page2-S04-UserStory"
        component={Ch3Page2S04UserStory}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page2-S05-Format"
        component={Ch3Page2S05Format}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page3-S06-RhythmDoctor"
        component={Ch3Page3S06RhythmDoctor}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page3-S06-RhythmDoctor-Overlay"
        component={Ch3Page3S06RhythmDoctorOverlay}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch3-Page3-S07-UserStory"
        component={Ch3Page3S07UserStory}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page3-S07-UserStory-Overlay"
        component={Ch3Page3S07UserStoryOverlay}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch3-Page4-S08-Context"
        component={Ch3Page4S08Context}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page4-S09-ContextLimit"
        component={Ch3Page4S09ContextLimit}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page5-S11-AgentsDefinition"
        component={Ch3Page5S11AgentsDefinition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page5-S12-AgentsFlow"
        component={Ch3Page5S12AgentsFlow}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page5-S13-AgentsDemo"
        component={Ch3Page5S13AgentsDemo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page6-S14-SpecDefinition"
        component={Ch3Page6S14SpecDefinition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page6-S14-SpecWorkflow"
        component={Ch3Page6S14SpecWorkflow}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page6-S15-SpecStructure"
        component={Ch3Page6S15SpecStructure}
        durationInFrames={1020}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page7-S16-CelesteSpec"
        component={Ch3Page7S16CelesteSpec}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page7-S16-CelesteSpec-Overlay"
        component={Ch3Page7S16CelesteSpecOverlay}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch3-Page7-S17-CelesteSpec"
        component={Ch3Page7S17CelesteSpec}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page7-S17-CelesteSpec-Overlay"
        component={Ch3Page7S17CelesteSpecOverlay}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateAlphaOverlayMetadata}
      />
      <Composition
        id="Ch3-Page7-S18-SpecPerFeature"
        component={Ch3Page7S18SpecPerFeature}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page7-S18-SpecWorkflow"
        component={Ch3Page7S18SpecWorkflow}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page12-S23-Fundamentals"
        component={Ch3Page12S23Fundamentals}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch3-Page13-S24-Ending"
        component={Ch3Page13S24Ending}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 第 4 集・美術整合 ── */}
      <Composition
        id="Ch4-Page-S01-S04"
        component={Ch4PageS01S04}
        durationInFrames={1270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page1-S01-Opening"
        component={Ch4Page1S01Opening}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page1-S02-Role"
        component={Ch4Page1S02Role}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page1-S03-Flow"
        component={Ch4Page1S03Flow}
        durationInFrames={605}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page1-S04-Focus"
        component={Ch4Page1S04Focus}
        durationInFrames={245}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 第 4 集・美術整合 ── */}
      <Composition
        id="Ch4-Page2-S05-Knowledge"
        component={Ch4Page2S05Knowledge}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page2-S05-Knowledge-2"
        component={Ch4Page2S05Knowledge2}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page2-S05-Knowledge-3"
        component={Ch4Page2S05Knowledge3}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page2-S06-SizeCards"
        component={Ch4Page2S06SizeCards}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page2-S07-ScreenSizes"
        component={Ch4Page2S07ScreenSizes}
        durationInFrames={470}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page2-S08-WhySize"
        component={Ch4Page2S08WhySize}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page4-S09-ToUnity"
        component={Ch4Page4S09ToUnity}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page4-S10-BaseUnit"
        component={Ch4Page4S10BaseUnit}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page4-S11-PPU"
        component={Ch4Page4S11PPU}
        durationInFrames={322}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page4-S12-Comparison"
        component={Ch4Page4S12Comparison}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page6-S14-Definition"
        component={Ch4Page6S14Definition}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page6-S15-Contrast"
        component={Ch4Page6S15Contrast}
        durationInFrames={426}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page6-S16-SpriteSheetExample"
        component={Ch4Page6S16SpriteSheetExample}
        durationInFrames={350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page8-S18-ArtWorkflow"
        component={Ch4Page8S18ArtWorkflow}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Ch4-Page9-S19-ArtSpecTable"
        component={Ch4Page9S19ArtSpecTable}
        durationInFrames={309}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
