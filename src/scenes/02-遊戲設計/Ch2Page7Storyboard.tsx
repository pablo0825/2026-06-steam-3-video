import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  BORDER_LIGHT,
  CARD_BORDER,
  NEUTRAL_100,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 2 集・第 7 頁：Storyboard 分鏡圖
//   S18：分鏡圖可演出玩法與關卡設計
//   S19：真實案例呈現形式多元
//   S20：放大檢視兩種差異最大的分鏡
//   S21：分鏡圖用來凝聚團隊共識
//   S22：四個繪製分鏡圖的重點

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const SOFT_EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const S19_START = 240;
const S20_START = 510;
const S21_START = 720;
const S22_START = 1200;
const PANEL_START = [76, 112, 148] as const;
const SAMPLE_START = [286, 320, 354] as const;
const AVATAR_START = [780, 810, 840] as const;
const LINE_START = [818, 848, 878] as const;
const CHECKLIST = [
  { label: "完整開始與結尾", icon: "endpoints", start: 1250 },
  { label: "情境連貫", icon: "continuity", start: 1300 },
  { label: "去複雜化", icon: "simplify", start: 1350 },
  { label: "夥伴看得懂", icon: "readable", start: 1400 },
] as const;

const panelProgress = (frame: number, start: number) =>
  interpolate(frame, [start, start + 34], [0, 1], {
    ...clamp,
    easing: SOFT_EASE,
  });

const StoryboardPanel: React.FC<{ index: number; progress: number }> = ({
  index,
  progress,
}) => {
  const marks = interpolate(progress, [0.52, 0.82], [0, 1], clamp);
  const arrowOffset = interpolate(marks, [0, 1], [1, 0], clamp);

  return (
    <div
      style={{
        position: "relative",
        width: 440,
        height: 300,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px)`,
      }}
    >
      <svg width="440" height="300" viewBox="0 0 440 300" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="432"
          height="292"
          rx="20"
          fill={WHITE}
          stroke={CARD_BORDER}
          strokeWidth="4"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />

        <g opacity={marks} strokeLinecap="round" strokeLinejoin="round">
          {index === 0 && (
            <>
              <path d="M55 222H238" stroke={TEXT_DARK} strokeWidth="8" />
              <circle cx="112" cy="181" r="20" fill={WHITE} stroke={TEXT_DARK} strokeWidth="7" />
              <path d="M112 202V220M91 220H133" stroke={TEXT_DARK} strokeWidth="7" />
              <path d="M273 196H385V222H273Z" fill={NEUTRAL_100} stroke={SUBTLE} strokeWidth="5" />
              <circle cx="338" cy="157" r="8" fill={YELLOW} />
            </>
          )}

          {index === 1 && (
            <>
              <path d="M42 226H176M275 188H398" stroke={TEXT_DARK} strokeWidth="8" />
              <circle cx="112" cy="185" r="19" fill={WHITE} stroke={TEXT_DARK} strokeWidth="7" />
              <path d="M112 205V224" stroke={TEXT_DARK} strokeWidth="7" />
              <path
                d="M140 182C191 100 257 102 304 153"
                fill="none"
                stroke={YELLOW}
                strokeWidth="8"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={arrowOffset}
              />
              <path d="M286 142 310 158 282 166" fill="none" stroke={YELLOW} strokeWidth="8" />
            </>
          )}

          {index === 2 && (
            <>
              <path d="M48 226H392" stroke={TEXT_DARK} strokeWidth="8" />
              <circle cx="180" cy="185" r="19" fill={WHITE} stroke={TEXT_DARK} strokeWidth="7" />
              <path d="M180 205V224" stroke={TEXT_DARK} strokeWidth="7" />
              <path d="M302 86V226" stroke={SUBTLE} strokeWidth="7" />
              <path d="M305 90H374L346 122 374 154H305Z" fill={YELLOW} />
              <path
                d="M218 176C245 154 266 151 292 165"
                fill="none"
                stroke={YELLOW}
                strokeWidth="7"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={arrowOffset}
              />
            </>
          )}
        </g>

        <rect x="22" y="20" width="54" height="30" rx="15" fill={NEUTRAL_100} opacity={marks} />
        <text
          x="49"
          y="42"
          textAnchor="middle"
          fontFamily={FONT}
          fontSize="18"
          fontWeight="800"
          fill={SUBTLE}
          opacity={marks}
        >
          {index + 1}
        </text>
      </svg>
    </div>
  );
};

type SampleCardProps = {
  src: string;
  progress: number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  objectPosition?: string;
  opacity?: number;
};

const SampleCard: React.FC<SampleCardProps> = ({
  src,
  progress,
  left,
  top,
  width,
  height,
  rotate,
  objectPosition = "center",
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      overflow: "hidden",
      borderRadius: 20,
      border: `2px solid ${BORDER_LIGHT}`,
      backgroundColor: WHITE,
      boxShadow: `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
      opacity: progress * opacity,
      transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px) rotate(${rotate}deg) scale(${interpolate(progress, [0, 1], [0.96, 1])})`,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition,
      }}
    />
  </div>
);

type MemberAvatarProps = {
  x: number;
  y: number;
  color: string;
  progress: number;
  fromX: number;
  fromY: number;
};

const MemberAvatar: React.FC<MemberAvatarProps> = ({
  x,
  y,
  color,
  progress,
  fromX,
  fromY,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 132,
      height: 132,
      transform: `translate(-50%, -50%) translate(${interpolate(progress, [0, 1], [fromX, 0])}px, ${interpolate(progress, [0, 1], [fromY, 0])}px) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      opacity: progress,
      borderRadius: "50%",
      backgroundColor: WHITE,
      boxShadow: `0 14px 32px ${withAlpha(TEXT_DARK, 0.1)}`,
    }}
  >
    <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
      <circle cx="66" cy="66" r="62" fill={WHITE} stroke={color} strokeWidth="5" />
      <circle cx="66" cy="47" r="20" fill={withAlpha(color, 0.16)} stroke={color} strokeWidth="5" />
      <path
        d="M33 103C39 79 52 72 66 72C80 72 93 79 99 103"
        fill={withAlpha(color, 0.16)}
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

