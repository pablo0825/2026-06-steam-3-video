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
  BLACK,
  BLUE,
  CARD_BORDER,
  CHIP_BG,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";

// 第 4 集・第 2 頁：相關知識導覽與遊戲畫面大小（S05-S08）
//   S05：三個相關知識標籤，聚焦「遊戲畫面大小」
//   S06：橫式 / 直式尺寸卡
//   S07：橫式遊戲畫面滿版圖
//   S08：直式遊戲畫面置中，黑底補兩側

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';

const LANDSCAPE_IMAGE = staticFile("04-美術整合/screen-size-landscape.png");
const PORTRAIT_IMAGE = staticFile("04-美術整合/screen-size-portrait.png");

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// S05：相關知識導覽
const TAGS = ["遊戲畫面大小", "素材大小的基礎單位", "Sprite Sheet"] as const;
const TAG_FIRST = 72;
const TAG_STEP = 24;
const HIGHLIGHT = [210, 250] as const;
const S05_OUT = [306, 330] as const;

// S06：尺寸卡
const S06_IN = [330, 354] as const;
const S06_OUT = [516, 540] as const;
const CARD_FIRST = 374;
const CARD_STEP = 26;

// S07：橫式圖片
const S07_IN = [540, 564] as const;
const S07_OUT = [666, 690] as const;

// S08：直式圖片
const S08_IN = [690, 714] as const;

type KnowledgeTagProps = {
  label: string;
  index: number;
  frame: number;
  fps: number;
  highlight: number;
};

const KnowledgeTag: React.FC<KnowledgeTagProps> = ({
  label,
  index,
  frame,
  fps,
  highlight,
}) => {
  const entrance = spring({
    frame: frame - (TAG_FIRST + index * TAG_STEP),
    fps,
    config: { damping: 15, stiffness: 130 },
  });
  const isPrimary = index === 0;
  const hi = isPrimary ? highlight : 0;

  return (
    <div
      style={{
        width: index === 1 ? 520 : 390,
        height: 106,
        borderRadius: 999,
        background: interpolateColors(hi, [0, 1], [CHIP_BG, BLUE]),
        color: interpolateColors(hi, [0, 1], [TEXT_DARK, WHITE]),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [42, 0])}px) scale(${1 + hi * 0.06})`,
        boxShadow:
          hi > 0 ? `0 14px 34px ${withAlpha(BLUE, 0.22 * hi)}` : "none",
        fontSize: index === 1 ? 42 : 46,
        fontWeight: 850,
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

type SizeCardProps = {
  title: string;
  subtitle: string;
  index: number;
  frame: number;
  fps: number;
};

const SizeCard: React.FC<SizeCardProps> = ({
  title,
  subtitle,
  index,
  frame,
  fps,
}) => {
  const entrance = spring({
    frame: frame - (CARD_FIRST + index * CARD_STEP),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const fromX = index === 0 ? -70 : 70;

  return (
    <div
      style={{
        width: 560,
        height: 300,
        borderRadius: 28,
        border: `3px solid ${CARD_BORDER}`,
        background: WHITE,
        boxShadow: `0 18px 44px ${withAlpha(TEXT_DARK, 0.08)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        opacity: entrance,
        transform: `translateX(${interpolate(entrance, [0, 1], [fromX, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: 1,
          color: TEXT_DARK,
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 999,
          background: withAlpha(BLUE, 0.1),
          color: BLUE,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

type DimensionLabelProps = {
  text: string;
  opacity: number;
};

const DimensionLabel: React.FC<DimensionLabelProps> = ({ text, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: 32,
      top: 32,
      opacity,
      padding: "10px 22px",
      borderRadius: 999,
      background: withAlpha(TEXT_DARK, 0.58),
      color: WHITE,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 1,
      lineHeight: 1.1,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

export const Ch4Page2RelatedKnowledge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // S05
  const s05Opacity = interpolate(frame, S05_OUT, [1, 0], clamp);
  const promptOpacity = interpolate(frame, [36, 62], [0, 1], clamp);
  const highlight = interpolate(frame, HIGHLIGHT, [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // S06
  const s06Opacity =
    interpolate(frame, S06_IN, [0, 1], clamp) *
    interpolate(frame, S06_OUT, [1, 0], clamp);
  const s06Title = spring({
    frame: frame - 346,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // S07
  const s07Opacity =
    interpolate(frame, S07_IN, [0, 1], clamp) *
    interpolate(frame, S07_OUT, [1, 0], clamp);
  const landscapeScale = interpolate(frame, [540, 690], [1.01, 1], clamp);
  const s07LabelOpacity = interpolate(frame, [570, 590], [0, 1], clamp);

  // S08
  const s08Opacity = interpolate(frame, S08_IN, [0, 1], clamp);
  const s08LabelOpacity = interpolate(frame, [720, 740], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {/* S05：相關知識導覽 */}
      {frame < 332 && (
        <AbsoluteFill
          style={{
            opacity: s05Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginBottom: 56,
              opacity: promptOpacity,
              fontSize: 46,
              fontWeight: 650,
              letterSpacing: 3,
              color: SUBTLE,
              whiteSpace: "nowrap",
            }}
          >
            先認識幾個重要觀念
          </div>
          <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
            {TAGS.map((tag, index) => (
              <KnowledgeTag
                key={tag}
                label={tag}
                index={index}
                frame={frame}
                fps={fps}
                highlight={highlight}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 42,
              opacity: highlight,
              fontSize: 34,
              fontWeight: 750,
              letterSpacing: 1,
              color: BLUE,
              whiteSpace: "nowrap",
            }}
          >
            先從「遊戲畫面大小」開始 →
          </div>
        </AbsoluteFill>
      )}
      {/* S06：橫式 / 直式尺寸卡 */}
      {frame >= 326 && frame < 542 && (
        <AbsoluteFill
          style={{
            opacity: s06Opacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginBottom: 70,
              opacity: s06Title,
              transform: `translateY(${interpolate(s06Title, [0, 1], [32, 0])}px)`,
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: 4,
              color: TEXT_DARK,
              whiteSpace: "nowrap",
            }}
          >
            遊戲畫面大小
          </div>
          <div style={{ display: "flex", gap: 76 }}>
            <SizeCard
              title="1920×1080"
              subtitle="16:9 橫式"
              index={0}
              frame={frame}
              fps={fps}
            />
            <SizeCard
              title="1080×1920"
              subtitle="9:16 直式"
              index={1}
              frame={frame}
              fps={fps}
            />
          </div>
        </AbsoluteFill>
      )}
      {/* S07：橫式遊戲畫面滿版 */}
      {frame >= 536 && frame < 692 && (
        <AbsoluteFill
          style={{
            opacity: s07Opacity,
            backgroundColor: BLACK,
            overflow: "hidden",
          }}
        >
          <Img
            src={LANDSCAPE_IMAGE}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${landscapeScale})`,
            }}
          />
          <DimensionLabel text="1920×1080" opacity={s07LabelOpacity} />
        </AbsoluteFill>
      )}
      {/* S08：直式遊戲畫面置中，黑底補兩側 */}
      {frame >= 686 && (
        <AbsoluteFill
          style={{
            opacity: s08Opacity,
            backgroundColor: BLACK,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Img
            src={PORTRAIT_IMAGE}
            style={{
              height: "100%",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
            from={-43}
          />
          <DimensionLabel text="1080×1920" opacity={s08LabelOpacity} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
