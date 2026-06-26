// Tasks : 
// 2. enable editing the card title and tasks
// 3. user should be able to add new columns and delete existing ones
// 4. make components for this, currently everything is in one file for ease of development but it should be split up
import { type Dispatch, type SetStateAction, useEffect, useState, type DragEvent, type FormEvent } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";

type ColumnType = "backlog" | "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
};

const Kanban = () => {
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { id } = useParams();
  const { isTemplatesModalOpen } = useTemplatesModal();
  
  const user = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) return;

    const loadPage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pages/${id}`, {
          headers: {
            "x-user-id": user || "",
          }
        });

        const page = await res.json();

        setTitle(page.title);
        setStarred(page.starred);
        setCards(page.content?.cards || []);
      }
      catch (error) {
        console.error("Failed to load page:", error);
      }
    };
    loadPage();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const timeout = setTimeout(async () => {
      try {
        await fetch(
          `http://localhost:5000/api/pages/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user || "",
            },
            body: JSON.stringify({
              title,
              content: {
                cards,
              },
            }),
          }
        );
      } catch (error) {
        console.error(error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, cards, id]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`
        w-full min-h-screen transition-all duration-200
        ${isTemplatesModalOpen
          ? "blur-sm pointer-events-none"
          : ""
        }`}>
      <PageToolbar
        pageId={id || ""}
        title={title}
        starred={starred}
        isOnline={isOnline}
        isSyncing={false}
        isModalOpen={isTemplatesModalOpen}
      />

      <div className="mx-auto max-w-7xl px-10 py-10">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Board"
          className="
            mb-10
            w-full
            bg-transparent
            text-5xl
            font-bold
            outline-none
            placeholder:text-neutral-400
          "
        />
        <DeleteZone setCards={setCards} />

        <div className="flex gap-2 overflow-x-auto pb-8">
          <Column
            title="Backlog"
            column="backlog"
            cards={cards}
            setCards={setCards}
          />

          <Column
            title="Todo"
            column="todo"
            cards={cards}
            setCards={setCards}
          />

          <Column
            title="In Progress"
            column="doing"
            cards={cards}
            setCards={setCards}
          />

          <Column
            title="Done"
            column="done"
            cards={cards}
            setCards={setCards}
          />

        </div>
      </div>
    </div>
  );
};

type ColumnProps = {
  title: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const Column = ({
  title,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const filteredCards = cards.filter(
    (card) => card.column === column
  );

  const handleDragStart = (
    e: DragEvent,
    card: CardType
  ) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    ) as HTMLElement[];
  };

  const clearHighlights = (
    els?: HTMLElement[]
  ) => {
    const indicators = els || getIndicators();

    indicators.forEach((el) => {
      el.style.opacity = "0";
    });
  };

  const getNearestIndicator = (
    e: DragEvent,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (
          offset < 0 &&
          offset > closest.offset
        ) {
          return {
            offset,
            element: child,
          };
        }

        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element:
          indicators[indicators.length - 1],
      }
    );
  };

  const highlightIndicator = (
    e: DragEvent
  ) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const { element } =
      getNearestIndicator(
        e,
        indicators
      );

    element.style.opacity = "1";
  };

  const handleDragOver = (
    e: DragEvent
  ) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    const cardId = e.dataTransfer.getData("cardId");

    clearHighlights();
    setActive(false);

    const indicators = getIndicators();

    const { element } = getNearestIndicator( e, indicators );

    const before = element.dataset.before || "-1";

    if (before === cardId) return;

    let copy = [...cards];

    let card = copy.find(
      (c) => c.id === cardId
    );

    if (!card) return;

    card = { ...card, column };

    copy = copy.filter(
      (c) => c.id !== cardId
    );

    if (before === "-1") {
      copy.push(card);
    } else {
      const insertAt = copy.findIndex(
        (c) => c.id === before
      );

      copy.splice(insertAt, 0, card);
    }

    setCards(copy);
  };

  return (
    <div className="w-66.5 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-700">
          {title}
        </h3>

        <span className="text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          min-h-75
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-3
          transition-all
          ${active
            ? "border-violet-400 bg-violet-50"
            : ""
          }`}>
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            {...card}
            handleDragStart={
              handleDragStart
            }
          />
        ))}

        <DropIndicator
          beforeId={null}
          column={column}
        />

        <AddCard
          column={column}
          setCards={setCards}
        />
      </div>
    </div>
  );
};

type CardProps = CardType & {
  handleDragStart: (
    e: DragEvent,
    card: CardType
  ) => void;
};

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator
        beforeId={id}
        column={column}
      />

      <motion.div
        layout
        layoutId={id}
        draggable
        onDragStart={(e: any) =>
          handleDragStart(e, {
            title,
            id,
            column,
          })
        }
        className="
          mb-2
          cursor-grab
          rounded-xl
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm
          hover:shadow-md
          active:cursor-grabbing">
        <p className="text-sm text-neutral-700">
          {title}
        </p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: {
  beforeId: string | null;
  column: string;
}) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-1 h-0.5 w-full bg-[#FFC6C6] opacity-0"
    />
  );
};

const DeleteZone = ({ setCards }: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    const cardId =
      e.dataTransfer.getData("cardId");

    setCards((prev) =>
      prev.filter(
        (card) => card.id !== cardId
      )
    );

    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        mt-6 mb-6
        grid
        h-10
        w-full
        shrink-0
        place-content-center
        rounded-2xl
        border-2
        border-dashed
        transition-all
        ${active
          ? "border-red-400 bg-red-50 text-red-500"
          : "border-neutral-300 text-neutral-400"
        }`}>
      <div className="flex items-center gap-2">
        <FiTrash />
        Drag & Drop to Delete
      </div>
    </div>
  );
};

const AddCard = ({
  column,
  setCards,
}: {
  column: ColumnType;
  setCards: Dispatch<
    SetStateAction<CardType[]>
  >;
}) => {
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

  return adding ? (
    <motion.form
      layout
      onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        autoFocus
        placeholder="Add new task..."
        className="
          w-full
          rounded-xl
          border
          border-[#643843]
          bg-[#FFC6C6]/50
          p-3
          text-sm
          outline-none"
      />

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            setAdding(false)
          }
          className="text-sm text-neutral-500">
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#FFC6C6] px-3 py-2 text-sm text-brown-700">
          Add
        </button>
      </div>
    </motion.form>
  ) : (
    <motion.button
      layout
      onClick={() =>
        setAdding(true)
      }
      className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
      <FiPlus />
      Add card
    </motion.button>
  );
};

export default Kanban;