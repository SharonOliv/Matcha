import type { BestScore } from "../types";

interface StatsBarProps {
  moves: number;
  seconds: number;
  bestScore: BestScore | null;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function StatsBar({ moves, seconds, bestScore }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-label">🎯 Moves</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat">
        <span className="stat-label">⏱️ Time</span>
        <span className="stat-value">{formatTime(seconds)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">🏆 Best</span>
        <span className="stat-value">
          {bestScore ? `${bestScore.moves} mv / ${formatTime(bestScore.seconds)}` : "—"}
        </span>
      </div>
    </div>
  );
}