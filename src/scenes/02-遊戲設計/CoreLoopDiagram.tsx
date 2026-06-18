import React from "react";
import { interpolate } from "remotion";
import {
  BORDER_LIGHT,
  SUBTLE,
  TEXT_DARK,
  WHITE,
  YELLOW,
  withAlpha,
} from "../../theme/colors";

export type CoreLoopIconName = "action" | "achievement" | "feedback" | "growth";

export type CoreLoopNodeData = {
  label: string;
  example: string;
  icon: CoreLoopIconName;
};

export const CORE_LOOP_ARROW_PATHS = [
  "M 1070 385 C 1210 405, 1255 455, 1277 498",
  "M 1288 694 C 1260 770, 1168 814, 1074 830",
  "M 846 830 C 752 814, 665 772, 643 722",
  "M 632 526 C 652 474, 705 408, 850 385",
] as const;

const POSITIONS = [
  { x: 960, y: 350 },
  { x: 1320, y: 610 },
  { x: 960, y: 850 },
  { x: 600, y: 610 },
] as const;

const LoopIcon: React.FC<{ name: CoreLoopIconName; color: string }> = ({
  name,
  color,
}) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      {name === "action" && (
        <>
          <path
            {...common}
            d="M15 20h26c6 0 10 5 9 11l-2 9c-1 5-7 7-11 3l-4-4H23l-4 4c-4 4-10 2-11-3l-2-9c-1-6 3-11 9-11Z"
          />
          <path {...common} d="M17 27v10M12 32h10M38 29h.1M43 35h.1" />
        </>
      )}
      {name === "achievement" && (
        <>
          <path {...common} d="M15 47V10" />
          <path {...common} d="M16 12h25l-5 9 5 9H16Z" />
          <path {...common} d="M10 47h12" />
        </>
      )}
      {name === "feedback" && (
        <>
          <circle {...common} cx="28" cy="28" r="19" />
          <path
            {...common}
            d="M33 20c-2-2-9-2-10 2-2 6 12 4 10 11-1 5-9 5-12 2M28 15v26"
          />
        </>
      )}
      {name === "growth" && (
        <>
          <path {...common} d="M11 43 25 29l8 8 13-18" />
          <path {...common} d="M36 19h10v10" />
          <path {...common} d="M11 48h36" />
        </>
      )}
    </svg>
  );
};

export const CoreLoopDiagram: React.FC<{
  nodes: CoreLoopNodeData[];
  nodeProgress: number[];
  exampleProgress: number[];
  arrowProgress: number[];
  activeIndex: number;
  markerPrefix: string;
  exampleFontSize?: number;
}> = ({
  nodes,
  nodeProgress,
  exampleProgress,
  arrowProgress,
  activeIndex,
  markerPrefix,
  exampleFontSize = 25,
}) => {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          {CORE_LOOP_ARROW_PATHS.flatMap((_, index) => [
            <marker
              key={`base-${index}`}
              id={`${markerPrefix}-${index}-base`}
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L12,6 L0,12 Z" fill={BORDER_LIGHT} />
            </marker>,
            <marker
              key={`active-${index}`}
              id={`${markerPrefix}-${index}-active`}
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L12,6 L0,12 Z" fill={YELLOW} />
            </marker>,
          ])}
        </defs>

        {CORE_LOOP_ARROW_PATHS.map((path, index) => {
          const active = activeIndex === index;
          return (
            <path
              key={path}
              d={path}
              pathLength={1}
              fill="none"
              stroke={active ? YELLOW : BORDER_LIGHT}
              strokeWidth={active ? 8 : 6}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={1 - arrowProgress[index]}
              markerEnd={`url(#${markerPrefix}-${index}-${active ? "active" : "base"})`}
              opacity={arrowProgress[index]}
            />
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const active = activeIndex === index;
        const progress = nodeProgress[index];
        const position = POSITIONS[index];
        const scale = interpolate(progress, [0, 1], [0.82, active ? 1.04 : 1]);

        return (
          <div
            key={node.label}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: 220,
              height: 220,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: progress,
              borderRadius: "50%",
              backgroundColor: WHITE,
              border: `4px solid ${active ? YELLOW : BORDER_LIGHT}`,
              boxShadow: active
                ? `0 18px 44px ${withAlpha(YELLOW, 0.2)}`
                : `0 12px 30px ${withAlpha(TEXT_DARK, 0.08)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 2,
            }}
          >
            <LoopIcon
              name={node.icon}
              color={active ? YELLOW : SUBTLE}
            />
            <div
              style={{
                fontSize: 42,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: 4,
                color: TEXT_DARK,
              }}
            >
              {node.label}
            </div>
            <div
              style={{
                height: 34,
                marginTop: 5,
                fontSize: exampleFontSize,
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: 1,
                color: active ? YELLOW : SUBTLE,
                opacity: exampleProgress[index],
                transform: `translateY(${interpolate(
                  exampleProgress[index],
                  [0, 1],
                  [12, 0],
                )}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {node.example}
            </div>
          </div>
        );
      })}
    </div>
  );
};
