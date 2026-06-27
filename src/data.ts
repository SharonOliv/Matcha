import type { Difficulty, DifficultyConfig, CardData, Theme } from "./types";
import { getThemeIcons, type ThemeIcon } from "./theme";

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: "Easy", gridSize: 4 },
  medium: { label: "Medium", gridSize: 6 },
  hard: { label: "Hard", gridSize: 8 },
};

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function cycleIcons(icons: ThemeIcon[], count: number): ThemeIcon[] {
  if (icons.length === 0) return [];
  return Array.from({ length: count }, (_, i) => icons[i % icons.length]);
}

export async function createDeck(difficulty: Difficulty, theme: Theme): Promise<CardData[]> {
  const { gridSize } = DIFFICULTIES[difficulty];
  const totalPairs = (gridSize * gridSize) / 2;

  const allIcons = await getThemeIcons(theme);
  const icons = cycleIcons(allIcons, totalPairs);

  const deck: CardData[] = icons.flatMap((icon, index) => [
    { id: index * 2, iconId: icon.id, imageUrl: icon.imageUrl, alt: icon.alt, isFlipped: false, isMatched: false },
    { id: index * 2 + 1, iconId: icon.id, imageUrl: icon.imageUrl, alt: icon.alt, isFlipped: false, isMatched: false },
  ]);

  return shuffle(deck);
}