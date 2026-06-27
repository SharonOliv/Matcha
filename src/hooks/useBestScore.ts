import { useState, useEffect, useCallback } from "react";
import type { Difficulty, Theme, BestScore } from "../types";

export function useBestScore(theme: Theme, difficulty: Difficulty) {
  const storageKey = `matcha-best-${theme}-${difficulty}`;
  const [bestScore, setBestScore] = useState<BestScore | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setBestScore(stored ? (JSON.parse(stored) as BestScore) : null);
    } catch {
      setBestScore(null);
    }
  }, [storageKey]);

  const saveScore = useCallback(
    (moves: number, seconds: number) => {
      const candidate: BestScore = { moves, seconds };
      setBestScore((prev) => {
        const isBetter =
          !prev ||
          candidate.moves < prev.moves ||
          (candidate.moves === prev.moves && candidate.seconds < prev.seconds);

        if (isBetter) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(candidate));
          } catch {
            // localStorage unavailable — fail silently
          }
          return candidate;
        }
        return prev;
      });
    },
    [storageKey]
  );

  return { bestScore, saveScore };
}