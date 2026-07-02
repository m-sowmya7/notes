import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Item {
  id: string;
  text: string;
  completed: boolean;
}

export interface ListContent {
  items: Item[];
}

interface Props {
  content: ListContent;
  editable: boolean;
  onChange: (content: ListContent) => void;
}

export default function SharedList({
  content,
  editable,
  onChange,
}: Props) {
  const [items, setItems] = useState(content?.items || []);

  useEffect(() => setItems(content?.items || []), [content]);

  const updateItems = (next: Item[]) => {
    if (!editable) return;
    setItems(next);
    onChange({ items: next });
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
      {editable && <button onClick={() => updateItems([...items, { id: crypto.randomUUID(), text: "", completed: false }])} className="flex items-center gap-2 text-sm text-neutral-500"><Plus size={16} /> Add item</button>}
    </div>
  );
}
