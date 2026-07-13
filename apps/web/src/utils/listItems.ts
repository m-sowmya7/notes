export type NormalizedListItem = {
  id: string;
  text: string;
  completed: boolean;
};

type RawListItem = {
  id?: unknown;
  text?: unknown;
  completed?: unknown;
};

const uniqueId = (seen: Set<string>) => {
  let id = crypto.randomUUID();

  while (seen.has(id)) {
    id = crypto.randomUUID();
  }

  return id;
};

export const createListItem = (id = crypto.randomUUID()): NormalizedListItem => ({
  id,
  text: "",
  completed: false,
});

export const normalizeListItems = (items: unknown): NormalizedListItem[] => {
  if (!Array.isArray(items)) return [];

  const seen = new Set<string>();

  return items.map((item) => {
    const raw = item && typeof item === "object" ? (item as RawListItem) : {};
    const rawId = typeof raw.id === "string" ? raw.id : "";
    const id = rawId && !seen.has(rawId) ? rawId : uniqueId(seen);

    seen.add(id);

    return {
      id,
      text: typeof raw.text === "string" ? raw.text : "",
      completed: Boolean(raw.completed),
    };
  });
};
