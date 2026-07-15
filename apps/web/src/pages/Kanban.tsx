// Tasks : 
// user should be able to add new columns and delete existing ones
import { useCallback, useEffect, useRef, useState } from "react";
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
import { FileService } from "../services/file.service";

const Kanban = () => {
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [columns, setColumns] = useState<NormalizedColumn[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loadedPageId, setLoadedPageId] = useState<string | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const { id } = useParams();
  const { isTemplatesModalOpen } = useTemplatesModal();

  const savePage = useCallback(async (snapshot: string) => {
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
        lastSavedRef.current = snapshot;
        return;
      }

      const page = await FileService.updateFile(id, {
        title,
        content,
      });

      await db.pages.put({
        id: page.id,
        title: page.title,
        starred: page.starred,
        content: page.content,
        pendingSync: false,
        updatedAt: page.updatedAt,
      });
      lastSavedRef.current = snapshot;
    } catch (err) {
      console.error(err);
    }
  }, [cards, columns, id, starred, title]);

  const syncPendingPages = async () => {
    try {
      const pending = await db.pages
        .filter(page => page.pendingSync)
        .toArray();

      for (const page of pending) {
        await FileService.updateFile(page.id, {
          title: page.title,
          content: page.content,
        });

        await db.pages.update(page.id, {
          pendingSync: false,
        });
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
          lastSavedRef.current = JSON.stringify({
            title: localPage.title,
            starred: localPage.starred,
            content: { columns: cols, cards: normalizeCards(localPage.content?.cards, cols) },
          });
          setLoadedPageId(id);
          return;
        }

        if (localPage && localPage.pendingSync) {
          setTitle(localPage.title);
          setStarred(localPage.starred);
          const cols = normalizeColumns(localPage.content?.columns);
          setColumns(cols);
          setCards(normalizeCards(localPage.content?.cards, cols));
          lastSavedRef.current = JSON.stringify({
            title: localPage.title,
            starred: localPage.starred,
            content: { columns: cols, cards: normalizeCards(localPage.content?.cards, cols) },
          });
          setLoadedPageId(id);
          return;
        }

        const page = await FileService.getFile(id);

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
        const cols = normalizeColumns(page.content?.columns);
        const normalizedCards = normalizeCards(
          page.content?.cards,
          cols
        );

        setColumns(cols);
        setCards(normalizedCards);
        lastSavedRef.current = JSON.stringify({
          title: page.title,
          starred: page.starred,
          content: { columns: cols, cards: normalizedCards },
        });
        setLoadedPageId(id);
      }
      catch (error) {
        console.error("Failed to load page:", error);
      }
    };
    loadPage();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    if (loadedPageId !== id) return;

    const content = { columns, cards };
    const snapshot = JSON.stringify({ title, starred, content });
    if (lastSavedRef.current === snapshot) return;

    const timeout = setTimeout(() => {
      void savePage(snapshot);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [cards, columns, id, loadedPageId, savePage, starred, title]);

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
        </div>
      </div>
    </div>
  );
};

export default Kanban;
