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
  NEUTRAL_50,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  withAlpha,
} from "../../theme/colors";
import { VerdictBadge } from "../../components/VerdictBadge";
import { FONT, clamp } from "../../theme/motion";

// 第 3 集・第 7 頁 S18 前半：左右對比「一個功能，一份 Spec」（簡潔文件卡版）
//   左＝反例：三個功能全塞進「一個」視窗（spec.md） → ✗（先出現）
//   右＝正例：三個功能各自「一個」視窗（jump/dash/climb-spec.md） → ✓（後出現）
const FEATURES = [
  { name: "跳躍", file: "jump-spec.md", desc: "按空白鍵，角色向上跳" },
  { name: "衝刺", file: "dash-spec.md", desc: "快速向前移動一段" },
  { name: "攀牆", file: "climb-spec.md", desc: "貼牆時向上攀爬" },
] as const;

const VERDICT_TOP = 880;

// 反例（左，先出現）：單一視窗中心
const LEFT_CX = 480;
const LEFT_CY = 460;
const LEFT_W = 470;
// 正例（右，後出現）：三視窗直排（中心 x，各自 y；間距拉大）
const RIGHT_CX = 1440;
const RIGHT_CY = [260, 460, 660] as const;
const RIGHT_W = 440;

// 簡潔文件卡外框：白底圓角＋淺邊框＋柔和陰影，檔名為藍色小標題，body 放 children
const SpecWindow: React.FC<{
  fileName: string;
  width: number;
  cx: number;
  cy: number;
  opacity: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ fileName, width, cx, cy, opacity, scale = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: cy,
      width,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      borderRadius: 16,
      backgroundColor: WHITE,
      border: `1px solid ${CARD_BORDER}`,
      boxShadow: `0 10px 30px ${withAlpha(TEXT_DARK, 0.07)}`,
      padding: "22px 26px",
    }}
  >
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 0.5,
        color: BLUE,
        marginBottom: 16,
      }}
    >
      {fileName}
    </div>
    {children}
  </div>
);

export const Ch3Page7S18SpecPerFeature: React.FC = () => {
  // 開場白底先停留 HOLD 幀：整段往後延（負幀時 spring／interpolate 自動維持初始＝白底）
  const HOLD = 24;
  const frame = useCurrentFrame() - HOLD;
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  // 虛線先出現（titleIn @0），其餘整體延後：左視窗 ~20 → ✗ ~68，右三視窗 ~106 → ✓ ~170
  const leftWin = spring({
    frame: frame - 20,
    fps,
    config: { damping: 17, stiffness: 120 },
  });
  const failIn = spring({
    frame: frame - 68,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const passIn = spring({
    frame: frame - 170,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const out = interpolate(frame, [220, 244], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: NEUTRAL_50, fontFamily: FONT }}>
      <AbsoluteFill style={{ opacity: out }}>
        {/* 中央分隔線 */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 140,
            height: 840,
            transform: "translateX(-50%)",
            borderLeft: `2px dashed ${withAlpha(SUBTLE, 0.35)}`,
            opacity: titleIn,
          }}
        />

        {/* 反例：一個視窗塞三個功能（先出現） */}
        <SpecWindow
          fileName="spec.md"
          width={LEFT_W}
          cx={LEFT_CX}
          cy={LEFT_CY}
          opacity={leftWin}
          scale={interpolate(leftWin, [0, 1], [0.9, 1])}
        >
          <div style={{ display: "grid", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.name}>
                <div
                  style={{ fontSize: 28, fontWeight: 900, color: TEXT_DARK }}
                >
                  {f.name}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 22,
                    fontWeight: 600,
                    color: SUBTLE,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </SpecWindow>

        {/* 正例：三個視窗各一個功能（後出現，逐一） */}
        {FEATURES.map((f, i) => {
          const win = spring({
            frame: frame - (106 + i * 14),
            fps,
            config: { damping: 17, stiffness: 120 },
          });
          return (
            <SpecWindow
              key={f.file}
              fileName={f.file}
              width={RIGHT_W}
              cx={RIGHT_CX}
              cy={RIGHT_CY[i]}
              opacity={win}
              scale={interpolate(win, [0, 1], [0.9, 1])}
            >
              <>
                <div
                  style={{ fontSize: 30, fontWeight: 900, color: TEXT_DARK }}
                >
                  {f.name}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 22,
                    fontWeight: 600,
                    color: SUBTLE,
                  }}
                >
                  {f.desc}
                </div>
              </>
            </SpecWindow>
          );
        })}

        {/* 判定：✗ 反例（左） ／ ✓ 正例（右） */}
        <div
          style={{
            position: "absolute",
            left: LEFT_CX,
            top: VERDICT_TOP,
            transform: `translateX(-50%) scale(${failIn})`,
            opacity: failIn,
          }}
        >
          <VerdictBadge
            kind="fail"
            label="混合內容"
            labelSize={46}
            labelColor={TEXT_DARK}
            shadow
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: RIGHT_CX,
            top: VERDICT_TOP,
            transform: `translateX(-50%) scale(${passIn})`,
            opacity: passIn,
          }}
        >
          <VerdictBadge
            kind="pass"
            label="獨立檔案"
            labelSize={46}
            labelColor={TEXT_DARK}
            shadow
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
