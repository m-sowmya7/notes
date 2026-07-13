// Tasks : 
// 1. add localdb to store the page data and sync with server when online
// 2. enable editing the card title and tasks
// 3. user should be able to add new columns and delete existing ones
// 4. make components for this, currently everything is in one file for ease of development but it should be split up
import { useEffect, useState } from "react";
import { db } from "../db/localDb";
import { useParams } from "react-router-dom";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";
import { type CardType } from "../types/kanbanTypes";
import { DeleteZone } from "../components/kanban/DeleteZone";
import { Column } from "../components/kanban/Column";
import {
  normalizeCards,
  normalizeColumns,
  type NormalizedColumn,
} from "../utils/boardItems";
import { apiBaseUrl } from "../utils/runtimeConfig";
const user = localStorage.getItem("userId") ?? "";

const Kanban = () => {
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  // const [cards, setCards] = useState<CardType[]>([]);
  const [columns, setColumns] = useState<NormalizedColumn[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { id } = useParams();
  const { isTemplatesModalOpen } = useTemplatesModal();

  const savePage = async () => {
    if (!id) return;

    try {
      const content = { columns, cards };

      if (!navigator.onLine) {
        await db.pages.put({
          id,
          title,
          starred,
          content,
          pendingSync: true,
          updatedAt: new Date().toISOString(),
        });

        return;
      }

      const res = await fetch(
        `${apiBaseUrl}/pages/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user,
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      await db.pages.put({
        id,
        title,
        starred,
        content,
        pendingSync: false,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const syncPendingPages = async () => {
    try {
      const pending = await db.pages
        .filter(page => page.pendingSync)
        .toArray();

      for (const page of pending) {
        const res = await fetch(
          `${apiBaseUrl}/pages/${page.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user,
            },
            body: JSON.stringify({
              title: page.title,
              content: page.content,
            }),
          }
        );

        if (res.ok) {
          await db.pages.update(page.id, {
            pendingSync: false,
          });
        }

        if (!res.ok) throw new Error('Failed to sync page');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadPage = async () => {
      try {
        const localPage = await db.pages.get(id);

        if (!navigator.onLine && localPage) {
          setTitle(localPage.title);
          setStarred(localPage.starred);
          const cols = normalizeColumns(localPage.content?.columns);
          setColumns(cols);
          setCards(normalizeCards(localPage.content?.cards, cols));
          return;
        }

        if (localPage && localPage.pendingSync) {
          setTitle(localPage.title);
          setStarred(localPage.starred);
          const cols = normalizeColumns(localPage.content?.columns);
          setColumns(cols);
          setCards(normalizeCards(localPage.content?.cards, cols));
          return;
        }

        const res = await fetch(`${apiBaseUrl}/pages/${id}`, {
          headers: {
            "x-user-id": user || "",
          }
        });

        const page = await res.json();

        await db.pages.put({
          id: page.id,
          title: page.title,
          starred: page.starred,
          content: page.content,
          pendingSync: false,
          updatedAt: page.updatedAt,
        });

        setTitle(page.title);
        setStarred(page.starred);
        // setCards(page.content?.cards || []);
        const cols = normalizeColumns(page.content?.columns);
        const normalizedCards = normalizeCards(
          page.content?.cards,
          cols
        );

        setColumns(cols);
        setCards(normalizedCards);
      }
      catch (error) {
        console.error("Failed to load page:", error);
      }
    };
    loadPage();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;

    const timeout = setTimeout(() => {
      void savePage();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, columns, cards, id]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      await syncPendingPages();
      setIsSyncing(false);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!navigator.onLine) return;

    const sync = async () => {
      setIsSyncing(true);
      await syncPendingPages();
      setIsSyncing(false);
    };

    void sync();
  }, []);

  return (
    <div className={`w-full min-h-screen transition-all duration-200 ${isTemplatesModalOpen ? "blur-sm pointer-events-none" : ""}`}>
      <PageToolbar
        pageId={id || ""}
        title={title}
        starred={starred}
        isOnline={isOnline}
        isSyncing={isSyncing}
        isModalOpen={isTemplatesModalOpen}
      />

      <div className="mx-auto max-w-7xl px-10 py-10">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Board"
          className="mb-10 w-full bg-transparent text-5xl font-bold outline-none placeholder:text-neutral-400"
        />

        <DeleteZone setCards={setCards} />

        <div className="flex gap-2 overflow-x-auto pb-8">
          {columns.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              column={column.id}
              cards={cards}
              setCards={setCards}
            />
          ))}

          {/* <Column
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
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
