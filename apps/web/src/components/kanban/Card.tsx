import { useState } from "react";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";
import { DropIndicator } from "./DropIndicator";
import { type CardProps } from "../../types/kanbanTypes";

export default function Card({
  title,
  id,
  column,
  handleDragStart,
  updateCard,
}: CardProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);

  return (
    <>
      <DropIndicator beforeId={id} column={column} />

      <motion.div
        layout
        layoutId={id}
        draggable={!editing}
        onDragStartCapture={(e) =>
          handleDragStart(e, {
            id,
            title: value,
            column,
          })
        }
        onDoubleClick={() => setEditing(true)}
        className="mb-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md">
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              updateCard(id, value);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateCard(id, value);
                setEditing(false);
              }

              if (e.key === "Escape") {
                setValue(title);
                setEditing(false);
              }
            }}
            className="w-full rounded bg-neutral-50 px-2 py-1 text-sm outline-none ring-2 ring-[#FFC6C6]"
          />
        ) : (
          <div className="group flex items-start justify-between gap-2">
            <p className="flex-1 cursor-grab text-sm text-neutral-700 wrap-break-word">
              {value}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="opacity-0 transition group-hover:opacity-100 hover:text-violet-600"
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}