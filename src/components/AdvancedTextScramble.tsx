import React, { useEffect, useRef, useState } from "react";

const GLYPHS =
  "アカサタナハマヤラワガザダバパイキシチニヒミリギヂビピウクスツヌフムユルグズブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,./<>?`~";
const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const COLORS = [
  "#6fffe9", "#fe53bb", "#fff685", "#00ffd0", "#fff", "#ff6a00", "#e900ff",
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
  delay: number;
}

export const AdvancedTextScramble: React.FC<TextScrambleProps> = ({
  text,
  isActive,
}) => {
  // State: array of GlitchChar, tracking per-char progress
  const [chars, setChars] = useState<GlitchChar[]>([]);
  const rafRef = useRef<number>();
  const runAnim = useRef(false);

  // Anim logic only runs if actually needed
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runAnim.current = false;

    // Use full text instead of truncating
    if (!isActive) {
      setChars(
        text.split("").map((c) => ({
          final: c,
          current: c,
          locked: true,
          color: "#fff",
          delay: 0,
        }))
      );
      return;
    }

    // For each char, give a random delay (cascades left->right)
    // Increasing base and stagger values to slow down animation
    const base = 65, stagger = 45; // Increased from 50/35 to slow down animation
    const timeline = text.split("").map((c, i) => ({
      final: c,
      current:
        Math.random() > 0.6
          ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          : Math.random() > 0.4
          ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
          : ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)],
      locked: false,
      color: COLORS[(i + Math.floor(Math.random() * COLORS.length)) % COLORS.length],
      delay: base + stagger * i + Math.floor(Math.random() * stagger), // per-char lock-in
    }));

    setChars(timeline);

    // Core per-frame scramble logic
    let frame = 0;
    runAnim.current = true;
    
    const loop = () => {
      if (!runAnim.current) return;
      let finished = true;

      // Map through timeline and mutate as needed
      timeline.forEach((char) => {
        if (char.locked) return;
        // Each character "locks" after its delay
        if (frame > char.delay) {
          char.current = char.final;
          char.locked = true;
        } else {
          finished = false;
          const scramblePick = Math.random();
          char.current =
            scramblePick > 0.66
              ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              : scramblePick > 0.33
              ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
              : ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
          // rare flicker: correct char (hint at convergence)
          if (Math.random() > 0.91) char.current = char.final;
        }
      });

      setChars(timeline.map((c) => ({ ...c })));

      frame++;
      if (!finished) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // Optionally, run a finishing "post-glitch" shimmer
        setTimeout(() => {
          if (runAnim.current) {
            setChars((prev) =>
              prev.map((c) =>
                Math.random() < 0.1 && c.final !== " "
                  ? {
                      ...c,
                      current: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
                      color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    }
                  : c
              )
            );
          }
        }, 1000 / 10); // ~30 FPS
      }
    };

    // Slightly delay between frames for slower animation
    rafRef.current = setTimeout(() => {
      requestAnimationFrame(loop);
    }, 15) as unknown as number; // Add small delay between frames

    // Cleanup
    return () => {
      runAnim.current = false;
      if (rafRef.current) {
        clearTimeout(rafRef.current);
        cancelAnimationFrame(rafRef.current);
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
            // filter: c.locked
            //   ? "none"
            //   : `blur(${0.6 + Math.random() * 0.7}px) brightness(1.24)`,
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