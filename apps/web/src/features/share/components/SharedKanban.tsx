import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type ColumnType = "backlog" | "todo" | "doing" | "done";

interface Card {
  id: string;
  title: string;
  column: ColumnType;
}

export interface KanbanContent {
  cards: Card[];
}

interface Props {
  content: KanbanContent;
  editable: boolean;
  onChange: (content: KanbanContent) => void;
}

const columns: Array<{ id: ColumnType; title: string }> = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "Todo" },
  { id: "doing", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function SharedKanban({
  content,
  editable,
  onChange,
}: Props) {
  const [cards, setCards] = useState(content?.cards || []);
  useEffect(() => setCards(content?.cards || []), [content]);

  const updateCards = (next: Card[]) => {
    if (!editable) return;
    setCards(next);
    onChange({ cards: next });
  };

  return (
    <div className="flex gap-5 overflow-auto">
      {columns.map((column) => (
        <div
          key={column.id}
          className="bg-gray-100 rounded-lg p-4 min-w-70"
        >
          <h2 className="font-semibold mb-4">
            {column.title}
          </h2>

          <div className="space-y-3">
            {cards.filter((card) => card.column === column.id).map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-md p-3 shadow-sm"
              >
                <input value={card.title} readOnly={!editable} onChange={(event) => updateCards(cards.map((value) => value.id === card.id ? { ...value, title: event.target.value } : value))} className="w-full bg-transparent outline-none" />
                {editable && <button aria-label="Delete card" onClick={() => updateCards(cards.filter((value) => value.id !== card.id))} className="mt-2 hover:text-red-500"><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>

          {editable && (
            <button onClick={() => updateCards([...cards, { id: crypto.randomUUID(), title: "New card", column: column.id }])} className="mt-4 flex items-center gap-1 text-sm text-blue-500">
              <Plus size={15} /> Add Card
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
