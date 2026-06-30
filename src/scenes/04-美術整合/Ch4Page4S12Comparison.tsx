import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  DOT_RED,
  GREEN,
  NEUTRAL_50,
  NEUTRAL_100,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  WINDOW_BAR,
  YELLOW,
  withAlpha,
} from "../../theme/colors";
import { FONT, clamp, easeStandard } from "../../theme/motion";
import { VerdictBadge } from "../../components/VerdictBadge";

// 第 4 集・第 4 頁・S12：PPU=100 → 128（540 幀，沿用 S09 視窗格局）
//   開場白停留 → 先跳出「128×128」sprite 圖片（直接放圖、帶陰影，畫面正中央）→
//   圖片淡出、主視窗在原位彈入 → 同一張 sprite 相對「1 unit」的大小，隨 PPU 由
//   100→128 從「塞不下(✗)」縮到「剛好貼合(✓)」。
const ENDING_FADE = [422, 450] as const; // 相對位移後的 f（實際 512→540）

// 開場前置：白停留 → 128×128 sprite 圖片進出，之後原動畫整體後移 SHIFT 幀。
const HOLD = 18; // 開場白停留
const CARD_IN = HOLD + 4; // 圖片彈入
const CARD_OUT = [72, 90] as const; // 圖片淡出縮小
const SHIFT = 90; // 原動畫整體後移（= 圖片退場末端，視窗於此時彈入）
const IMG_SIZE = 240; // 前置 sprite 圖片邊長

const REF = 210; // 虛線參考框 = 1 unit
const FACTOR_BAD = 1.28; // 128 / 100：超出參考框
const FACTOR_GOOD = 1.0; // 128 / 128：剛好貼合

const MORPH = [232, 272] as const; // PPU 100→128 的縮放
// 標題與判定採「先淡出舊、再淡入新」(不重疊，避免 PPU 數字與 ✗/✓ 疊字)
const PPU100_OUT = [238, 250] as const;
const PPU128_IN = [252, 264] as const;
const FAIL_OUT = [256, 268] as const;
const PASS_IN = [270, 286] as const;

// 圖片占位 glyph（與 S09 同一套）：外框 + 太陽 + 山形
const ArtGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect
      x={6}
      y={6}
      width={88}
      height={88}
      rx={12}
      fill={NEUTRAL_100}
      stroke={CARD_BORDER}
      strokeWidth={3}
    />
    <circle cx={34} cy={34} r={11} fill={YELLOW} />
    <path d="M14 84 L42 50 L60 72 L74 58 L86 84 Z" fill={withAlpha(BLUE, 0.55)} />
  </svg>
);

