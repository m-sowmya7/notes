import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import * as Y from "yjs";

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
  liveYdoc?: Y.Doc;
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
  liveYdoc,
  onChange,
}: Props) {
  const [cards, setCards] = useState<Card[]>(content?.cards || []);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (liveYdoc) return;
    setCards(content?.cards || []);
  }, [content, liveYdoc]);

  useEffect(() => {
    if (!liveYdoc) return;

    const yCards = liveYdoc.getArray<Card>("cards");

    if (yCards.length === 0 && content?.cards?.length) {
      yCards.insert(0, content.cards);
    }

    const syncCards = () => {
      const next = yCards.toArray();
      setCards(next);

      if (editable) {
        onChange({ cards: next });
      }
    };

    syncCards();
    yCards.observe(syncCards);

    return () => yCards.unobserve(syncCards);
  }, [content?.cards, editable, liveYdoc, onChange]);

  const updateCards = (next: Card[]) => {
    if (liveYdoc) {
      const yCards = liveYdoc.getArray<Card>("cards");
      liveYdoc.transact(() => {
        yCards.delete(0, yCards.length);
        yCards.insert(0, next);
      });
      return;
    }

    setCards(next);

    if (editable) {
      onChange({ cards: next });
    }
  };

  const handleDrop = (columnId: ColumnType) => {
    if (!editable || !draggedCard) return;

    const updatedCards = cards.map((card) =>
      card.id === draggedCard.id
        ? {
          ...card,
          column: columnId,
        }
        : card
    );

    updateCards(updatedCards);
    setDraggedCard(null);
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          onDragOver={(e) => {
            if (editable) e.preventDefault();
          }}
          onDrop={() => handleDrop(column.id)}
          className="min-w-[280px] rounded-xl bg-red-100/50 p-4 border border-black border-1"
        >
          <h2 className="mb-4 font-semibold text-gray-800">
            {column.title}
          </h2>

          <div className="space-y-3">
            {cards
              .filter((card) => card.column === column.id)
              .map((card) => (
                <div
                  key={card.id}
                  draggable={editable}
                  onDragStart={() => setDraggedCard(card)}
                  onDragEnd={() => setDraggedCard(null)}
                  className={`rounded-md bg-white p-3 shadow-sm border-1 ${editable
                      ? "cursor-move hover:shadow-md"
                      : ""
                    }`}
                >
                  {/* <input
                    value={card.title}
                    readOnly={!editable}
                    onChange={(e) =>
                      updateCards(
                        cards.map((c) =>
                          c.id === card.id
                            ? {
                                ...c,
                                title: e.target.value,
                              }
                            : c
                        )
                      )
                    }
                    placeholder="Untitled Card"
                    className="w-full bg-transparent outline-none"
                  />

                  {editable && (
                    <button
                      aria-label="Delete card"
                      onClick={() =>
                        updateCards(
                          cards.filter(
                            (c) => c.id !== card.id
                          )
                        )
                      }
                      className="mt-2 text-gray-500 transition hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  )} */}
                  <div className="flex items-center gap-2">
                    <input
                      value={card.title}
                      readOnly={!editable}
                      onChange={(e) =>
                        updateCards(
                          cards.map((c) =>
                            c.id === card.id
                              ? {
                                ...c,
                                title: e.target.value,
                              }
                              : c
                          )
                        )
                      }
                      placeholder="Untitled Card"
                      className={`flex-1 bg-transparent outline-none ${editable ? "cursor-text" : ""
                        }`}
                    />

                    {editable && (
                      <button
                        aria-label="Delete card"
                        onClick={() =>
                          updateCards(cards.filter((c) => c.id !== card.id))
                        }
                        className="shrink-0 text-gray-500 transition hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {editable && (
            <button
              onClick={() =>
                updateCards([
                  ...cards,
                  {
                    id: crypto.randomUUID(),
                    title: "",
                    column: column.id,
                  },
                ])
              }
              className="mt-4 flex items-center gap-1 text-sm text-black">
              <Plus size={15} />
              Add Card
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
