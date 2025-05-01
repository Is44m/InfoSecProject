import React, { useCallback, useEffect, useRef, useState } from "react";

// Character sets for the animation
const GLYPHS = "アカサタナハマヤラワガザダバパイキシチニヒミリギヂビピウクスツヌフムユルグズブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,./<>?`~";
const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Colors for the text effect
const COLORS = ["#6fffe9", "#fe53bb", "#fff685", "#00ffd0", "#fff", "#ff6a00", "#e900ff"];

// Types for component props and state
interface TextScrambleProps {
  text: string;
  isActive: boolean;
}

interface CharacterConfig {
  finalChar: string;
  currentChar: string;
  finalIndex: number;
  settledAt: number | null;
}

export const AdvancedTextScramble: React.FC<TextScrambleProps> = ({ text, isActive }) => {
  // Store character configuration
  const [characters, setCharacters] = useState<CharacterConfig[]>([]);
  // Track animation state
  const animating = useRef(false);
  // Store animation frame reference
  const frameRef = useRef<number | null>(null);
  // Track whether component is mounted
  const isMounted = useRef(true);
  // Store fixed character colors (for consistent appearance)
  const colorMapRef = useRef<string[]>([]);

  // Generate a random character from our character sets
  const getRandomChar = useCallback(() => {
    const set = Math.random() > 0.5 ? GLYPHS : (Math.random() > 0.7 ? SYMBOLS : ALPHANUMERIC);
    return set[Math.floor(Math.random() * set.length)];
  }, []);

  // Initialize or reset the scramble animation
  useEffect(() => {
    // Clear any existing animation
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    // Limit text length for performance reasons
    const limitedText = text.length > 100 ? text.substring(0, 100) + "..." : text;
    
    // Ensure color map has enough colors
    if (colorMapRef.current.length < limitedText.length) {
      colorMapRef.current = Array(limitedText.length).fill(null).map(
        (_, i) => COLORS[i % COLORS.length]
      );
    }

    // If not active, just display the text directly
    if (!isActive) {
      const settled = limitedText.split('').map((char, idx) => ({
        finalChar: char,
        currentChar: char,
        finalIndex: idx,
        settledAt: 0
      }));
      setCharacters(settled);
      return;
    }

    // Initialize animation state
    const initialChars = limitedText.split('').map((char, idx) => ({
      finalChar: char,
      currentChar: getRandomChar(),
      finalIndex: idx,
      settledAt: null
    }));
    setCharacters(initialChars);
    animating.current = true;

    // Start animation with a small delay to ensure state is set
    setTimeout(() => {
      if (isMounted.current) {
        startAnimation();
      }
    }, 10);

    // Cleanup on unmount
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      animating.current = false;
    };
  }, [text, isActive, getRandomChar]);

  // The main animation function - much more efficient than previous version
  const startAnimation = useCallback(() => {
    if (!animating.current || !isMounted.current) return;
    
    const startTime = Date.now();
    const totalDuration = Math.min(1500, 400 + characters.length * 10);
    const charDuration = totalDuration * 0.8;
    
    const animate = () => {
      if (!animating.current || !isMounted.current) return;
      
      const now = Date.now();
      const elapsed = now - startTime;
      let allSettled = true;
      
      // Only update state if we're still animating
      if (elapsed < totalDuration) {
        setCharacters(prev => prev.map((config, idx) => {
          // Stagger the settling of characters
          const charStartTime = idx * (totalDuration * 0.4 / prev.length);
          const charElapsed = elapsed - charStartTime;
          
          // Character hasn't started animating yet
          if (charElapsed < 0) {
            allSettled = false;
            return config;
          }
          
          // Character is already settled
          if (config.settledAt !== null) {
            return config;
          }
          
          // Chance to settle increases with time
          const settleThreshold = Math.min(0.9, charElapsed / charDuration);
          if (Math.random() < settleThreshold) {
            return {
              ...config,
              currentChar: config.finalChar,
              settledAt: now
            };
          }
          
          // Still scrambling
          allSettled = false;
          return {
            ...config,
            currentChar: Math.random() < 0.1 ? config.finalChar : getRandomChar()
          };
        }));
        
        // Continue animation
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure all characters are settled at the end
        setCharacters(prev => prev.map(config => ({
          ...config,
          currentChar: config.finalChar,
          settledAt: config.settledAt || now
        })));
        
        animating.current = false;
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
  }, [characters.length, getRandomChar]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  return (
    <span className="font-mono" style={{ display: "inline-block" }}>
      {characters.map((config, index) => {
        const isSettled = config.settledAt !== null;
        const color = isSettled ? "#fff" : colorMapRef.current[index % colorMapRef.current.length];
        
        return (
          <span
            key={index}
            style={{
              color,
              textShadow: isSettled 
                ? "0 0 4px rgba(0, 255, 255, 0.7), 0 0 8px rgba(255, 255, 255, 0.5)"
                : "0 0 8px rgba(233, 0, 255, 0.3)",
              transition: "color 0.1s ease, text-shadow 0.2s ease",
              letterSpacing: "0.05em",
              fontWeight: isSettled ? 500 : 400,
              display: "inline-block",
            }}
          >
            {config.currentChar || " "}
          </span>
        );
      })}
    </span>
  );
};