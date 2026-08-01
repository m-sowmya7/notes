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
import { useLiveSession } from "../features/live/hooks/useLiveSession";
import { usePresence } from "../features/live/hooks/usePresence";
import LiveCursorOverlay from "../components/live/LiveCursorOverlay";

const Kanban = () => {
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [columns, setColumns] = useState<NormalizedColumn[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loadedPageId, setLoadedPageId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const liveStateHydratedRef = useRef(false);
  const liveContainerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { isTemplatesModalOpen } = useTemplatesModal();
  const live = useLiveSession(id);
  const participants = usePresence(live.connection, live.participantName);
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
  }, [cards, columns, id, isLiveMode, starred, title]);

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

    // Invitees are authorized through the live-session token, not through the
    // owner's private page API. The board state will arrive through Yjs below.
    if (isLiveMode && live.isInvitee) return;

    //   const loadPage = async () => {
    //     try {
    //       const localPage = await db.pages.get(id);

    //       if (!navigator.onLine && localPage) {
    //         setTitle(localPage.title);
    //         setStarred(localPage.starred);
    //         const cols = normalizeColumns(localPage.content?.columns);
    //         setColumns(cols);
    //         setCards(normalizeCards(localPage.content?.cards, cols));
    //         lastSavedRef.current = JSON.stringify({
    //           title: localPage.title,
    //           starred: localPage.starred,
    //           content: { columns: cols, cards: normalizeCards(localPage.content?.cards, cols) },
    //         });
    //         setLoadedPageId(id);
    //         return;
    //       }

    //       if (localPage && localPage.pendingSync) {
    //         setTitle(localPage.title);
    //         setStarred(localPage.starred);
    //         const cols = normalizeColumns(localPage.content?.columns);
    //         setColumns(cols);
    //         setCards(normalizeCards(localPage.content?.cards, cols));
    //         lastSavedRef.current = JSON.stringify({
    //           title: localPage.title,
    //           starred: localPage.starred,
    //           content: { columns: cols, cards: normalizeCards(localPage.content?.cards, cols) },
    //         });
    //         setLoadedPageId(id);
    //         return;
    //       }

    //       const page = await FileService.getFile(id);

    //       await db.pages.put({
    //         id: page.id,
    //         title: page.title,
    //         starred: page.starred,
    //         content: page.content,
    //         pendingSync: false,
    //         updatedAt: page.updatedAt,
    //       });

    //       setTitle(page.title);
    //       setStarred(page.starred);
    //       const cols = normalizeColumns(page.content?.columns);
    //       const normalizedCards = normalizeCards(
    //         page.content?.cards,
    //         cols
    //       );

    //       setColumns(cols);
    //       setCards(normalizedCards);
    //       lastSavedRef.current = JSON.stringify({
    //         title: page.title,
    //         starred: page.starred,
    //         content: { columns: cols, cards: normalizedCards },
    //       });
    //       setLoadedPageId(id);
    //     }
    //     catch (error) {
    //       console.error("Failed to load page:", error);
    //     }
    //   };
    //   loadPage();
    // }, [id, isLiveMode]);

    const loadPage = async () => {
      let localPage = await db.pages.get(id);
      setLoadError(null);

      const applyPage = (page: typeof localPage) => {
        if (!page) return;

        const cols = normalizeColumns(page.content?.columns);
        const normalizedCards = normalizeCards(page.content?.cards, cols);

        setInitialTitle(page.title);
        setStarred(page.starred);
        setColumns(cols);
        lastSavedRef.current = JSON.stringify({
          title: page.title,
          starred: page.starred,
          content: { columns: cols, cards: normalizedCards },
        });
        setCards(normalizedCards);
        setLoadedPageId(id);
      };

      try {
        if (!navigator.onLine && localPage) {
          applyPage(localPage);
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

        applyPage(page); // This is currently missing.
      } catch (error) {
        if (localPage) {
          applyPage(localPage);
          return;
        }

        if ((error as { status?: number }).status === 404) {
          setLoadError("This board no longer exists or you no longer have access to it.");
          return;
        }

        console.error("Failed to load page:", error);
        setLoadError("Unable to load this board. Please try again.");
      }
    };
    void loadPage();
  }, [id, isLiveMode, setInitialTitle]);

  // Store a complete board snapshot in a Y.Map. Replacing whole Y.Arrays from
  // multiple clients is not safe: concurrent delete/insert operations merge
  // and retain both inserts, producing duplicate columns after reload.
  useEffect(() => {
    if (!isLiveMode || !live.document) return;

    const yBoard = live.document.getMap<unknown>("kanban-board");
    liveStateHydratedRef.current = false;
    const syncFromDocument = () => {
      // The array fallback keeps sessions created before this change readable.
      const rawColumns = yBoard.get("columns") ?? live.document!.getArray("columns").toArray();
      const rawCards = yBoard.get("cards") ?? live.document!.getArray("cards").toArray();
      const nextColumns = normalizeColumns(rawColumns);
      const nextCards = normalizeCards(rawCards, nextColumns);

      setColumns((current) =>
        JSON.stringify(current) === JSON.stringify(nextColumns) ? current : nextColumns
      );
      setCards((current) =>
        JSON.stringify(current) === JSON.stringify(nextCards) ? current : nextCards
      );
    };

    syncFromDocument();
    queueMicrotask(() => { liveStateHydratedRef.current = true; });
    yBoard.observe(syncFromDocument);
    return () => yBoard.unobserve(syncFromDocument);
  }, [isLiveMode, live.document]);

  useEffect(() => {
    if (!isLiveMode || !live.document || !liveStateHydratedRef.current) return;

    const yBoard = live.document.getMap<unknown>("kanban-board");
    const nextColumns = normalizeColumns(columns);
    const nextCards = normalizeCards(cards, nextColumns);

    if (
      JSON.stringify(yBoard.get("columns")) === JSON.stringify(nextColumns) &&
      JSON.stringify(yBoard.get("cards")) === JSON.stringify(nextCards)
    ) return;

    live.document.transact(() => {
      yBoard.set("columns", nextColumns);
      yBoard.set("cards", nextCards);
    });
  }, [cards, columns, isLiveMode, live.document]);

  useEffect(() => {
    if (!id || isLiveMode) return;

    if (loadedPageId !== id) return;

    const content = { columns, cards };
    const snapshot = JSON.stringify({ title, starred, content });
    if (lastSavedRef.current === snapshot) return;

    const timeout = setTimeout(() => {
      void savePage(snapshot);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [cards, columns, id, isLiveMode, loadedPageId, savePage, starred, title]);

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
    if (isLiveMode) return;
    if (!navigator.onLine) return;

    const sync = async () => {
      setIsSyncing(true);
      await syncPendingPages();
      setIsSyncing(false);
    };

    void sync();
  }, [isLiveMode]);

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

      <div className="mx-auto max-w-7xl px-10 py-10">
        {loadError ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
            {loadError}
          </p>
        ) : (
          <>
            <input
              value={title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setTitle(nextTitle);
                if (isLiveMode && sharedPageMeta?.get("title") !== nextTitle) {
                  sharedPageMeta?.set("title", nextTitle);
                }
              }}
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
          </>
        )}
      </div>
      {isLiveMode && <LiveCursorOverlay live={live.connection} containerRef={liveContainerRef} />}
    </div>
  );
};

export default Kanban;