type ChecklistIcon = "endpoints" | "continuity" | "simplify" | "readable";

const ChecklistGlyph: React.FC<{
  icon: ChecklistIcon;
  color: string;
  progress: number;
}> = ({ icon, color, progress }) => {
  const draw = 1 - progress;
  return (
    <svg width="124" height="96" viewBox="0 0 124 96" aria-hidden="true">
      <g
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress}
      >
        {icon === "endpoints" && (
          <>
            <circle cx="19" cy="69" r="9" fill={color} />
            <path d="M29 69H91" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
            <path d="M94 18V77M96 20H116L107 31 116 42H96" />
          </>
        )}
        {icon === "continuity" && (
          <>
            <rect x="7" y="29" width="27" height="36" rx="4" />
            <rect x="49" y="29" width="27" height="36" rx="4" />
            <rect x="91" y="29" width="27" height="36" rx="4" />
            <path d="M36 47H46M78 47H88" />
          </>
        )}
        {icon === "simplify" && (
          <>
            <rect x="13" y="24" width="37" height="37" rx="4" />
            <circle cx="87" cy="42" r="20" />
            <path d="M21 76H102" />
          </>
        )}
        {icon === "readable" && (
          <>
            <circle cx="31" cy="34" r="13" />
            <circle cx="70" cy="34" r="13" />
            <path d="M10 73C14 56 21 51 31 51S48 56 52 73M49 73C53 56 60 51 70 51" />
            <path d="m82 62 11 11 23-29" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
          </>
        )}
      </g>
    </svg>
  );
};

type ChecklistCardProps = {
  label: string;
  icon: ChecklistIcon;
  progress: number;
  accentProgress: number;
};

