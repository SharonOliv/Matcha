import Card from "./Card";
import type { CardData } from "../types";

interface BoardProps {
  cards: CardData[];
  size: number;
  onFlip: (id: number) => void;
  disabled: boolean;
}

export default function Board({ cards, size, onFlip, disabled }: BoardProps) {
  return (
    <div
      className="board"
      style={{ "--grid-size": size } as React.CSSProperties}
      role="group"
      aria-label="Memory match board"
    >
      {cards.map((card) => (
        <Card key={card.id} card={card} onFlip={onFlip} disabled={disabled} />
      ))}
    </div>
  );
}