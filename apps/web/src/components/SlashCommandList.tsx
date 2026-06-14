import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { slashItems } from "../features/editor/commands/slashItems";

type Props = {
  items: typeof slashItems;
  command: (item: (typeof slashItems)[0]) => void;
};

export interface SlashCommandListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const SlashCommandList = forwardRef<SlashCommandListRef, Props>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
          setSelectedIndex(
            (prev) => (prev + 1) % items.length
          );
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelectedIndex(
            (prev) =>
              (prev - 1 + items.length) % items.length
          );
          return true;
        }
        if (event.key === "Enter") {
          command(items[selectedIndex]);
          return true;
        }
        return false;
      },
    }));

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
  }
);

SlashCommandList.displayName = "SlashCommandList";

export default SlashCommandList;