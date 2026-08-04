import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";
import { useParams } from "react-router-dom";
import { db } from "../db/localDb";
import {
  createListItem,
  normalizeListItems,
  type NormalizedListItem,
} from "../utils/listItems";
import { FileService } from "../services/file.service";
import { useLiveSession } from "../features/live/hooks/useLiveSession";
import { usePresence } from "../features/live/hooks/usePresence";
import LiveCursorOverlay from "../components/live/LiveCursorOverlay";

type ListItem = NormalizedListItem;

const List = () => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const liveContainerRef = useRef<HTMLDivElement>(null);
  const { isTemplatesModalOpen } = useTemplatesModal();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadedPageId, setLoadedPageId] = useState<string | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const liveStateHydratedRef = useRef(false);
  const live = useLiveSession(id);
  const participants = usePresence(live.connection, live.participantName);

  const [items, setItems] = useState<ListItem[]>([createListItem()]);
  const isLiveMode = live.isLive;
  const sharedPageMeta = live.document?.getMap<string>("page-meta");
  const titleRef = useRef(title);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    if (!isLiveMode || !sharedPageMeta) return;

    const applySharedTitle = () => {
      const nextTitle = sharedPageMeta.get("title");
      if (typeof nextTitle === "string" && nextTitle !== titleRef.current) {
        setTitle(nextTitle);
      }
    };

    sharedPageMeta.observe(applySharedTitle);
    applySharedTitle();
    return () => sharedPageMeta.unobserve(applySharedTitle);
  }, [isLiveMode, sharedPageMeta]);

  const setInitialTitle = useCallback((initialTitle: string) => {
    if (!isLiveMode || !sharedPageMeta) {
      setTitle(initialTitle);
      return;
    }

    const existingTitle = sharedPageMeta.get("title");
    if (typeof existingTitle === "string") {
      setTitle(existingTitle);
    } else {
      sharedPageMeta.set("title", initialTitle);
      setTitle(initialTitle);
    }
  }, [isLiveMode, sharedPageMeta]);

  const savePage = useCallback(async (snapshot: string) => {
    if (!id) return;

    try {
      const content = { items: normalizeListItems(items) };

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
    } catch (error) {
      console.error(error);
    }
  }, [id, items, isLiveMode, starred, title]);

  const syncPendingPages = async () => {
    try {
      const pending = await db.pages
        .filter((page) => page.pendingSync)
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;

    // Invitees are authorized through the live-session token, not the owner's
    // private page API. The list state will arrive through Yjs below.
    if (isLiveMode && live.isInvitee) return;

    const loadPage = async () => {
      try {
        const localPage = await db.pages.get(id);

        if (!navigator.onLine && localPage) {
          setInitialTitle(localPage.title);
          setStarred(localPage.starred);
          setItems(normalizeListItems(localPage.content.items));
          lastSavedRef.current = JSON.stringify({
            title: localPage.title,
            starred: localPage.starred,
            content: { items: normalizeListItems(localPage.content.items) },
          });
          setLoadedPageId(id);
          return;
        }

        if (localPage && localPage.pendingSync) {
          setInitialTitle(localPage.title);
          setStarred(localPage.starred);
          setItems(normalizeListItems(localPage.content.items));
          lastSavedRef.current = JSON.stringify({
            title: localPage.title,
            starred: localPage.starred,
            content: { items: normalizeListItems(localPage.content.items) },
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

        setInitialTitle(page.title);
        setStarred(page.starred);
        const normalizedItems = normalizeListItems(page.content.items);
        setItems(normalizedItems);
        lastSavedRef.current = JSON.stringify({
          title: page.title,
          starred: page.starred,
          content: { items: normalizedItems },
        });
        setLoadedPageId(id);
      } catch (error) {
        console.error(error);
      }
    };

    void loadPage();
  }, [id, isLiveMode, setInitialTitle]);

  useEffect(() => {
    if (!id || loadedPageId !== id || isLiveMode) return;

    const content = { items: normalizeListItems(items) };
    const snapshot = JSON.stringify({ title, starred, content });
    if (lastSavedRef.current === snapshot) return;

    const timeout = setTimeout(() => {
      void savePage(snapshot);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [id, items, isLiveMode, loadedPageId, savePage, starred, title]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      await syncPendingPages();
      setIsSyncing(false);
    };

    const handleOffline = () => { setIsOnline(false); };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isLiveMode) return;
    if (!navigator.onLine) return;

    const sync = async () => {
      setIsSyncing(true);
      await syncPendingPages();
      setIsSyncing(false);
    };

    void sync();
  }, [isLiveMode]);

  // A map value is an atomic list snapshot. Whole-array delete/insert updates
  // from separate clients merge into duplicate items in Yjs.
  useEffect(() => {
    if (!isLiveMode || !live.document) return;

    const yList = live.document.getMap<unknown>("list-state");
    liveStateHydratedRef.current = false;
    const syncFromDocument = () => {
      const rawItems = yList.get("items") ?? live.document!.getArray("items").toArray();
      const next = normalizeListItems(rawItems);
      setItems((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
    };

    syncFromDocument();
    queueMicrotask(() => { liveStateHydratedRef.current = true; });
    yList.observe(syncFromDocument);
    return () => yList.unobserve(syncFromDocument);
  }, [isLiveMode, live.document]);

  useEffect(() => {
    if (!isLiveMode || !live.document || !liveStateHydratedRef.current) return;

    const yList = live.document.getMap<unknown>("list-state");
    const next = normalizeListItems(items);
    if (JSON.stringify(yList.get("items")) === JSON.stringify(next)) return;

    live.document.transact(() => {
      yList.set("items", next);
    });
  }, [isLiveMode, items, live.document]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newId = crypto.randomUUID();
      setItems((prev) => {
        const copy = [...prev];
        copy.splice(index + 1, 0, createListItem(newId));
        return copy;
      });

      setTimeout(() => {
        inputRefs.current[newId]?.focus();
      }, 0);
    }
  };

  const addItem = () => {
    const newId = crypto.randomUUID();

    setItems((prev) => [
      ...prev,
      createListItem(newId),
    ]);

    setTimeout(() => {
      inputRefs.current[newId]?.focus();
    }, 0);
  };

  const updateItem = (id: string, text: string) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, text } : item)
    );
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div ref={liveContainerRef} className={`w-full min-h-screen transition-all duration-200 ${isTemplatesModalOpen ? "blur-sm pointer-events-none" : ""}`}>
      <PageToolbar
        pageId={id || ""}
        title={title}
        starred={starred}
        isOnline={isOnline}
        isSyncing={isSyncing}
        isModalOpen={isTemplatesModalOpen}
        liveParticipants={participants}
      />

      <div className="mx-auto max-w-3xl px-8 py-10">
        <input
          value={title}
          onChange={(e) => {
            const nextTitle = e.target.value;
            setTitle(nextTitle);
            if (isLiveMode && sharedPageMeta?.get("title") !== nextTitle) {
              sharedPageMeta?.set("title", nextTitle);
            }
          }}
          placeholder="Untitled List"
          className="mb-8 w-full border-none bg-transparent text-5xl font-bold text-gray-800 outline-none placeholder:text-gray-400"
        />

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-md px-2 py-1 hover:bg-neutral-100">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-4 w-4 cursor-pointer"
              />

              <input
                ref={(el) => { inputRefs.current[item.id] = el; }}
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="List item"
                className={`flex-1 bg-transparent text-lg outline-none ${item.completed ? "text-neutral-400 line-through" : "text-neutral-800"}`}
              />

              <button onClick={() => deleteItem(item.id)} className="opacity-0 transition group-hover:opacity-100 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900">
          <Plus size={16} />
          Add Item
        </button>
      </div>
      {isLiveMode && <LiveCursorOverlay live={live.connection} containerRef={liveContainerRef} />}
    </div>
  );
};

export default List;
