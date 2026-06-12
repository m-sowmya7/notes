import { useEffect, useState } from "react";
import { slashItems } from "../features/editor/commands/slashItems";

type Props = {
  items: typeof slashItems;
  command: (item: (typeof slashItems)[0]) => void;
};

const SlashCommandList = ({ items, command }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();

        setSelectedIndex(
          (prev) => (prev + 1) % items.length
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        setSelectedIndex(
          (prev) =>
            (prev - 1 + items.length) % items.length
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        command(items[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [items, selectedIndex, command]);

  return (
    <div className="w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
      {items.map((item, index) => (
        <button
          key={item.title}
          onClick={() => command(item)}
          className={`
            w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100
            ${index === selectedIndex ? "bg-gray-100" : ""}`}>
          <div className="text-sm font-medium">
            {item.title}
          </div>

          <div className="text-xs text-gray-500">
            {item.description}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SlashCommandList;