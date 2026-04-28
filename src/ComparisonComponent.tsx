import React from "react";
import { interpolate, spring } from "remotion";

interface Props {
  label: string;
  leftValue: number;
  rightValue: number;
  leftName: string;
  rightName: string;
  leftColor: string;
  rightColor: string;
  higherIsBetter: boolean;
  formatValue: (v: number) => string;
  note?: string;
  frame: number;
  startFrame: number;
  fps: number;
}

const MAX_BAR = 460; // px — bar track width

export const ComparisonComponent: React.FC<Props> = ({
  label,
  leftValue,
  rightValue,
  leftName,
  rightName,
  leftColor,
  rightColor,
  higherIsBetter,
  formatValue,
  note,
  frame,
  startFrame,
  fps,
}) => {
  const f = frame - startFrame;
  const leftWins = higherIsBetter ? leftValue > rightValue : leftValue < rightValue;
  const maxVal = Math.max(leftValue, rightValue);

  // Bars grow with a slight stagger for a "racing" effect
  const leftProg = interpolate(f, [24, 94], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightProg = interpolate(f, [32, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftBarW = (leftValue / maxVal) * MAX_BAR * leftProg;
  const rightBarW = (rightValue / maxVal) * MAX_BAR * rightProg;

  // Numbers count up in sync with bars
  const leftCountUp = leftValue * leftProg;
  const rightCountUp = rightValue * rightProg;

  // Label slides down from above
  const labelSpring = spring({
    frame: f - 8,
    fps,
    config: { damping: 16, stiffness: 200 },
    durationInFrames: 30,
  });
  const labelY = interpolate(labelSpring, [0, 1], [-50, 0]);
  const labelOp = interpolate(labelSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rows fade in
  const rowOp = interpolate(f, [16, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Winner stamp springs in after bars finish
  const stampSpring = spring({
    frame: f - 112,
    fps,
    config: { damping: 8, stiffness: 300 },
    durationInFrames: 30,
  });
  const stampScale = interpolate(stampSpring, [0, 1], [0, 1]);
  const stampOp = interpolate(stampSpring, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Loser dims when winner is revealed
  const loserDim = interpolate(f, [112, 130], [1, 0.38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftSectionOp = leftWins ? 1 : loserDim;
  const rightSectionOp = leftWins ? loserDim : 1;

  const renderRow = (
    name: string,
    color: string,
    barW: number,
    countUp: number,
    wins: boolean,
    sectionOp: number,
  ) => (
    <div style={{ opacity: sectionOp * rowOp, width: "100%" }}>
      {/* Brand name */}
      <div
        style={{
          fontSize: 38,
          fontWeight: 900,
          color,
          letterSpacing: "3px",
          marginBottom: 14,
        }}
      >
        {name}
      </div>
      {/* Bar + value + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* Track */}
        <div
          style={{
            width: MAX_BAR,
            height: 84,
            backgroundColor: color + "22",
            borderRadius: 14,
            overflow: "hidden",
            border: `2px solid ${color}44`,
            flexShrink: 0,
          }}
        >
          {/* Animated fill */}
          <div
            style={{
              width: barW,
              height: "100%",
              backgroundColor: color,
              borderRadius: 14,
              boxShadow: `0 0 28px ${color}99`,
            }}
          />
        </div>

        {/* Counted-up value */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color,
            lineHeight: 1,
            minWidth: 170,
            textShadow: `0 0 40px ${color}66`,
          }}
        >
          {formatValue(countUp)}
        </div>

        {/* Winner stamp */}
        <div
          style={{
            transform: `scale(${wins ? stampScale : 0})`,
            opacity: wins ? stampOp : 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              backgroundColor: "#16A34A",
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "2px",
              paddingInline: 22,
              paddingBlock: 10,
              borderRadius: 999,
              boxShadow: "0 0 28px #16A34A99",
              whiteSpace: "nowrap",
            }}
          >
            ✓ WINS
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingInline: 60,
        gap: 48,
      }}
    >
      {/* Winner-side glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 55% at 50% 50%, ${leftWins ? leftColor : rightColor}14 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Stat label */}
      <div
        style={{
          fontSize: 76,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "5px",
          textAlign: "left",
          opacity: labelOp,
          transform: `translateY(${labelY}px)`,
          textShadow: "0 2px 30px rgba(0,0,0,0.7)",
          alignSelf: "center",
        }}
      >
        {label}
      </div>

      {/* Bars */}
      {renderRow(leftName, leftColor, leftBarW, leftCountUp, leftWins, leftSectionOp)}
      {renderRow(rightName, rightColor, rightBarW, rightCountUp, !leftWins, rightSectionOp)}

      {/* Contextual note (e.g. for fare: lower = better) */}
      {note && (
        <div
          style={{
            fontSize: 30,
            color: "#F59E0B",
            fontWeight: 700,
            letterSpacing: "2px",
            textAlign: "center",
            alignSelf: "center",
            opacity: rowOp,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};
