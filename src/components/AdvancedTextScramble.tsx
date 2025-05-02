import React, { useEffect, useRef, useState } from "react";

const GLYPHS =
  "アカサタナハマヤラワガザダバパイイチニヒミリギヂビピウクスツヌフムユルグズブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,./<>?`~";
const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const COLORS = [
  "#6fffe9",
  "#fe53bb",
  "#fff685",
  "#00ffd0",
  "#fff",
  "#ff6a00",
  "#e900ff",
];

interface TextScrambleProps {
  text: string;
  isActive: boolean;
}

interface GlitchChar {
  final: string;
  current: string;
  locked: boolean;
  color: string;
  delayMs: number;
}

export const AdvancedTextScramble: React.FC<TextScrambleProps> = ({
  text,
  isActive,
}) => {
  const [chars, setChars] = useState<GlitchChar[]>([]);
  const intervalRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // clear any running interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // build our timeline
    const baseMs = 300;
    const staggerMs = 100;
    const timeline = text.split("").map((finalChar, i) => {
      // pick an initial scramble glyph
      const pick = Math.random();
      const current = pick > 0.66
        ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        : pick > 0.33
          ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
          : ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
      return {
        final: finalChar,
        current,
        locked: !isActive,   // if not active, lock immediately
        color: COLORS[(i + Math.floor(Math.random() * COLORS.length)) % COLORS.length],
        delayMs: baseMs + i * staggerMs + Math.random() * staggerMs,
      };
    });

    setChars(timeline);

    // if animation is off, we’re done
    if (!isActive) {
      return;
    }

    // start time
    startTimeRef.current = performance.now();

    // run at a constant 20fps
    const FRAME_INTERVAL = 1000 / 20;

    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;

      setChars((prev) => {
        let anyLeft = false;
        const next = prev.map((c) => {
          if (c.locked) return c;

          // if its delay has passed, lock it into place
          if (elapsed >= c.delayMs) {
            return { ...c, current: c.final, locked: true, color: "#fff" };
          }

          anyLeft = true;
          // otherwise, pick a fresh random glyph each tick
          let newChar: string;
          const r = Math.random();
          if (r > 0.66) {
            newChar = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else if (r > 0.33) {
            newChar = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          } else {
            newChar = ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
          }

          return {
            ...c,
            current: Math.random() > 0.9 ? c.final : newChar, // rare flicker
          };
        });

        // once everyone is locked, clear out
        if (!anyLeft && intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        return next;
      });
    }, FRAME_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, isActive]);

  return (
    <span className="font-mono" style={{ display: "inline-block" }}>
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            color: c.locked ? "#fff" : c.color,
            opacity: c.locked ? 1 : 0.95,
            textShadow: c.locked
              ? "0 0 4px #0ff8, 0 0 8px #fff7"
              : "0 0 12px #fe53bb66, 0 0 16px #07ffddcc",
            transition: "color 0.12s, text-shadow 0.18s",
            fontWeight: c.locked ? 700 : 500,
            display: "inline-block",
            letterSpacing: "0.06em",
          }}
        >
          {c.current}
        </span>
      ))}
    </span>
  );
};
