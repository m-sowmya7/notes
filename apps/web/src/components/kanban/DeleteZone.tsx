import { type Dispatch, type SetStateAction, useState, type DragEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { type CardType } from "../../types/kanbanTypes";

type Props = {
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

export const DeleteZone = ({
  setCards,
}: Props) =>{
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((prev) =>
      prev.filter((card) => card.id !== cardId)
    );

    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-6 mb-6 grid h-10 place-content-center rounded-2xl border-2 border-dashed transition-all ${
        active
          ? "border-red-400 bg-red-50 text-red-500"
          : "border-neutral-300 text-neutral-400"
      }`}
    >
      <div className="flex items-center gap-2">
        <FiTrash />
        Drag & Drop to Delete
      </div>
    </div>
  );
}