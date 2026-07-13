import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import * as Y from "yjs";
import {
  createListItem,
  normalizeListItems,
  type NormalizedListItem,
} from "../../../utils/listItems";

type Item = NormalizedListItem;

export interface ListContent {
  items: Item[];
}

interface Props {
  content: ListContent;
  editable: boolean;
  liveYdoc?: Y.Doc;
  onChange: (content: ListContent) => void;
}

export default function SharedList({
  content,
  editable,
  liveYdoc,
  onChange,
}: Props) {
  const [items, setItems] = useState<Item[]>(normalizeListItems(content?.items));

  useEffect(() => {
    if (!liveYdoc) return;

    const yItems = liveYdoc.getArray<Item>("items");

    if (yItems.length === 0 && content?.items?.length) {
      yItems.insert(0, normalizeListItems(content.items));
    }

    const syncItems = () => {
      const raw = yItems.toArray();
      const next = normalizeListItems(raw);

      if (JSON.stringify(raw) !== JSON.stringify(next)) {
        liveYdoc.transact(() => {
          yItems.delete(0, yItems.length);
          yItems.insert(0, next);
        });
        return;
      }

      setItems(next);

      if (editable) {
        onChange({ items: next });
      }
    };

    syncItems();
    yItems.observe(syncItems);

    return () => yItems.unobserve(syncItems);
  }, [content?.items, editable, liveYdoc, onChange]);

  const updateItems = (next: Item[]) => {
    if (!editable) return;

    const normalized = normalizeListItems(next);

    if (liveYdoc) {
      const yItems = liveYdoc.getArray<Item>("items");
      liveYdoc.transact(() => {
        yItems.delete(0, yItems.length);
        yItems.insert(0, normalized);
      });
      return;
    }

    setItems(normalized);
    onChange({ items: normalized });
  };

  const toggleItem = (id: string) => {
    if (!editable) return;

    updateItems(items.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      ));
  };

  return (
    <div className="space-y-3 bg-blue-100/50 p-2 rounded-xl border border-black border-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-3 items-center"
        >
          <input
            type="checkbox"
            checked={item.completed}
            disabled={!editable}
            onChange={() => toggleItem(item.id)}
          />

          <input
            value={item.text}
            readOnly={!editable}
            onChange={(event) => updateItems(items.map((value) => value.id === item.id ? { ...value, text: event.target.value } : value))}
            className={`flex-1 bg-transparent outline-none ${
              item.completed
                ? "line-through text-gray-500"
                : ""
            }`}
          />
          {editable && <button aria-label="Delete item" onClick={() => updateItems(items.filter((value) => value.id !== item.id))} className="hover:text-red-500"><Trash2 size={16} /></button>}
        </div>
      ))}
      {editable && <button onClick={() => updateItems([...items, createListItem()])} className="flex items-center gap-2 text-sm text-neutral-500"><Plus size={16} /> Add item</button>}
    </div>
  );
}
