import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ComparisonComponent } from "./ComparisonComponent";
import "../index.css";

const CARNIVAL_RED = "#CC0000";
const ROYAL_BLUE  = "#003087";
const GOLD        = "#FFD700";
const TOTAL_FRAMES = 1740;

const sceneOp = (frame: number, s: number, e: number, fade = 14): number =>
  interpolate(frame, [s, s + fade, e - fade, e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Each stat gets 375 frames (~12.5s). 2-frame beat gap between stats.
const STATS = [
  {
    label: "REVENUE",
    leftValue: 26.2,
    rightValue: 17.4,
    higherIsBetter: true,
    formatValue: (v: number) => `$${v.toFixed(1)}B`,
    startFrame: 92,
    endFrame: 467,
  },
  {
    label: "PROFIT MARGIN",
    leftValue: 11,
    rightValue: 24,
    higherIsBetter: true,
    formatValue: (v: number) => `${Math.round(v)}%`,
    startFrame: 469,
    endFrame: 844,
  },
  {
    label: "AVG 7-DAY FARE",
    leftValue: 709,
    rightValue: 1471,
    higherIsBetter: false,
    formatValue: (v: number) => `$${Math.round(v).toLocaleString("en-US")}`,
    note: "★  LOWER PRICE WINS",
    startFrame: 846,
    endFrame: 1221,
  },
  {
    label: "CUSTOMER RATING",
    leftValue: 77,
    rightValue: 85,
    higherIsBetter: true,
    formatValue: (v: number) => `${Math.round(v)}%`,
    startFrame: 1223,
    endFrame: 1598,
  },
];

export const CruiseWars: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const SAFE_TOP    = height * 0.15;   // 288px
  const SAFE_BOTTOM = height * 0.85;   // 1632px

  // ── Progress bar ─────────────────────────────────────────────────────────
  const progress = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── HOOK (0–90) ───────────────────────────────────────────────────────────
  const hookOp = sceneOp(frame, 0, 90, 10);

  const titleSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.8 },
    durationInFrames: 30,
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.25, 1.0]);
  const titleOpacity = interpolate(titleSpring, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shakeEnvelope = interpolate(frame, [6, 12, 30, 60, 90], [0, 1, 0.7, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 4.2) * 22 * shakeEnvelope;

  const subtitleOp = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [18, 36], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── VERDICT (1600–1740) ───────────────────────────────────────────────────
  const verdictOp = sceneOp(frame, 1600, 1740, 16);

  const tieSpring = spring({
    frame: frame - 1618,
    fps,
    config: { damping: 8, stiffness: 290, mass: 1.1 },
    durationInFrames: 34,
  });
  const tieScale = interpolate(tieSpring, [0, 1], [0.2, 1.0]);
  const tieOp    = interpolate(tieSpring, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOp = interpolate(frame, [1658, 1676], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [1658, 1676], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        backgroundColor: "#0A0A0F",
        fontFamily: "'Arial Black', Arial, sans-serif",
      }}
    >
      {/* Global bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, #0C1020 0%, #0A0A0F 70%)",
        }}
      />

      {/* ════════ HOOK ════════ */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          inset: 0,
          top: SAFE_TOP,
          height: SAFE_BOTTOM - SAFE_TOP,
          opacity: hookOp,
        }}
      >
        {/* Split tint */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" style={{ backgroundColor: CARNIVAL_RED + "33" }} />
          <div className="flex-1" style={{ backgroundColor: ROYAL_BLUE + "33" }} />
        </div>
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "50%", width: 3, backgroundColor: "rgba(255,255,255,0.12)" }}
        />

        <div
          className="relative z-10 text-center"
          style={{
            transform: `translateX(${shakeX}px) scale(${titleScale})`,
            opacity: titleOpacity,
          }}
        >
          <div
            className="font-black text-white"
            style={{ fontSize: 108, lineHeight: 1, textShadow: "0 0 60px rgba(255,255,255,0.3)" }}
          >
            CRUISE
          </div>
          <div
            className="font-black"
            style={{ fontSize: 108, lineHeight: 1, color: GOLD, textShadow: `0 0 60px ${GOLD}66` }}
          >
            WARS
          </div>
          <div
            className="font-black text-white"
            style={{ fontSize: 64, letterSpacing: "12px", marginTop: 4 }}
          >
            2026
          </div>
        </div>

        <div
          className="relative z-10 text-center mt-6"
          style={{ opacity: subtitleOp, transform: `translateY(${subtitleY}px)` }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "4px" }}>
            <span style={{ color: CARNIVAL_RED }}>CARNIVAL</span>
            <span className="text-white mx-3">vs</span>
            <span style={{ color: "#4477CC" }}>ROYAL CARIBBEAN</span>
          </div>
        </div>
      </div>

      {/* ════════ STAT CARDS ════════ */}
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="absolute"
          style={{
            top: SAFE_TOP,
            left: 0,
            right: 0,
            height: SAFE_BOTTOM - SAFE_TOP,
            opacity: sceneOp(frame, stat.startFrame, stat.endFrame),
          }}
        >
          <ComparisonComponent
            label={stat.label}
            leftValue={stat.leftValue}
            rightValue={stat.rightValue}
            leftName="CARNIVAL"
            rightName="ROYAL CARIB."
            leftColor={CARNIVAL_RED}
            rightColor={ROYAL_BLUE}
            higherIsBetter={stat.higherIsBetter}
            formatValue={stat.formatValue}
            note={stat.note}
            frame={frame}
            startFrame={stat.startFrame}
            fps={fps}
          />
        </div>
      ))}

      {/* ════════ VERDICT ════════ */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          top: SAFE_TOP,
          left: 0,
          right: 0,
          height: SAFE_BOTTOM - SAFE_TOP,
          opacity: verdictOp,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${GOLD}18 0%, transparent 65%)`,
          }}
        />
        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ gap: 28 }}
        >
          <div
            className="font-black text-white"
            style={{ fontSize: 36, letterSpacing: "8px" }}
          >
            THE VERDICT
          </div>

          <div
            className="font-black"
            style={{
              fontSize: 164,
              color: GOLD,
              lineHeight: 0.9,
              textShadow: `0 0 80px ${GOLD}88`,
              transform: `scale(${tieScale})`,
              opacity: tieOp,
            }}
          >
            2–2
          </div>

          <div
            className="font-black text-white"
            style={{ fontSize: 54, letterSpacing: "2px" }}
          >
            IT'S A TIE! 🤯
          </div>

          {/* Score chips */}
          <div
            className="flex gap-6"
            style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)` }}
          >
            <div
              className="font-black rounded-full"
              style={{
                fontSize: 30,
                color: CARNIVAL_RED,
                border: `2px solid ${CARNIVAL_RED}`,
                backgroundColor: CARNIVAL_RED + "18",
                paddingInline: 32,
                paddingBlock: 12,
              }}
            >
              CARNIVAL: 2
            </div>
            <div
              className="font-black rounded-full"
              style={{
                fontSize: 30,
                color: "#4477CC",
                border: `2px solid ${ROYAL_BLUE}`,
                backgroundColor: ROYAL_BLUE + "33",
                paddingInline: 32,
                paddingBlock: 12,
              }}
            >
              ROYAL: 2
            </div>
          </div>

          {/* CTA */}
          <div style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)` }}>
            <div
              className="font-black"
              style={{ fontSize: 46, color: GOLD, letterSpacing: "2px" }}
            >
              WHO WOULD YOU BOOK?
            </div>
            <div
              className="font-black text-white mt-2"
              style={{ fontSize: 38, letterSpacing: "3px" }}
            >
              COMMENT BELOW 👇
            </div>
          </div>
        </div>
      </div>

      {/* ════════ PROGRESS BAR ════════ */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 8, backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(to right, ${CARNIVAL_RED}, ${ROYAL_BLUE})`,
          }}
        />
      </div>
    </div>
  );
};
