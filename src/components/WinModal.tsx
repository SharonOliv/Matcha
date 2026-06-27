interface WinModalProps {
  moves: number;
  seconds: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export default function WinModal({ moves, seconds, isNewBest, onPlayAgain }: WinModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal">
        <h2 id="win-title">You Found Them All! 🎉</h2>
        <p>{moves} moves, {seconds} seconds — nice work!</p>
        {isNewBest && <p className="new-best">⭐ New best score!</p>}
        <button type="button" className="play-again-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}