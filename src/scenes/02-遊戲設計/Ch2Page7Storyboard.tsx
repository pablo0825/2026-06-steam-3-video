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
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 2 集・第 7 頁：Storyboard 分鏡圖
//   S18：Storyboard 定義與案例提示
//   S19：三張真實分鏡案例滿版播放
//   S20：形式多元，但夥伴看得懂最重要
//   S21：分鏡圖用來凝聚團隊共識
//   S22：四個繪製分鏡圖的重點

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const SOFT_EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const S19_START = 240;
const S20_START = 510;
const S21_START = 720;
const S22_START = 1200;
const AVATAR_START = [780, 810, 840] as const;
const LINE_START = [818, 848, 878] as const;
const STORYBOARD_SAMPLES = [
  {
    src: "02-遊戲設計/storyboard-sample-1.png",
    fadeIn: [240, 258],
    fadeOut: [322, 330],
    objectPosition: "center",
  },
  {
    src: "02-遊戲設計/storyboard-sample-2.png",
    fadeIn: [326, 334],
    fadeOut: [406, 414],
    objectPosition: "center",
  },
  {
    src: "02-遊戲設計/storyboard-sample-3.png",
    fadeIn: [410, 418],
    fadeOut: [492, 516],
    objectPosition: "center 18%",
  },
] as const;
const CHECKLIST = [
  { label: "完整開始與結尾", icon: "endpoints", start: 1250 },
  { label: "情境連貫", icon: "continuity", start: 1300 },
  { label: "去複雜化", icon: "simplify", start: 1350 },
  { label: "夥伴看得懂", icon: "readable", start: 1400 },
] as const;

type FullscreenStoryboardImageProps = {
  src: string;
  opacity: number;
  scale: number;
  objectPosition?: string;
};

