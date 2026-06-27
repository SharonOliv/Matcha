import { useState, useEffect, useCallback } from "react";
import { DIFFICULTIES, createDeck } from "./data";
import { useBestScore } from "./hooks/useBestScore";
import { useSquareSize } from "./hooks/useSquareSize";
import Board from "./components/Board";
import StatsBar from "./components/StatsBar";
import DifficultySelect from "./components/DifficultySelect";
import ThemeSelect from "./components/ThemeSelect";
import WinModal from "./components/WinModal";
import type { Difficulty, Theme, Stage, CardData } from "./types";

export default function App() {
  const [stage, setStage] = useState<Stage>("theme");
  const [theme, setTheme] = useState<Theme>("pokemon");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<CardData[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const { bestScore, saveScore } = useBestScore(theme, difficulty);
  const { ref: boardWrapperRef, size: boardSize } = useSquareSize<HTMLDivElement>();

  const gridSize = DIFFICULTIES[difficulty].gridSize;
  const totalPairs = (gridSize * gridSize) / 2;
  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startGame = useCallback(async (nextTheme: Theme, nextDifficulty: Difficulty) => {
    setLoadError(null);
    setStage("loading");
    try {
      const deck = await createDeck(nextDifficulty, nextTheme);
      setCards(deck);
      setFlippedIds([]);
      setMoves(0);
      setSeconds(0);
      setIsRunning(false);
      setIsWon(false);
      setIsNewBest(false);
      setStage("playing");
    } catch {
      setLoadError("Hmm, couldn't load this deck. Check your connection and try again.");
      setStage("loading");
    }
  }, []);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setStage("difficulty");
  };

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    startGame(theme, selectedDifficulty);
  };

  const handleFlip = (id: number) => {
    if (flippedIds.length === 2) return;
    if (!isRunning) setIsRunning(true);

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );
    setFlippedIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (flippedIds.length !== 2) return;

    setMoves((m) => m + 1);
    const [firstId, secondId] = flippedIds;
    const first = cards.find((c) => c.id === firstId);
    const second = cards.find((c) => c.id === secondId);
    if (!first || !second) return;
    const isMatch = first.iconId === second.iconId;

    const timeout = setTimeout(
      () => {
        setCards((prev) =>
          prev.map((card) => {
            if (card.id !== firstId && card.id !== secondId) return card;
            return isMatch ? { ...card, isMatched: true } : { ...card, isFlipped: false };
          })
        );
        setFlippedIds([]);
      },
      isMatch ? 500 : 800
    );

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedIds]);

  useEffect(() => {
    if (totalPairs > 0 && matchedCount === totalPairs) {
      setIsRunning(false);
      const wasBest = !bestScore || moves < bestScore.moves;
      setIsNewBest(wasBest);
      saveScore(moves, seconds);
      setIsWon(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCount, totalPairs]);

  if (stage === "theme") {
    return <ThemeSelect onSelect={handleThemeSelect} />;
  }

  if (stage === "difficulty") {
    return (
      <div className="screen">
        <h1>Matcha</h1>
        <p className="tagline">Pick your challenge level!</p>
        <DifficultySelect current={difficulty} onChange={handleDifficultySelect} />
        <button type="button" className="link-btn" onClick={() => setStage("theme")}>
          ← Change theme
        </button>
      </div>
    );
  }

  if (stage === "loading") {
    return (
      <div className="screen">
        <h1>Matcha</h1>
        {loadError ? (
          <>
            <p className="tagline">{loadError}</p>
            <button
              type="button"
              className="play-again-btn"
              onClick={() => startGame(theme, difficulty)}
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <div className="spinner" aria-hidden="true" />
            <p className="tagline">Shuffling your cards…</p>
          </>
        )}
        <button type="button" className="link-btn" onClick={() => setStage("theme")}>
          ← Change theme
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Matcha</h1>
      </header>

      <div className="top-controls">
        <StatsBar moves={moves} seconds={seconds} bestScore={bestScore} />
        <button type="button" className="link-btn" onClick={() => setStage("theme")}>
          ← New game
        </button>
      </div>

      <div className="board-wrapper" ref={boardWrapperRef}>
        <div className="board-square" style={{ width: boardSize, height: boardSize }}>
          <Board
            cards={cards}
            size={gridSize}
            onFlip={handleFlip}
            disabled={flippedIds.length === 2}
          />
        </div>
      </div>

      {isWon && (
        <WinModal
          moves={moves}
          seconds={seconds}
          isNewBest={isNewBest}
          onPlayAgain={() => startGame(theme, difficulty)}
        />
      )}
    </div>
  );
}