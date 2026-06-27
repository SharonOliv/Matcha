import { DIFFICULTIES } from "../data";
import type { Difficulty } from "../types";

interface DifficultySelectProps {
  current: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export default function DifficultySelect({ current, onChange }: DifficultySelectProps) {
  const entries = Object.entries(DIFFICULTIES) as [Difficulty, { label: string }][];

  return (
    <div className="difficulty-select" role="radiogroup" aria-label="Select difficulty">
      {entries.map(([key, { label }]) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={current === key}
          data-difficulty={key}
          className={`difficulty-btn ${current === key ? "is-active" : ""}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}