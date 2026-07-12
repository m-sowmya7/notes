import { type DragEvent, type Dispatch, type SetStateAction } from "react";

// Boards support user-defined columns, so card column IDs cannot be a fixed union.
export type ColumnType = string;

export type CardType = {
  title: string;
  id: string;
  column: ColumnType;
};

export type CardProps = CardType & {
  handleDragStart: (
    e: DragEvent,
    card: CardType
  ) => void;
  updateCard: (id: string, title: string) => void;
};

export type ColumnProps = {
  title: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

