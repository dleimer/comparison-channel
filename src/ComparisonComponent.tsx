import React from "react";
import { interpolate, spring } from "remotion";

interface Props {
  label: string;
  leftValue: number;
  rightValue: number;
  leftDisplay: string;
  rightDisplay: string;
  leftName: string;
  rightName: string;
  leftColor: string;
  rightColor: string;
  higherIsBetter: boolean;
  frame: number;
  startFrame: number;
  fps: number;
}

export const ComparisonComponent: React.FC<Props> = ({
  label,
  leftValue,
  rightValue,
  leftDisplay,
  rightDisplay,
  leftName,
  rightName,
  leftColor,
  rightColor,
  higherIsBetter,
  frame,
  startFrame,
  fps,
}) => {
  const f = frame - startFrame;

  const leftWins = higherIsBetter ? leftValue > rightValue : leftValue < rightValue;
  const isTie = leftValue === rightValue;

  // Panels slide in from edges
  const panelSpring = spring({
    frame: f,
    fps,
    config: { damping: 16, stiffness: 200 },
    durationInFrames: 30,
  });
  const leftX = interpolate(panelSpring, [0, 1], [-540, 0]);
  const rightX = interpolate(panelSpring, [0, 1], [540, 0]);

  // Label + value fade up
  const contentOpacity = interpolate(f, [28, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentY = interpolate(f, [28, 48], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Winner stamp
  const stampSpring = spring({
    frame: f - 50,
    fps,
    config: { damping: 8, stiffness: 300 },
    durationInFrames: 30,
  });
  const stampScale = interpolate(stampSpring, [0, 1], [0, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Loser dims after stamp appears
  const loserOpacity = interpolate(f, [60, 75], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftOpacity = isTie ? 1 : leftWins ? 1 : loserOpacity;
  const rightOpacity = isTie ? 1 : leftWins ? loserOpacity : 1;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Centered label */}
      <div
        className="text-white font-black uppercase tracking-widest z-10 mb-8"
        style={{
          fontSize: 38,
          letterSpacing: "6px",
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </div>

      {/* Side panels */}
      <div className="flex w-full" style={{ height: 720 }}>
        {/* Left panel */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "50%",
            backgroundColor: leftColor + "22",
            borderRight: `3px solid ${leftColor}`,
            transform: `translateX(${leftX}px)`,
            opacity: leftOpacity,
          }}
        >
          <div
            className="font-black text-white text-center"
            style={{
              fontSize: 34,
              letterSpacing: "2px",
              marginBottom: 16,
              opacity: contentOpacity,
              transform: `translateY(${contentY}px)`,
            }}
          >
            {leftName}
          </div>
          <div
            className="font-black text-center"
            style={{
              fontSize: 100,
              color: leftColor,
              lineHeight: 1,
              textShadow: `0 0 60px ${leftColor}88`,
              opacity: contentOpacity,
              transform: `translateY(${contentY}px)`,
            }}
          >
            {leftDisplay}
          </div>

          {/* Winner stamp */}
          {!isTie && leftWins && (
            <div
              className="flex items-center justify-center mt-6"
              style={{
                transform: `scale(${stampScale})`,
                opacity: stampOpacity,
              }}
            >
              <div
                className="font-black text-white flex items-center gap-2 px-6 py-3 rounded-full"
                style={{
                  fontSize: 28,
                  backgroundColor: "#16A34A",
                  boxShadow: "0 0 30px #16A34A88",
                  letterSpacing: "3px",
                }}
              >
                ✓ WINNER
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "50%",
            backgroundColor: rightColor + "22",
            borderLeft: `3px solid ${rightColor}`,
            transform: `translateX(${rightX}px)`,
            opacity: rightOpacity,
          }}
        >
          <div
            className="font-black text-white text-center"
            style={{
              fontSize: 34,
              letterSpacing: "2px",
              marginBottom: 16,
              opacity: contentOpacity,
              transform: `translateY(${contentY}px)`,
            }}
          >
            {rightName}
          </div>
          <div
            className="font-black text-center"
            style={{
              fontSize: 100,
              color: rightColor,
              lineHeight: 1,
              textShadow: `0 0 60px ${rightColor}88`,
              opacity: contentOpacity,
              transform: `translateY(${contentY}px)`,
            }}
          >
            {rightDisplay}
          </div>

          {/* Winner stamp */}
          {!isTie && !leftWins && (
            <div
              className="flex items-center justify-center mt-6"
              style={{
                transform: `scale(${stampScale})`,
                opacity: stampOpacity,
              }}
            >
              <div
                className="font-black text-white flex items-center gap-2 px-6 py-3 rounded-full"
                style={{
                  fontSize: 28,
                  backgroundColor: "#16A34A",
                  boxShadow: "0 0 30px #16A34A88",
                  letterSpacing: "3px",
                }}
              >
                ✓ WINNER
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VS divider badge */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-white font-black text-black z-20"
        style={{
          width: 72,
          height: 72,
          fontSize: 22,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 30px rgba(255,255,255,0.4)",
          letterSpacing: "1px",
        }}
      >
        VS
      </div>
    </div>
  );
};
