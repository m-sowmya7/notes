import { useState, type DragEvent } from "react";

import Card from "./Card";
import AddCard from "./AddCard";
import { DropIndicator } from "./DropIndicator";

import {
  type CardType,
  type ColumnProps,
} from "../../types/kanbanTypes";

export const Column = ({
  title,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  // Function to update the card content
  const updateCard = (id: string, title: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id
          ? { ...card, title }
          : card
      )
    );
  };

  const filteredCards = cards.filter((card) => card.column === column);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    ) as HTMLElement[];
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((el) => {
      el.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return {
            offset, element: child,
          };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element:
          indicators[indicators.length - 1],
      }
    );
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const { element } =
      getNearestIndicator(
        e, indicators
      );

    element.style.opacity = "1";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    const cardId = e.dataTransfer.getData("cardId");

    clearHighlights();
    setActive(false);

    const indicators = getIndicators();

    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before === cardId) return;

    let copy = [...cards];

    let card = copy.find(
      (c) => c.id === cardId
    );

    if (!card) return;

    card = { ...card, column };

    copy = copy.filter(
      (c) => c.id !== cardId
    );

    if (before === "-1") {
      copy.push(card);
    } else {
      const insertAt = copy.findIndex(
        (c) => c.id === before
      );

      copy.splice(insertAt, 0, card);
    }

    setCards(copy);
  };

  return (
    <div className="w-66.5 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-700">
          {title}
        </h3>

        <span className="text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-75 rounded-2xl border border-neutral-200 bg-white p-3 transition-all ${active ? "border-violet-400 bg-violet-50" : ""}`}>
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            {...card}
            handleDragStart={
              handleDragStart
            }
            updateCard={updateCard}
          />
        ))}

        <DropIndicator
          beforeId={null}
          column={column}
        />

        <AddCard
          column={column}
          setCards={setCards}
        />
      </div>
    </div>
  );
};