import { useState, type FormEvent, type Dispatch, type SetStateAction } from "react";
import { motion } from "motion/react";
import { FiPlus } from "react-icons/fi";
import { type CardType, type ColumnType } from "../../types/kanbanTypes";

type Props = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

export default function AddCard({
  column,
  setCards,
}: Props) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: text.trim(),
        column,
      },
    ]);

    setText("");
    setAdding(false);
  };

  if (adding) {
    return (
      <motion.form layout onSubmit={handleSubmit}>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new task..."
          className="w-full rounded-xl border border-[#643843] bg-[#FFC6C6]/20 p-3 text-sm outline-none"
        />

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="text-sm text-neutral-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-[#FFC6C6] px-3 py-2 text-sm"
          >
            Add
          </button>
        </div>
      </motion.form>
    );
  }

  return (
    <button
      onClick={() => setAdding(true)}
      className="mt-2 flex items-center gap-2 text-sm text-neutral-500 hover:text-black"
    >
      <FiPlus />
      Add Card
    </button>
  );
}