const ChecklistCard: React.FC<ChecklistCardProps> = ({
  label,
  icon,
  progress,
  accentProgress,
}) => {
  const color = interpolateColors(accentProgress, [0, 1], [CARD_BORDER, YELLOW]);
  const iconProgress = interpolate(progress, [0, 0.72], [0, 1], clamp);
  const textProgress = interpolate(progress, [0.16, 1], [0, 1], clamp);

  return (
    <div
      style={{
        width: 660,
        height: 250,
        borderRadius: 24,
        border: `4px solid ${color}`,
        backgroundColor: WHITE,
        boxShadow: `0 16px 38px ${withAlpha(
          accentProgress > 0.45 ? YELLOW : TEXT_DARK,
          accentProgress > 0.45 ? 0.12 : 0.07,
        )}`,
        display: "flex",
        alignItems: "center",
        padding: "30px 54px",
        gap: 44,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px) scale(${interpolate(progress, [0, 1], [0.96, 1])})`,
      }}
    >
      <ChecklistGlyph icon={icon} color={color} progress={iconProgress} />
      <div
        style={{
          fontSize: 43,
          fontWeight: 800,
          letterSpacing: 3,
          color: accentProgress > 0.55 ? YELLOW : TEXT_DARK,
          opacity: textProgress,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Ch2Page7Storyboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s18Out = interpolate(frame, [220, 252], [1, 0], clamp);
  const introTitle = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const introSubtitle = interpolate(frame, [34, 62], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const introScale = interpolate(frame, [220, 252], [1, 0.94], clamp);

  const s19In = interpolate(frame, [S19_START, S19_START + 24], [0, 1], clamp);
  const s19Out = interpolate(frame, [500, 532], [1, 0], clamp);
  const s19Opacity = s19In * s19Out;
  const s19TitleOpacity = interpolate(frame, [252, 278], [0, 1], clamp);
  const s19TitleY = interpolate(frame, [252, 278], [20, 0], {
    ...clamp,
    easing: SOFT_EASE,
  });
  const stampProgress = spring({
    frame: frame - 414,
    fps,
    config: { damping: 11, stiffness: 150 },
  });

  const s20Opacity =
    interpolate(frame, [S20_START, S20_START + 20], [0, 1], clamp) *
    interpolate(frame, [700, 735], [1, 0], clamp);
  const sample1Opacity =
    interpolate(frame, [510, 530], [0, 1], clamp) *
    interpolate(frame, [602, 628], [1, 0], clamp);
  const sample3Opacity =
    interpolate(frame, [606, 632], [0, 1], clamp) *
    interpolate(frame, [700, 730], [1, 0], clamp);
  const sample1Scale = interpolate(frame, [510, 628], [1.03, 1.08], clamp);
  const sample3Scale = interpolate(frame, [606, 730], [1.03, 1.08], clamp);

  const s21Out = interpolate(frame, [1180, 1210], [1, 0], clamp);
  const s21Opacity = s21Out;
  const boardTransition = interpolate(frame, [720, 758], [0, 1], {
    ...clamp,
    easing: SOFT_EASE,
  });
  const boardLeft = interpolate(boardTransition, [0, 1], [210, 650]);
  const boardTop = interpolate(boardTransition, [0, 1], [160, 286]);
  const boardWidth = interpolate(boardTransition, [0, 1], [1500, 620]);
  const boardHeight = interpolate(boardTransition, [0, 1], [760, 350]);
  const avatarProgress = AVATAR_START.map((start) =>
    spring({
      frame: frame - start,
      fps,
      config: { damping: 14, stiffness: 125 },
    }),
  );
  const lineProgress = LINE_START.map((start) =>
    interpolate(frame, [start, start + 28], [0, 1], {
      ...clamp,
      easing: SOFT_EASE,
    }),
  );
  const leftBubble = spring({
    frame: frame - 930,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const rightBubble = spring({
    frame: frame - 970,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const checkProgress = interpolate(frame, [1060, 1092], [0, 1], {
    ...clamp,
    easing: SOFT_EASE,
  });
  const alignedOpacity = interpolate(frame, [1090, 1118], [0, 1], clamp);
  const consensusProgress = spring({
    frame: frame - 1120,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const s22Opacity = interpolate(frame, [S22_START, S22_START + 24], [0, 1], clamp);
  const s22TitleProgress = spring({
    frame: frame - S22_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT, overflow: "hidden" }}>
      {/* S18：概念與三格示意分鏡 */}
      {frame < 252 && (
        <AbsoluteFill
          style={{
            opacity: s18Out,
            alignItems: "center",
            transform: `scale(${introScale})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 112,
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: 5,
              color: TEXT_DARK,
              opacity: introTitle,
              transform: `translateY(${interpolate(introTitle, [0, 1], [20, 0])}px)`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: YELLOW }}>Storyboard</span> 分鏡圖
          </div>

          <div
            style={{
              position: "absolute",
              top: 222,
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: 4,
              color: SUBTLE,
              opacity: introSubtitle,
            }}
          >
            演出玩法・關卡設計
          </div>

          <div
            style={{
              position: "absolute",
              top: 390,
              display: "flex",
              gap: 50,
            }}
          >
            {PANEL_START.map((start, index) => (
              <StoryboardPanel
                key={start}
                index={index}
                progress={panelProgress(frame, start)}
              />
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* S19：真實分鏡素材牆 */}
      {frame >= S19_START && frame < 532 && (
        <AbsoluteFill style={{ opacity: s19Opacity }}>
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 105,
              transform: `translate(-50%, ${s19TitleY}px)`,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: 5,
              color: TEXT_DARK,
              opacity: s19TitleOpacity,
              whiteSpace: "nowrap",
            }}
          >
            形式多元・<span style={{ color: YELLOW }}>無固定格式</span>
          </div>

          <SampleCard
            src="02-遊戲設計/storyboard-sample-1.png"
            progress={panelProgress(frame, SAMPLE_START[0])}
            left={150}
            top={300}
            width={540}
            height={510}
            rotate={-2}
            objectPosition="35% center"
          />
          <SampleCard
            src="02-遊戲設計/storyboard-sample-2.png"
            progress={panelProgress(frame, SAMPLE_START[1])}
            left={690}
            top={265}
            width={540}
            height={510}
            rotate={1.5}
          />
          <SampleCard
            src="02-遊戲設計/storyboard-sample-3.png"
            progress={panelProgress(frame, SAMPLE_START[2])}
            left={1230}
            top={300}
            width={540}
            height={510}
            rotate={-1}
            objectPosition="50% 18%"
          />

          <div
            style={{
              position: "absolute",
              left: 1588,
              top: 830,
              width: 260,
              height: 150,
              border: `6px solid ${YELLOW}`,
              borderRadius: "50%",
              color: YELLOW,
              backgroundColor: withAlpha(WHITE, 0.94),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 35,
              fontWeight: 900,
              letterSpacing: 3,
              lineHeight: 1.25,
              opacity: stampProgress,
              transform: `translate(-50%, -50%) rotate(-8deg) scale(${interpolate(stampProgress, [0, 1], [1.35, 1])})`,
              boxShadow: `0 12px 32px ${withAlpha(YELLOW, 0.14)}`,
            }}
          >
            看得懂
            <br />
            最重要
          </div>
        </AbsoluteFill>
      )}

      {/* S20：兩張差異最大的真實分鏡 */}
      {frame >= S20_START && frame < 735 && (
        <AbsoluteFill style={{ opacity: s20Opacity, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              width: 1500,
              height: 760,
              overflow: "hidden",
              borderRadius: 28,
              border: `3px solid ${BORDER_LIGHT}`,
              backgroundColor: NEUTRAL_100,
              boxShadow: `0 24px 55px ${withAlpha(TEXT_DARK, 0.12)}`,
            }}
          >
            <Img
              src={staticFile("02-遊戲設計/storyboard-sample-1.png")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "35% 35%",
                opacity: sample1Opacity,
                transform: `scale(${sample1Scale})`,
              }}
            />
            <Img
              src={staticFile("02-遊戲設計/storyboard-sample-3.png")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 18%",
                opacity: sample3Opacity,
                transform: `scale(${sample3Scale})`,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* S21：團隊觀看、詢問、確認並形成共識 */}
      {frame >= S21_START && frame < 1210 && (
        <AbsoluteFill style={{ opacity: s21Opacity }}>
          <div
            style={{
              position: "absolute",
              left: boardLeft,
              top: boardTop,
              width: boardWidth,
              height: boardHeight,
              overflow: "hidden",
              borderRadius: 24,
              border: `3px solid ${BORDER_LIGHT}`,
              backgroundColor: WHITE,
              boxShadow: `0 20px 50px ${withAlpha(TEXT_DARK, 0.12)}`,
              zIndex: 2,
            }}
          >
            <Img
              src={staticFile("02-遊戲設計/storyboard-sample-3.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 18%",
                transform: `scale(${interpolate(boardTransition, [0, 1], [1.08, 1])})`,
              }}
            />
          </div>

          <svg
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
            aria-hidden="true"
          >
            {[
              "M406 540C500 540 560 520 650 500",
              "M1514 540C1420 540 1360 520 1270 500",
              "M960 854V650",
            ].map((path, index) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke={index === 2 ? BLUE : SUBTLE}
                strokeWidth="5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - lineProgress[index]}
              />
            ))}
          </svg>

          <MemberAvatar
            x={340}
            y={540}
            color={TEXT_DARK}
            progress={avatarProgress[0]}
            fromX={-90}
            fromY={0}
          />
          <MemberAvatar
            x={1580}
            y={540}
            color={SUBTLE}
            progress={avatarProgress[1]}
            fromX={90}
            fromY={0}
          />
          <MemberAvatar
            x={960}
            y={920}
            color={BLUE}
            progress={avatarProgress[2]}
            fromX={0}
            fromY={90}
          />

          {[
            { left: 185, top: 250, progress: leftBubble },
            { left: 1375, top: 250, progress: rightBubble },
          ].map((bubble, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: bubble.left,
                top: bubble.top,
                width: 360,
                padding: "24px 28px",
                borderRadius: 24,
                border: `3px solid ${BORDER_LIGHT}`,
                backgroundColor: WHITE,
                color: TEXT_DARK,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 2,
                textAlign: "center",
                opacity: bubble.progress,
                transform: `scale(${interpolate(bubble.progress, [0, 1], [0.86, 1])}) translateY(${interpolate(bubble.progress, [0, 1], [18, 0])}px)`,
                boxShadow: `0 12px 30px ${withAlpha(TEXT_DARK, 0.08)}`,
                zIndex: 4,
              }}
            >
              我們想的一樣嗎？
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              left: 960,
              top: 730,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 22,
              opacity: alignedOpacity,
              zIndex: 5,
            }}
          >
            <svg width="74" height="74" viewBox="0 0 74 74" aria-hidden="true">
              <circle cx="37" cy="37" r="32" fill={withAlpha(YELLOW, 0.12)} stroke={YELLOW} strokeWidth="4" />
              <path
                d="m21 38 11 11 22-25"
                fill="none"
                stroke={YELLOW}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - checkProgress}
              />
            </svg>
            <span
              style={{
                color: YELLOW,
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              想像一致
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 960,
              top: 145,
              transform: `translateX(-50%) translateY(${interpolate(consensusProgress, [0, 1], [20, 0])}px)`,
              opacity: consensusProgress,
              color: TEXT_DARK,
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: 6,
              whiteSpace: "nowrap",
            }}
          >
            凝聚團隊<span style={{ color: YELLOW }}>共識</span>
          </div>
        </AbsoluteFill>
      )}

      {/* S22：四個繪製分鏡圖的重點 */}
      {frame >= S22_START && (
        <AbsoluteFill style={{ opacity: s22Opacity, alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              top: 82,
              display: "flex",
              alignItems: "center",
              gap: 26,
              opacity: s22TitleProgress,
              transform: `translateY(${interpolate(s22TitleProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <svg width="78" height="62" viewBox="0 0 78 62" aria-hidden="true">
              <rect x="3" y="3" width="72" height="56" rx="8" fill={WHITE} stroke={YELLOW} strokeWidth="5" />
              <path d="M27 4V58M51 4V58M4 30H74" stroke={YELLOW} strokeWidth="4" />
            </svg>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: 5,
                color: TEXT_DARK,
              }}
            >
              繪製分鏡圖的<span style={{ color: YELLOW }}>重點</span>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 250,
              display: "grid",
              gridTemplateColumns: "660px 660px",
              gap: "40px 52px",
            }}
          >
            {CHECKLIST.map((item, index) => {
              const progress = spring({
                frame: frame - item.start,
                fps,
                config: { damping: 14, stiffness: 125 },
              });
              const accentProgress =
                index === 3
                  ? progress
                  : frame < item.start + 42
                    ? progress
                    : interpolate(frame, [item.start + 42, item.start + 70], [1, 0], clamp);

              return (
                <ChecklistCard
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  progress={progress}
                  accentProgress={accentProgress}
                />
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