const FullscreenStoryboardImage: React.FC<FullscreenStoryboardImageProps> = ({
  src,
  opacity,
  scale,
  objectPosition = "center",
}) => (
  <AbsoluteFill style={{ opacity, overflow: "hidden", backgroundColor: WHITE }}>
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: -30,
        width: "calc(100% + 60px)",
        height: "calc(100% + 60px)",
        objectFit: "cover",
        objectPosition,
        filter: "blur(22px)",
        opacity: 0.18,
        transform: `scale(${scale * 1.04})`,
      }}
    />
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition,
        transform: `scale(${scale})`,
      }}
    />
  </AbsoluteFill>
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
      <circle
        cx="66"
        cy="66"
        r="62"
        fill={WHITE}
        stroke={color}
        strokeWidth="5"
      />
      <circle
        cx="66"
        cy="47"
        r="20"
        fill={withAlpha(color, 0.16)}
        stroke={color}
        strokeWidth="5"
      />
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
            <path
              d="M29 69H91"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={draw}
            />
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
            <path
              d="m82 62 11 11 23-29"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={draw}
            />
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
  const color = interpolateColors(
    accentProgress,
    [0, 1],
    [CARD_BORDER, YELLOW],
  );
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

  const s18Out = interpolate(frame, [214, 240], [1, 0], clamp);
  const introTitle = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionOpacity = interpolate(frame, [36, 68], [0, 1], clamp);
  const promptOpacity = interpolate(frame, [104, 130], [0, 1], clamp);
  const promptY = interpolate(frame, [104, 130], [28, 0], {
    ...clamp,
    easing: SOFT_EASE,
  });

  const s20Opacity =
    interpolate(frame, [510, 534], [0, 1], clamp) *
    interpolate(frame, [690, 720], [1, 0], clamp);
  const conclusionMainOpacity = interpolate(frame, [548, 578], [0, 1], clamp);
  const conclusionMainY = interpolate(frame, [548, 578], [22, 0], {
    ...clamp,
    easing: SOFT_EASE,
  });
  const conclusionKeyOpacity = interpolate(frame, [602, 634], [0, 1], clamp);
  const conclusionKeyY = interpolate(frame, [602, 634], [30, 0], {
    ...clamp,
    easing: SOFT_EASE,
  });

  const s21Out = interpolate(frame, [1180, 1210], [1, 0], clamp);
  const s21Opacity = s21Out;
  const boardEntrance = interpolate(frame, [720, 758], [0, 1], {
    ...clamp,
    easing: SOFT_EASE,
  });
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

  const s22Opacity = interpolate(
    frame,
    [S22_START, S22_START + 24],
    [0, 1],
    clamp,
  );
  const s22TitleProgress = spring({
    frame: frame - S22_START,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: WHITE, fontFamily: FONT, overflow: "hidden" }}
    >
      {/* S18：Storyboard 定義與案例提示 */}
      {frame < S19_START && (
        <AbsoluteFill
          style={{
            opacity: s18Out,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEXT_DARK,
              opacity: introTitle,
              transform: `scale(${interpolate(introTitle, [0, 1], [0.92, 1])})`,
            }}
          >
            Storyboard
          </div>

          <div
            style={{
              marginTop: 56,
              maxWidth: 1500,
              textAlign: "center",
              fontSize: 48,
              fontWeight: 500,
              lineHeight: 1.55,
              letterSpacing: 2,
              color: SUBTLE,
              opacity: definitionOpacity,
            }}
          >
            Storyboard 是用
            <span style={{ color: YELLOW, fontWeight: 800 }}>連續畫面</span>
            ，呈現玩家在遊戲中經歷的工具
          </div>

          <div
            style={{
              marginTop: 58,
              padding: "18px 44px",
              borderRadius: 999,
              backgroundColor: CHIP_BG,
              color: TEXT_DARK,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 2,
              opacity: promptOpacity,
              transform: `translateY(${promptY}px)`,
            }}
          >
            一起看幾個案例
          </div>
        </AbsoluteFill>
      )}

      {/* S19：三張真實分鏡案例滿版播放 */}
      {frame >= S19_START && frame < 516 && (
        <AbsoluteFill>
          {STORYBOARD_SAMPLES.map((sample) => (
            <FullscreenStoryboardImage
              key={sample.src}
              src={sample.src}
              opacity={
                interpolate(frame, sample.fadeIn, [0, 1], clamp) *
                interpolate(frame, sample.fadeOut, [1, 0], clamp)
              }
              scale={interpolate(
                frame,
                [sample.fadeIn[0], sample.fadeOut[1]],
                [1, 1.025],
                clamp,
              )}
              objectPosition={sample.objectPosition}
            />
          ))}
        </AbsoluteFill>
      )}

      {/* S20：形式多元，但夥伴看得懂最重要 */}
      {frame >= S20_START && frame < S21_START && (
        <AbsoluteFill
          style={{
            opacity: s20Opacity,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: WHITE,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: 4,
              color: TEXT_DARK,
              opacity: conclusionMainOpacity,
              transform: `translateY(${conclusionMainY}px)`,
            }}
          >
            Storyboard 重點在於
          </div>
          <div
            style={{
              marginTop: 48,
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: 6,
              color: YELLOW,
              opacity: conclusionKeyOpacity,
              transform: `translateY(${conclusionKeyY}px)`,
            }}
          >
            其他夥伴要看得懂
          </div>
        </AbsoluteFill>
      )}

      {/* S21：團隊觀看、詢問、確認並形成共識 */}
      {frame >= S21_START && frame < 1210 && (
        <AbsoluteFill style={{ opacity: s21Opacity }}>
          <div
            style={{
              position: "absolute",
              left: 650,
              top: 286,
              width: 620,
              height: 350,
              overflow: "hidden",
              borderRadius: 24,
              border: `3px solid ${BORDER_LIGHT}`,
              backgroundColor: WHITE,
              boxShadow: `0 20px 50px ${withAlpha(TEXT_DARK, 0.12)}`,
              opacity: boardEntrance,
              transform: `translateY(${interpolate(
                boardEntrance,
                [0, 1],
                [28, 0],
              )}px) scale(${interpolate(boardEntrance, [0, 1], [0.94, 1])})`,
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
              <circle
                cx="37"
                cy="37"
                r="32"
                fill={withAlpha(YELLOW, 0.12)}
                stroke={YELLOW}
                strokeWidth="4"
              />
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
              <rect
                x="3"
                y="3"
                width="72"
                height="56"
                rx="8"
                fill={WHITE}
                stroke={YELLOW}
                strokeWidth="5"
              />
              <path
                d="M27 4V58M51 4V58M4 30H74"
                stroke={YELLOW}
                strokeWidth="4"
              />
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
                    : interpolate(
                        frame,
                        [item.start + 42, item.start + 70],
                        [1, 0],
                        clamp,
                      );

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
