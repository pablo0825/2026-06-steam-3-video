import "./index.css";
import { CalculateMetadataFunction, Composition, Folder } from "remotion";
import { Page0LogoIntro } from "./scenes/01-實驗介紹/Page0LogoIntro";
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
import { Ch1Page8S19ChatGPT } from "./scenes/01-實驗介紹/Ch1Page8S19ChatGPT";
import { Ch1Page8S20Codex } from "./scenes/01-實驗介紹/Ch1Page8S20Codex";
import { Ch1Page8S21NoManualWork } from "./scenes/01-實驗介紹/Ch1Page8S21NoManualWork";
import { Ch1Page9S22CodexDemoPlaceholder } from "./scenes/01-實驗介紹/Ch1Page9S22CodexDemoPlaceholder";
import { Ch1Page10S25Thanks } from "./scenes/01-實驗介紹/Ch1Page10S25Thanks";
import { Ch1Page10S26Credits } from "./scenes/01-實驗介紹/Ch1Page10S26Credits";
import { Ch2Page1S01Opening } from "./scenes/02-遊戲設計/Ch2Page1S01Opening";
import { Ch2Page1S02Focus } from "./scenes/02-遊戲設計/Ch2Page1S02Focus";
import { Ch2Page1S03KnowledgeNav } from "./scenes/02-遊戲設計/Ch2Page1S03KnowledgeNav";
import { Ch2Page1S03KnowledgeNav02 } from "./scenes/02-遊戲設計/Ch2Page1S03KnowledgeNav-02";
import { Ch2Page1S03KnowledgeNav03 } from "./scenes/02-遊戲設計/Ch2Page1S03KnowledgeNav-03";
import { Ch2Page1S03KnowledgeNav04 } from "./scenes/02-遊戲設計/Ch2Page1S03KnowledgeNav-04";
import { Ch2Page2S04Constraint } from "./scenes/02-遊戲設計/Ch2Page2S04Constraint";
import { Ch2Page2S05GameJam } from "./scenes/02-遊戲設計/Ch2Page2S05GameJam";
import { Ch2Page2S06Question } from "./scenes/02-遊戲設計/Ch2Page2S06Question";
import { Ch2Page3S07RhythmDoctorOverlay } from "./scenes/02-遊戲設計/Ch2Page3S07RhythmDoctorOverlay";
import { Ch2Page3S08LimitOverlay } from "./scenes/02-遊戲設計/Ch2Page3S08LimitOverlay";
import { Ch2Page3S09ConstraintMethod } from "./scenes/02-遊戲設計/Ch2Page3S09ConstraintMethod";
import { Ch2Page4S10CorePlay } from "./scenes/02-遊戲設計/Ch2Page4S10CorePlay";
import { Ch2Page4S11CelesteOverlay } from "./scenes/02-遊戲設計/Ch2Page4S11CelesteOverlay";
import { Ch2Page4S12ActionsOverlay } from "./scenes/02-遊戲設計/Ch2Page4S12ActionsOverlay";
import { Ch2Page5S13CoreLoop } from "./scenes/02-遊戲設計/Ch2Page5S13CoreLoop";
import { Ch2Page5S14LoopFramework } from "./scenes/02-遊戲設計/Ch2Page5S14LoopFramework";
import { Ch2Page5S15MonsterLoop01 } from "./scenes/02-遊戲設計/Ch2Page5S15MonsterLoop-01";
import { Ch2Page5S15MonsterLoop02 } from "./scenes/02-遊戲設計/Ch2Page5S15MonsterLoop-02";
import { Ch2Page6S17CelesteLoop } from "./scenes/02-遊戲設計/Ch2Page6S17CelesteLoop";
import { Ch2Page7S18StoryboardIntro } from "./scenes/02-遊戲設計/Ch2Page7S18StoryboardIntro";
import { Ch2Page7S19Examples } from "./scenes/02-遊戲設計/Ch2Page7S19Examples";
import { Ch2Page7S20Readable } from "./scenes/02-遊戲設計/Ch2Page7S20Readable";
import { Ch2Page7S21Consensus } from "./scenes/02-遊戲設計/Ch2Page7S21Consensus";
import { Ch2Page7S22Checklist } from "./scenes/02-遊戲設計/Ch2Page7S22Checklist";
import { Ch2Page10Ending } from "./scenes/02-遊戲設計/Ch2Page10Ending";
import { Ch3Page1S01Opening } from "./scenes/03-程式實作/Ch3Page1S01Opening";
import { Ch3Page1S02Focus } from "./scenes/03-程式實作/Ch3Page1S02Focus";
import { Ch3Page1S03KnowledgeNav } from "./scenes/03-程式實作/Ch3Page1S03KnowledgeNav";
import { Ch3Page1S03KnowledgeNav2 } from "./scenes/03-程式實作/Ch3Page1S03KnowledgeNav-2";
import { Ch3Page1S03KnowledgeNav3 } from "./scenes/03-程式實作/Ch3Page1S03KnowledgeNav-3";
import { Ch3Page1S03KnowledgeNav4 } from "./scenes/03-程式實作/Ch3Page1S03KnowledgeNav-4";
import { Ch3Page2S04UserStory01 } from "./scenes/03-程式實作/Ch3Page2S04UserStory-01";
import { Ch3Page2S04UserStory02 } from "./scenes/03-程式實作/Ch3Page2S04UserStory-02";
import { Ch3Page2S05Format } from "./scenes/03-程式實作/Ch3Page2S05Format";
import { Ch3Page3S06RhythmDoctorOverlay } from "./scenes/03-程式實作/Ch3Page3S06RhythmDoctorOverlay";
import { Ch3Page3S07UserStoryOverlay01 } from "./scenes/03-程式實作/Ch3Page3S07UserStoryOverlay-01";
import { Ch3Page3S07UserStoryOverlay02 } from "./scenes/03-程式實作/Ch3Page3S07UserStoryOverlay-02";
import { Ch3Page4S08Context } from "./scenes/03-程式實作/Ch3Page4S08Context";
import { Ch3Page4S09ContextLimit01 } from "./scenes/03-程式實作/Ch3Page4S09ContextLimit-01";
import { Ch3Page4S09ContextLimit02 } from "./scenes/03-程式實作/Ch3Page4S09ContextLimit-02";
import { Ch3Page5S11AgentsDefinition } from "./scenes/03-程式實作/Ch3Page5S11AgentsDefinition";
import { Ch3Page5S12AgentsFlow } from "./scenes/03-程式實作/Ch3Page5S12AgentsFlow";
import { Ch3Page6S14SpecDefinition01 } from "./scenes/03-程式實作/Ch3Page6S14SpecDefinition-01";
import { Ch3Page6S14SpecDefinition02 } from "./scenes/03-程式實作/Ch3Page6S14SpecDefinition-02";
import { Ch3Page6S14SpecWorkflow } from "./scenes/03-程式實作/Ch3Page6S14SpecWorkflow";
import { Ch3Page6S15SpecStructure } from "./scenes/03-程式實作/Ch3Page6S15SpecStructure";
import { Ch3Page7S16CelesteSpecOverlay } from "./scenes/03-程式實作/Ch3Page7S16CelesteSpecOverlay";
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
import { Ch4Page4S11PPU01 } from "./scenes/04-美術整合/Ch4Page4S11PPU01";
import { Ch4Page4S11PPU02 } from "./scenes/04-美術整合/Ch4Page4S11PPU02";
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={4360}
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
      <Folder name="Ch1">
        <Composition
          id="Ch1-Page1-S01-Opening"
          component={Ch1Page1S01Opening}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page1-S02-Title"
          component={Ch1Page1S02Title}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page2-S03-AINode"
          component={Ch1Page2S03AINode}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page2-S04-Domains"
          component={Ch1Page2S04Domains}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page2-S05-PlayablePrototype"
          component={Ch1Page2S05PlayablePrototype}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page3-S06-Question"
          component={Ch1Page3S06Question}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page3-S07-DefinitionRange"
          component={Ch1Page3S07DefinitionRange}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page3-S08-FastPlayable"
          component={Ch1Page3S08FastPlayable}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page3-S09-ValidateQuestion"
          component={Ch1Page3S09ValidateQuestion}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page4-S10-PrototypeVideo"
          component={Ch1Page4S10PrototypeVideo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page4-S11-GameplayQuestion"
          component={Ch1Page4S11GameplayQuestion}
          durationInFrames={430}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page5-S12-PrototypeGoal"
          component={Ch1Page5S12PrototypeGoal}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page5-S13-QuestionCards"
          component={Ch1Page5S13QuestionCards}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page5-S14-Validated"
          component={Ch1Page5S14Validated}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page6-S15-ExperimentFlow"
          component={Ch1Page6S15ExperimentFlow}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page6-S16-CurrentPart"
          component={Ch1Page6S16CurrentPart}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page7-S17-CodexAgent"
          component={Ch1Page7S17CodexAgent}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page7-S18-ComputerAccess"
          component={Ch1Page7S18ComputerAccess}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page8-S19-ChatGPT"
          component={Ch1Page8S19ChatGPT}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page8-S20-Codex"
          component={Ch1Page8S20Codex}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page8-S21-NoManualWork"
          component={Ch1Page8S21NoManualWork}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page9-S22-CodexDemoPlaceholder"
          component={Ch1Page9S22CodexDemoPlaceholder}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page10-S25-Thanks"
          component={Ch1Page10S25Thanks}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Ch1-Page10-S26-Credits"
          component={Ch1Page10S26Credits}
          durationInFrames={480}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Ch2">
        {/* ── 第 2 集・遊戲設計 ── */}
        <Folder name="opening">
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
        </Folder>
        <Folder name="k1">
          <Composition
            id="Ch2-Page1-S03-KnowledgeNav"
            component={Ch2Page1S03KnowledgeNav}
            durationInFrames={300}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page2-S04-Constraint"
            component={Ch2Page2S04Constraint}
            durationInFrames={270}
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
            id="Ch2-Page3-S07-RhythmDoctor-Overlay"
            component={Ch2Page3S07RhythmDoctorOverlay}
            durationInFrames={150}
            fps={30}
            width={1920}
            height={1080}
            calculateMetadata={calculateAlphaOverlayMetadata}
          />
          <Composition
            id="Ch2-Page3-S08-Limit-Overlay"
            component={Ch2Page3S08LimitOverlay}
            durationInFrames={480}
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
        </Folder>
        <Folder name="k2">
          <Composition
            id="Ch2-Page1-S03-KnowledgeNav-02"
            component={Ch2Page1S03KnowledgeNav02}
            durationInFrames={300}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page4-S10-CorePlay"
            component={Ch2Page4S10CorePlay}
            durationInFrames={250}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page4-S11-Celeste-Overlay"
            component={Ch2Page4S11CelesteOverlay}
            durationInFrames={272}
            fps={30}
            width={1920}
            height={1080}
            calculateMetadata={calculateAlphaOverlayMetadata}
          />
          <Composition
            id="Ch2-Page4-S12-Actions-Overlay"
            component={Ch2Page4S12ActionsOverlay}
            durationInFrames={230}
            fps={30}
            width={1920}
            height={1080}
            calculateMetadata={calculateAlphaOverlayMetadata}
          />
        </Folder>
        <Folder name="k3">
          <Composition
            id="Ch2-Page1-S03-KnowledgeNav-03"
            component={Ch2Page1S03KnowledgeNav03}
            durationInFrames={300}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page5-S13-CoreLoop"
            component={Ch2Page5S13CoreLoop}
            durationInFrames={316}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page5-S14-LoopFramework"
            component={Ch2Page5S14LoopFramework}
            durationInFrames={234}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page5-S15-MonsterLoop-01"
            component={Ch2Page5S15MonsterLoop01}
            durationInFrames={120}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page5-S15-MonsterLoop-02"
            component={Ch2Page5S15MonsterLoop02}
            durationInFrames={650}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page6-S17-CelesteLoop"
            component={Ch2Page6S17CelesteLoop}
            durationInFrames={588}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Folder name="k4">
          <Composition
            id="Ch2-Page1-S03-KnowledgeNav-04"
            component={Ch2Page1S03KnowledgeNav04}
            durationInFrames={300}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page7-S18-StoryboardIntro"
            component={Ch2Page7S18StoryboardIntro}
            durationInFrames={270}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page7-S19-Examples"
            component={Ch2Page7S19Examples}
            durationInFrames={276}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page7-S20-Readable"
            component={Ch2Page7S20Readable}
            durationInFrames={210}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page7-S21-Consensus"
            component={Ch2Page7S21Consensus}
            durationInFrames={490}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch2-Page7-S22-Checklist"
            component={Ch2Page7S22Checklist}
            durationInFrames={270}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Composition
          id="Ch2-Page10-Ending"
          component={Ch2Page10Ending}
          durationInFrames={690}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Ch3">
        {/* ── 第 3 集・程式實作 ── */}
        <Folder name="opening">
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
            durationInFrames={264}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Folder name="k1">
          <Composition
            id="Ch3-Page1-S03-KnowledgeNav"
            component={Ch3Page1S03KnowledgeNav}
            durationInFrames={354}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page1-S03-KnowledgeNav-2"
            component={Ch3Page1S03KnowledgeNav2}
            durationInFrames={354}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page1-S03-KnowledgeNav-3"
            component={Ch3Page1S03KnowledgeNav3}
            durationInFrames={354}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page1-S03-KnowledgeNav-4"
            component={Ch3Page1S03KnowledgeNav4}
            durationInFrames={354}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page2-S04-UserStory-01"
            component={Ch3Page2S04UserStory01}
            durationInFrames={360}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page2-S04-UserStory-02"
            component={Ch3Page2S04UserStory02}
            durationInFrames={410}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page2-S05-Format"
            component={Ch3Page2S05Format}
            durationInFrames={384}
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
            id="Ch3-Page3-S07-UserStory-Overlay-01"
            component={Ch3Page3S07UserStoryOverlay01}
            durationInFrames={600}
            fps={30}
            width={1920}
            height={1080}
            calculateMetadata={calculateAlphaOverlayMetadata}
          />
          <Composition
            id="Ch3-Page3-S07-UserStory-Overlay-02"
            component={Ch3Page3S07UserStoryOverlay02}
            durationInFrames={600}
            fps={30}
            width={1920}
            height={1080}
            calculateMetadata={calculateAlphaOverlayMetadata}
          />
        </Folder>
        <Folder name="k2">
          <Composition
            id="Ch3-Page4-S08-Context"
            component={Ch3Page4S08Context}
            durationInFrames={240}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page4-S09-ContextLimit-01"
            component={Ch3Page4S09ContextLimit01}
            durationInFrames={384}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page4-S09-ContextLimit-02"
            component={Ch3Page4S09ContextLimit02}
            durationInFrames={290}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Folder name="k3">
          <Composition
            id="Ch3-Page5-S11-AgentsDefinition"
            component={Ch3Page5S11AgentsDefinition}
            durationInFrames={180}
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
        </Folder>
        <Folder name="k4">
          <Composition
            id="Ch3-Page6-S14-SpecDefinition-01"
            component={Ch3Page6S14SpecDefinition01}
            durationInFrames={180}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page6-S14-SpecDefinition-02"
            component={Ch3Page6S14SpecDefinition02}
            durationInFrames={384}
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
            id="Ch3-Page7-S16-CelesteSpec-Overlay"
            component={Ch3Page7S16CelesteSpecOverlay}
            durationInFrames={240}
            fps={30}
            width={1920}
            height={1080}
            calculateMetadata={calculateAlphaOverlayMetadata}
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
            durationInFrames={270}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch3-Page7-S18-SpecWorkflow"
            component={Ch3Page7S18SpecWorkflow}
            durationInFrames={414}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Composition
          id="Ch3-Page12-S23-Fundamentals"
          component={Ch3Page12S23Fundamentals}
          durationInFrames={354}
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
      </Folder>

      <Folder name="Ch4">
        {/* ── 第 4 集・美術整合 ── */}
        <Folder name="opening">
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
            durationInFrames={240}
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
        </Folder>

        {/* ── 第 4 集・美術整合 ── */}
        <Folder name="k1">
          <Composition
            id="Ch4-Page2-S05-Knowledge"
            component={Ch4Page2S05Knowledge}
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
        </Folder>
        <Folder name="k2">
          <Composition
            id="Ch4-Page2-S05-Knowledge-2"
            component={Ch4Page2S05Knowledge2}
            durationInFrames={330}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch4-Page4-S09-ToUnity"
            component={Ch4Page4S09ToUnity}
            durationInFrames={264}
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
            id="Ch4-Page4-S11-PPU-01"
            component={Ch4Page4S11PPU01}
            durationInFrames={168}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch4-Page4-S11-PPU-02"
            component={Ch4Page4S11PPU02}
            durationInFrames={322}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Ch4-Page4-S12-Comparison"
            component={Ch4Page4S12Comparison}
            durationInFrames={540}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Folder name="k3">
          <Composition
            id="Ch4-Page2-S05-Knowledge-3"
            component={Ch4Page2S05Knowledge3}
            durationInFrames={330}
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
            durationInFrames={450}
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
        </Folder>
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
      </Folder>
    </>
  );
};
