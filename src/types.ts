export type Difficulty = "easy" | "medium" | "hard";
export type Theme = "pokemon" | "juices" | "food";
export type Stage = "theme" | "difficulty" | "loading" | "playing";

export interface DifficultyConfig {
  label: string;
  gridSize: number;
}

export interface CardData {
  id: number;
  iconId: string;
  imageUrl: string;
  alt: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface BestScore {
  moves: number;
  seconds: number;
}