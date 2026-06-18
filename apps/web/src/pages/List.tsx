import { useState, useRef, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";
import { useParams } from "react-router-dom";

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

const List = () => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isTemplatesModalOpen } = useTemplatesModal();
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const [items, setItems] = useState<ListItem[]>([
    {
      id: crypto.randomUUID(),
      text: "",
      completed: false,
    },
  ]);


  useEffect(() => {
    if (!id) return;

    const loadPage = async () => {
      const res = await fetch(`http://localhost:5000/api/pages/${id}`);
      const page = await res.json();
      
      setTitle(page.title);
      setItems(page.content.items || []);
    };
    loadPage();
  },[id]);

  useEffect(() => {
    if(!id) return;

    const timeOut = setTimeout(async () => {
      await fetch(`http://localhost:5000/api/pages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: { items },
        }),
      });
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [title, items, id]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const newId = crypto.randomUUID();
      setItems((prev) => {
        const copy = [...prev];
        copy.splice(index + 1, 0, {
          id: newId,
          text: "",
          completed: false,
        });
        return copy;
      });

      setTimeout(() => {
        inputRefs.current[newId]?.focus();
      }, 0);
    }
  }

  const addItem = () => {
    const newId = crypto.randomUUID();

    setItems((prev) => [

      ...prev,

      {
        id: newId,
        text: "",
        completed: false,
      },
    ]);

    setTimeout(() => {
      inputRefs.current[newId]?.focus();
    }, 0);
  };


  const updateItem = (id: string, text: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    );
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`
      w-full min-h-screen transition-all duration-200
      ${isTemplatesModalOpen
          ? "blur-sm pointer-events-none"
          : ""
        }
    `}
    >
      <PageToolbar
        pageId={id || ""}
        title={title}
        isOnline={isOnline}
        isSyncing={false}
        isModalOpen={isTemplatesModalOpen}
      />

      <div className="mx-auto max-w-3xl px-8 py-10">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled List"
          className="
          mb-8
          w-full
          border-none
          bg-transparent
          text-5xl
          font-bold
          text-gray-800
          outline-none
          placeholder:text-gray-400
        "
        />

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="
              group
              flex
              items-center
              gap-3
              rounded-md
              px-2
              py-1
              hover:bg-neutral-100">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-4 w-4 cursor-pointer"
              />

              <input
                ref={(el) => {
                  inputRefs.current[item.id] = el;
                }}
                value={item.text}
                onChange={(e) =>
                  updateItem(item.id, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                placeholder="List item"
                className={`
                flex-1
                bg-transparent
                text-lg
                outline-none
                ${item.completed
                    ? "text-neutral-400 line-through"
                    : "text-neutral-800"
                  }
              `}
              />

              <button
                onClick={() => deleteItem(item.id)}
                className="
                opacity-0
                transition
                group-hover:opacity-100
                hover:text-red-500
              "
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="
          mt-4
          flex
          items-center
          gap-2
          text-sm
          text-neutral-500
          transition
          hover:text-neutral-900
        "
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>
    </div>
  );
};

export default List;