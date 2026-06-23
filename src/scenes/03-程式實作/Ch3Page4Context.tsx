import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BLUE,
  CARD_BORDER,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

// 第 3 集・第 4 頁：Context
//   S08（0–240）：極簡定義
//   S09（240–690）：容量裝滿 → 新資訊進入 → 舊資訊移出

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = {
  ...clamp,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const S08_OUT = [212, 238] as const;
const DEFINITION_IN = [44, 68] as const;

const S09_IN = [242, 270] as const;
const CONTAINER_IN = [260, 292] as const;
const ITEM_FIRST = 286;
const ITEM_STEP = 24;
const NEW_ITEM_IN = [430, 500] as const;
const OLD_ITEM_OUT = [430, 500] as const;
const WARNING_IN = [530, 566] as const;

const CARD_WIDTH = 218;
const CARD_GAP = 18;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const CARD_LEFT = 28;

const CONTEXT_ITEMS = [
  { id: "A", label: "前面的需求" },
  { id: "B", label: "功能規則" },
  { id: "C", label: "修改紀錄" },
  { id: "D", label: "目前問題" },
] as const;

export const Ch3Page4Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const definitionIn = interpolate(frame, DEFINITION_IN, [0, 1], ease);
  const s08Out = interpolate(frame, S08_OUT, [1, 0], clamp);
  const s09In = interpolate(frame, S09_IN, [0, 1], ease);
  const containerIn = interpolate(frame, CONTAINER_IN, [0, 1], ease);
  const newItemIn = interpolate(frame, NEW_ITEM_IN, [0, 1], ease);
  const oldItemOut = interpolate(frame, OLD_ITEM_OUT, [0, 1], ease);
  const warningIn = interpolate(frame, WARNING_IN, [0, 1], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, fontFamily: FONT }}>
      {frame < 240 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: s08Out,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: 3,
              color: TEXT_DARK,
              transform: `scale(${interpolate(titleIn, [0, 1], [0.92, 1])})`,
              opacity: titleIn,
            }}
          >
            Context
          </div>
          <div
            style={{
              marginTop: 44,
              maxWidth: 1540,
              fontSize: 46,
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: 1,
              textAlign: "center",
              color: SUBTLE,
              opacity: definitionIn,
            }}
          >
            Context 是 AI 的
            <span style={{ color: YELLOW, fontWeight: 800 }}>短期記憶</span>
            ，我們和 AI 的對話，會
            <span style={{ color: YELLOW, fontWeight: 800 }}>
              暫時存在
            </span>{" "}
            Context 裡
          </div>
        </AbsoluteFill>
      )}

      {frame >= 240 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-20px)",
            opacity: s09In,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: TEXT_DARK,
              letterSpacing: 2,
            }}
          >
            Context 的限制
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 62,
              width: 1220,
              height: 300,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 110,
                top: 0,
                width: 1000,
                height: 190,
                borderRadius: 28,
                border: `3px solid ${CARD_BORDER}`,
                backgroundColor: withAlpha(BLUE, 0.05),
                boxShadow: `0 18px 48px ${withAlpha(TEXT_DARK, 0.08)}`,
                opacity: containerIn,
                transform: `scaleX(${interpolate(
                  containerIn,
                  [0, 1],
                  [0.94, 1],
                )})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  top: 22,
                  fontSize: 24,
                  fontWeight: 800,
                  color: BLUE,
                  letterSpacing: 3,
                }}
              >
                CONTEXT
              </div>
            </div>

            {CONTEXT_ITEMS.map((item, index) => {
              const itemIn = interpolate(
                frame,
                [
                  ITEM_FIRST + index * ITEM_STEP,
                  ITEM_FIRST + index * ITEM_STEP + 20,
                ],
                [0, 1],
                ease,
              );
              const isOldest = index === 0;
              const baseX = 110 + CARD_LEFT + index * CARD_STEP;
              const replacementX = isOldest
                ? interpolate(
                    oldItemOut,
                    [0, 1],
                    [baseX, -CARD_WIDTH - 30],
                    ease,
                  )
                : interpolate(
                    oldItemOut,
                    [0, 1],
                    [baseX, baseX - CARD_STEP],
                    ease,
                  );
              const oldOpacity = isOldest
                ? interpolate(oldItemOut, [0, 0.82, 1], [1, 1, 0], clamp)
                : 1;

              return (
                <div
                  key={item.id}
                  style={{
                    position: "absolute",
                    left: replacementX,
                    top: 80,
                    width: CARD_WIDTH,
                    height: 82,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    color: isOldest ? SUBTLE : TEXT_DARK,
                    backgroundColor: WHITE,
                    border: `2px solid ${CARD_BORDER}`,
                    opacity: itemIn * oldOpacity,
                    transform: `translateY(${interpolate(
                      itemIn,
                      [0, 1],
                      [24, 0],
                    )}px)`,
                  }}
                >
                  {item.label}
                </div>
              );
            })}

            <div
              style={{
                position: "absolute",
                left: interpolate(
                  newItemIn,
                  [0, 1],
                  [1220 + 30, 110 + CARD_LEFT + 3 * CARD_STEP],
                  ease,
                ),
                top: 80,
                width: CARD_WIDTH,
                height: 82,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: WHITE,
                backgroundColor: BLUE,
                opacity: interpolate(newItemIn, [0, 0.18, 1], [0, 1, 1], clamp),
                boxShadow: `0 12px 28px ${withAlpha(BLUE, 0.22)}`,
              }}
            >
              新的資訊
            </div>
          </div>

          <div
            aria-label="Context 有容量的限制，新資訊會逐漸取代舊資訊"
            style={{
              marginTop: 20,
              fontSize: 42,
              fontWeight: 800,
              color: TEXT_DARK,
              opacity: warningIn,
              transform: `translateY(${interpolate(
                warningIn,
                [0, 1],
                [18, 0],
              )}px)`,
            }}
          >
            Context 有<span style={{ color: YELLOW }}>容量的限制</span>
            ，新資訊會逐漸
            <span style={{ color: YELLOW }}>取代舊資訊</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
