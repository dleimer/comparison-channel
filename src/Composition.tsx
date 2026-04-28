import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ComparisonComponent } from "./ComparisonComponent";
import "../index.css";

const CARNIVAL_RED = "#CC0000";
const ROYAL_BLUE = "#003087";
const GOLD = "#FFD700";
const TOTAL_FRAMES = 1740;

// Fade a scene in and out
const sceneOp = (frame: number, s: number, e: number, fade = 14): number =>
  interpolate(frame, [s, s + fade, e - fade, e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const STATS = [
  {
    label: "REVENUE",
    leftValue: 26.2,
    rightValue: 17.4,
    leftDisplay: "$26.2B",
    rightDisplay: "$17.4B",
    higherIsBetter: true,
    startFrame: 92,
  },
  {
    label: "PROFIT MARGIN",
    leftValue: 11,
    rightValue: 24,
    leftDisplay: "11%",
    rightDisplay: "24%",
    higherIsBetter: true,
    startFrame: 407,
  },
  {
    label: "AVG 7-DAY FARE",
    leftValue: 709,
    rightValue: 1471,
    leftDisplay: "$709",
    rightDisplay: "$1,471",
    higherIsBetter: false,
    startFrame: 724,
  },
  {
    label: "CUSTOMER RATING",
    leftValue: 77,
    rightValue: 85,
    leftDisplay: "77%",
    rightDisplay: "85%",
    higherIsBetter: true,
    startFrame: 1041,
  },
];

// Stat scene end frames (each stat is 315f wide, with 2f beat gap)
const statEnd = (i: number) => STATS[i].startFrame + 315;

export const CruiseWars: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const SAFE_TOP = height * 0.15;     // 288px
  const SAFE_BOTTOM = height * 0.85;  // 1632px

  // ── Progress bar ───────────────────────────────────────────────────────
  const progress = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── HOOK (0–90) ────────────────────────────────────────────────────────
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

  // Shake decays after the pop
  const shakeEnvelope = interpolate(frame, [6, 12, 30, 60, 90], [0, 1, 0.7, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 4.2) * 22 * shakeEnvelope;

  const subtitleSlide = interpolate(frame, [18, 36], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOp = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── VIBE (1350–1590) ────────────────────────────────────────────────────
  const vibeOp = sceneOp(frame, 1350, 1590);

  const vibeLeftSpring = spring({
    frame: frame - 1368,
    fps,
    config: { damping: 16, stiffness: 190 },
    durationInFrames: 30,
  });
  const vibeRightSpring = spring({
    frame: frame - 1388,
    fps,
    config: { damping: 16, stiffness: 190 },
    durationInFrames: 30,
  });
  const vibeLeftX = interpolate(vibeLeftSpring, [0, 1], [-600, 0]);
  const vibeRightX = interpolate(vibeRightSpring, [0, 1], [600, 0]);

  const vibeLabelOp = interpolate(frame, [1360, 1376], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vibeLabelY = interpolate(frame, [1360, 1376], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── VERDICT (1590–1740) ────────────────────────────────────────────────
  const verdictOp = sceneOp(frame, 1590, 1740, 16);

  const tieSpring = spring({
    frame: frame - 1610,
    fps,
    config: { damping: 8, stiffness: 290, mass: 1.1 },
    durationInFrames: 34,
  });
  const tieScale = interpolate(tieSpring, [0, 1], [0.2, 1.0]);
  const tieOpacity = interpolate(tieSpring, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOp = interpolate(frame, [1650, 1668], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [1650, 1668], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="relative overflow-hidden"
      style={{ width, height, backgroundColor: "#0A0A0F", fontFamily: "'Arial Black', Arial, sans-serif" }}
    >
      {/* ── Background gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 30%, #0C1020 0%, #0A0A0F 70%)",
        }}
      />

      {/* ════════ HOOK ════════ */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: hookOp, top: SAFE_TOP, height: SAFE_BOTTOM - SAFE_TOP }}
      >
        {/* Split screen bg */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" style={{ backgroundColor: CARNIVAL_RED + "33" }} />
          <div className="flex-1" style={{ backgroundColor: ROYAL_BLUE + "33" }} />
        </div>
        {/* Center divider */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "50%", width: 3, backgroundColor: "rgba(255,255,255,0.15)" }}
        />

        <div
          className="relative text-center z-10"
          style={{
            transform: `translateX(${shakeX}px) scale(${titleScale})`,
            opacity: titleOpacity,
          }}
        >
          <div
            className="font-black text-white tracking-tight"
            style={{ fontSize: 108, lineHeight: 1, textShadow: "0 0 60px rgba(255,255,255,0.3)" }}
          >
            CRUISE
          </div>
          <div
            className="font-black tracking-tight"
            style={{ fontSize: 108, lineHeight: 1, color: GOLD, textShadow: `0 0 60px ${GOLD}66` }}
          >
            WARS
          </div>
          <div
            className="font-black text-white tracking-widest"
            style={{ fontSize: 64, letterSpacing: "12px", marginTop: 4 }}
          >
            2026
          </div>
        </div>

        <div
          className="relative z-10 text-center mt-6"
          style={{ opacity: subtitleOp, transform: `translateY(${subtitleSlide}px)` }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "4px" }}>
            <span style={{ color: CARNIVAL_RED }}>CARNIVAL</span>
            <span className="text-white mx-3">vs</span>
            <span style={{ color: ROYAL_BLUE + "CC" }}>ROYAL CARIBBEAN</span>
          </div>
        </div>
      </div>

      {/* ════════ STAT CARDS ════════ */}
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="absolute"
          style={{
            top: SAFE_TOP,
            left: 0,
            right: 0,
            height: SAFE_BOTTOM - SAFE_TOP,
            opacity: sceneOp(frame, stat.startFrame, statEnd(i)),
          }}
        >
          <ComparisonComponent
            label={stat.label}
            leftValue={stat.leftValue}
            rightValue={stat.rightValue}
            leftDisplay={stat.leftDisplay}
            rightDisplay={stat.rightDisplay}
            leftName="CARNIVAL"
            rightName="ROYAL"
            leftColor={CARNIVAL_RED}
            rightColor={ROYAL_BLUE}
            higherIsBetter={stat.higherIsBetter}
            frame={frame}
            startFrame={stat.startFrame}
            fps={fps}
          />
        </div>
      ))}

      {/* ════════ VIBE SEGMENT ════════ */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          top: SAFE_TOP,
          left: 0,
          right: 0,
          height: SAFE_BOTTOM - SAFE_TOP,
          opacity: vibeOp,
        }}
      >
        {/* Header */}
        <div
          className="font-black text-white text-center mt-8"
          style={{
            fontSize: 36,
            letterSpacing: "5px",
            opacity: vibeLabelOp,
            transform: `translateY(${vibeLabelY}px)`,
          }}
        >
          THE VIBE ✨
        </div>

        <div className="flex w-full mt-8" style={{ gap: 20, paddingInline: 32 }}>
          {/* Carnival card */}
          <div
            className="flex-1 flex flex-col items-center rounded-3xl p-8"
            style={{
              backgroundColor: CARNIVAL_RED + "22",
              border: `2px solid ${CARNIVAL_RED}`,
              transform: `translateX(${vibeLeftX}px)`,
            }}
          >
            <div style={{ fontSize: 72 }}>🎉</div>
            <div
              className="font-black text-center mt-3"
              style={{ fontSize: 42, color: CARNIVAL_RED, letterSpacing: "2px" }}
            >
              CARNIVAL
            </div>
            <div
              className="font-black text-white text-center mt-1"
              style={{ fontSize: 26, letterSpacing: "1px" }}
            >
              THE FUN SHIPS
            </div>
            <div className="mt-6 flex flex-col gap-4 w-full">
              {["💰 Budget-Friendly", "🎊 Party Atmosphere", "👨‍👩‍👧 Family Casual"].map((b) => (
                <div
                  key={b}
                  className="text-white font-bold text-center rounded-xl py-3"
                  style={{ fontSize: 22, backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Royal card */}
          <div
            className="flex-1 flex flex-col items-center rounded-3xl p-8"
            style={{
              backgroundColor: ROYAL_BLUE + "33",
              border: `2px solid ${ROYAL_BLUE}`,
              transform: `translateX(${vibeRightX}px)`,
            }}
          >
            <div style={{ fontSize: 72 }}>🚀</div>
            <div
              className="font-black text-center mt-3"
              style={{ fontSize: 38, color: "#5599FF", letterSpacing: "2px", lineHeight: 1.1 }}
            >
              ROYAL CARIB.
            </div>
            <div
              className="font-black text-white text-center mt-1"
              style={{ fontSize: 26, letterSpacing: "1px" }}
            >
              HIGH-TECH THRILLS
            </div>
            <div className="mt-6 flex flex-col gap-4 w-full">
              {["🛳️ Innovation Leader", "🏝️ Perfect Day CocoCay", "💎 Premium Experience"].map((b) => (
                <div
                  key={b}
                  className="text-white font-bold text-center rounded-xl py-3"
                  style={{ fontSize: 22, backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        {/* Gold glow bg */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${GOLD}18 0%, transparent 65%)`,
          }}
        />

        <div className="relative text-center z-10 flex flex-col items-center gap-6">
          <div
            className="font-black text-white tracking-widest"
            style={{ fontSize: 36, letterSpacing: "8px" }}
          >
            THE VERDICT
          </div>

          <div
            className="font-black"
            style={{
              fontSize: 160,
              color: GOLD,
              lineHeight: 0.9,
              textShadow: `0 0 80px ${GOLD}88`,
              transform: `scale(${tieScale})`,
              opacity: tieOpacity,
            }}
          >
            2-2
          </div>

          <div
            className="font-black text-white"
            style={{ fontSize: 52, letterSpacing: "2px" }}
          >
            IT'S A TIE! 🤯
          </div>

          <div
            className="flex gap-6"
            style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)` }}
          >
            <div
              className="font-black rounded-full px-8 py-3"
              style={{ fontSize: 28, color: CARNIVAL_RED, border: `2px solid ${CARNIVAL_RED}`, backgroundColor: CARNIVAL_RED + "18" }}
            >
              CARNIVAL: 2
            </div>
            <div
              className="font-black rounded-full px-8 py-3"
              style={{ fontSize: 28, color: "#5599FF", border: `2px solid ${ROYAL_BLUE}`, backgroundColor: ROYAL_BLUE + "33" }}
            >
              ROYAL: 2
            </div>
          </div>

          <div
            className="text-center"
            style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)` }}
          >
            <div
              className="font-black"
              style={{ fontSize: 44, color: GOLD, letterSpacing: "2px" }}
            >
              WHO WOULD YOU BOOK?
            </div>
            <div
              className="font-black text-white mt-2"
              style={{ fontSize: 36, letterSpacing: "3px" }}
            >
              COMMENT BELOW 👇
            </div>
          </div>
        </div>
      </div>

      {/* ════════ PROGRESS BAR (always visible) ════════ */}
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
