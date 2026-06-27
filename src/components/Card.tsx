import type { CardData } from "../types";
import { FALLBACK_ICON } from "../theme";

interface CardProps {
  card: CardData;
  onFlip: (id: number) => void;
  disabled: boolean;
}

export default function Card({ card, onFlip, disabled }: CardProps) {
  const { id, imageUrl, alt, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (disabled || isFlipped || isMatched) return;
    onFlip(id);
  };

  return (
    <button
      type="button"
      className={`card ${isFlipped || isMatched ? "is-flipped" : ""} ${
        isMatched ? "is-matched" : ""
      }`}
      onClick={handleClick}
      aria-pressed={isFlipped || isMatched}
      aria-label={isMatched ? `Matched: ${alt}` : "Hidden card"}
    >
      <div className="card-inner">
        <div className="card-face card-front" aria-hidden="true" />
        <div className="card-face card-back" aria-hidden="true">
          <img
            src={imageUrl}
            alt=""
            className="card-image"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_ICON;
            }}
          />
          {isMatched && <span className="match-sparkle" />}
        </div>
      </div>
    </button>
  );
}