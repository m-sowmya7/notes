import { type CardType } from "../types/kanbanTypes";

export type NormalizedColumn = {
  id: string;
  title: string;
};

type RawColumn = {
  id?: unknown;
  title?: unknown;
};

type RawCard = {
  id?: unknown;
  title?: unknown;
  column?: unknown;
};

const DEFAULT_COLUMNS: NormalizedColumn[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "Todo" },
  { id: "doing", title: "In Progress" },
  { id: "done", title: "Done" },
];

const defaultColumns = () => DEFAULT_COLUMNS.map((column) => ({ ...column }));

const uniqueId = (seen: Set<string>) => {
  let id = crypto.randomUUID();

  while (seen.has(id)) {
    id = crypto.randomUUID();
  }

  return id;
};

export const createCard = (
  column = "backlog",
  id = crypto.randomUUID()
): CardType => ({
  id,
  title: "",
  column,
});

export const createColumn = (
  title = "New Column",
  id = crypto.randomUUID()
): NormalizedColumn => ({
  id,
  title,
});

export const normalizeColumns = (
  columns: unknown
): NormalizedColumn[] => {
  if (!Array.isArray(columns) || columns.length === 0) {
    return defaultColumns();
  }

  const seen = new Set<string>();

  return columns.map((column) => {
    const raw =
      column && typeof column === "object"
        ? (column as RawColumn)
        : {};

    const rawId =
      typeof raw.id === "string"
        ? raw.id
        : "";

    const id =
      rawId && !seen.has(rawId)
        ? rawId
        : uniqueId(seen);

    seen.add(id);

    return {
      id,
      title:
        typeof raw.title === "string"
          ? raw.title
          : "Untitled",
    };
  });
};

export const normalizeCards = (
  cards: unknown,
  columns: NormalizedColumn[]
): CardType[] => {
  if (!Array.isArray(cards)) return [];

  const seen = new Set<string>();

  const validColumns = new Set(
    columns.map((c) => c.id)
  );

  return cards.map((card) => {
    const raw =
      card && typeof card === "object"
        ? (card as RawCard)
        : {};

    const rawId =
      typeof raw.id === "string"
        ? raw.id
        : "";

    const id =
      rawId && !seen.has(rawId)
        ? rawId
        : uniqueId(seen);

    seen.add(id);

    return {
      id,
      title:
        typeof raw.title === "string"
          ? raw.title
          : "",
      column:
        typeof raw.column === "string" &&
        validColumns.has(raw.column)
          ? raw.column
          : columns[0].id,
    };
  });
};