export const Ch4Page4S12Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 前置圖卡（128×128）：spring 彈入 → 停留 → 淡出縮小
  const cardEnter = spring({
    frame: frame - CARD_IN,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const cardLeave = interpolate(frame, CARD_OUT, [0, 1], clamp);
  const cardOpacity = cardEnter * (1 - cardLeave);
  const cardScale =
    interpolate(cardEnter, [0, 1], [0.88, 1]) *
    interpolate(cardLeave, [0, 1], [1, 0.92]);

  // 原動畫整體後移 SHIFT 幀：以下時序皆以 f 計
  const f = frame - SHIFT;

  const winEnter = spring({
    frame: f,
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  // sprite 由上方落入視窗（同 S09 美術圖落下手法：translateY + 淡入）
  const spriteEnter = spring({
    frame: f - 52,
    fps,
    config: { damping: 17, stiffness: 120 },
  });
  const spriteDropY = interpolate(spriteEnter, [0, 1], [-190, 0]);
  const spriteOpacity = interpolate(f, [52, 68], [0, 1], clamp);
  const failEnter = spring({
    frame: f - 84,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // PPU 100 → 128：glyph 由 1.28× 縮到 1.0×（貼合參考框）
  const morph = interpolate(f, MORPH, [0, 1], easeStandard);
  const glyphSize = REF * interpolate(morph, [0, 1], [FACTOR_BAD, FACTOR_GOOD]);
  const titleOut = interpolate(f, PPU100_OUT, [1, 0], clamp);
  const titleIn = interpolate(f, PPU128_IN, [0, 1], clamp);
  const failOut = interpolate(f, FAIL_OUT, [1, 0], clamp);
  const passIn = interpolate(f, PASS_IN, [0, 1], clamp);
  const passPop = spring({
    frame: f - PASS_IN[0],
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const out = interpolate(f, ENDING_FADE, [1, 0], clamp);

  const ppuLabelStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    color: TEXT_DARK,
    fontSize: 30,
    fontWeight: 850,
    letterSpacing: 1,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* 開場前置圖片：128×128 sprite（直接放圖＋陰影，畫面正中央），淡出後接主視窗 */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: `translate(-50%, -50%) scale(${cardScale})`,
            opacity: cardOpacity,
            lineHeight: 0,
          }}
        >
          <ArtGlyph size={IMG_SIZE} />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "calc(100% + 26px)",
              transform: "translateX(-50%)",
              color: TEXT_DARK,
              fontSize: 48,
              fontWeight: 850,
              letterSpacing: 1,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            128×128
          </div>
        </div>

        {/* 視窗（沿用 S09） */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 470,
            width: 700,
            height: 500,
            transform: `translate(-50%, -50%) scale(${interpolate(winEnter, [0, 1], [0.88, 1])})`,
            opacity: winEnter,
            borderRadius: 22,
            overflow: "hidden",
            background: WHITE,
            border: `3px solid ${CARD_BORDER}`,
            boxShadow: `0 18px 42px ${withAlpha(TEXT_DARK, 0.1)}`,
          }}
        >
          <div
            style={{
              height: 60,
              background: WINDOW_BAR,
              borderBottom: `1px solid ${CARD_BORDER}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 22px",
            }}
          >
            <span
              style={{ width: 13, height: 13, borderRadius: "50%", background: DOT_RED }}
            />
            <span
              style={{ width: 13, height: 13, borderRadius: "50%", background: YELLOW }}
            />
            <span
              style={{ width: 13, height: 13, borderRadius: "50%", background: GREEN }}
            />
            {/* PPU=100 → PPU=128 crossfade */}
            <div style={{ position: "relative", marginLeft: 12, width: 200, height: 36 }}>
              <span style={{ ...ppuLabelStyle, opacity: titleOut }}>PPU=100</span>
              <span style={{ ...ppuLabelStyle, opacity: titleIn }}>PPU=128</span>
            </div>
          </div>

          {/* 場景區：隨 PPU 縮放的 sprite（下層）+ 1 unit 虛線參考框（上層，永遠可見） */}
          <div
            style={{
              position: "relative",
              height: 440,
              background: NEUTRAL_50,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                zIndex: 1,
                opacity: spriteOpacity,
                transform: `translate(-50%, -50%) translateY(${spriteDropY}px)`,
              }}
            >
              <ArtGlyph size={glyphSize} />
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: REF,
                height: REF,
                zIndex: 2,
                borderRadius: 14,
                border: `3px dashed ${SUBTLE}`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </div>

        {/* 下方判定：✗ 128 px ≠ 1 unit → ✓ 128 px = 1 unit */}
        <div style={{ position: "absolute", left: 960, top: 840 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translateX(-50%) translateY(${interpolate(failEnter, [0, 1], [28, 0])}px)`,
              opacity: failEnter * failOut,
            }}
          >
            <VerdictBadge
              kind="fail"
              label="128 px ≠ 1 unit"
              size={60}
              labelSize={50}
              labelColor={TEXT_DARK}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translateX(-50%) scale(${interpolate(passPop, [0, 1], [0.8, 1])})`,
              opacity: passIn,
            }}
          >
            <VerdictBadge
              kind="pass"
              label="128 px = 1 unit"
              size={60}
              labelSize={50}
              labelColor={TEXT_DARK}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
