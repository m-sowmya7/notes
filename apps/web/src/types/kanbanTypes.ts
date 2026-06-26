import { type DragEvent, type Dispatch, type SetStateAction } from "react";

export type ColumnType = "backlog" | "todo" | "doing" | "done";

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

