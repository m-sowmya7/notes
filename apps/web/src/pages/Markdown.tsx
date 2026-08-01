import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../db/localDb";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
// import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { SlashCommand } from "../features/editor/extensions/SlashCommand";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";
import { syncPendingPages } from "../services/syncService";
// import { apiBaseUrl } from "../utils/runtimeConfig";
import { FileService } from "../services/file.service";
import { useLiveSession } from "../features/live/hooks/useLiveSession";
import { usePresence } from "../features/live/hooks/usePresence";
import LiveCursorOverlay from "../components/live/LiveCursorOverlay";

// const user = localStorage.getItem("userId") ?? "";

const Markdown = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isTemplatesModalOpen } = useTemplatesModal();
  const live = useLiveSession(id);
  const participants = usePresence(live.connection, live.participantName);
  const isLiveMode = live.isLive;
  const sharedPageMeta = live.document?.getMap<string>("page-meta");
  const titleRef = useRef(title);
  const liveContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  // The editor content is stored in Yjs by Tiptap's Collaboration extension.
  // Keep page metadata in that same document so every live participant sees title
  // changes immediately as well.
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


  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     ...(live
  //       ? [
  //           Collaboration.configure({ document: live.document! }),
  //           // CollaborationCursor.configure({
  //           //   provider: live.provider,
  //           //   user: participant,
  //           // }),
  //         ]
  //       : []),
  //     Placeholder.configure({
  //       placeholder:
  //         "Start Yapping and hit '/' for commands...",
  //     }),
  //     SlashCommand,
  //   ],
  //   editorProps: {
  //     attributes: {
  //       class:
  //         "prose prose-neutral max-w-none outline-none min-h-[500px]",
  //     },
  //   },
  // }, [live.document]);

  const editor = useEditor({
    extensions: [
        StarterKit.configure({
      }),
      ...(
        live.isLive && live.document
          ? [Collaboration.configure({ document: live.document })]
          : []
      ),
      Placeholder.configure({
        placeholder: "Start Yapping and hit '/' for commands...",
      }),
      SlashCommand,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none outline-none min-h-[500px]",
      },
    },
  }, [live.isLive, live.document]);
  const savePage = async () => {
    if (!editor || !id || isLiveMode) return;
    const content = editor.getJSON();

    try {
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

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id || !editor) return;

    const loadPage = async () => {
      try {
        const localPage = await db.pages.get(id);

        if (!navigator.onLine && localPage) {
          setTitle(localPage.title);
          setStarred(localPage.starred);
          editor.commands.setContent(localPage.content);
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

        const sharedTitle = sharedPageMeta?.get("title");
        if (isLiveMode && sharedPageMeta) {
          if (typeof sharedTitle === "string") {
            setTitle(sharedTitle);
          } else {
            sharedPageMeta.set("title", page.title);
            setTitle(page.title);
          }
        } else {
          setTitle(page.title);
        }
        setStarred(page.starred);

        editor.commands.setContent(page.content || {});
      }
      catch (error) {
        console.error(error);
      }
    };

    void loadPage();
  }, [id, editor, isLiveMode, sharedPageMeta]);

  useEffect(() => {
    if (isLiveMode) return;

    if (!editor || !id) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleUpdate = () => {
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        await savePage();
      }, 1000);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      clearTimeout(timeout);
    };
  }, [editor, id, isLiveMode, title, starred]);

  useEffect(() => {
    if (isLiveMode) return;

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
  }, [isLiveMode]);

  if (!editor) return null;

  return (
    <div
      ref={liveContainerRef}
      className={`w-full min-h-screen transition-all ${isTemplatesModalOpen ? "blur-sm" : ""}`}>

      <PageToolbar
        pageId={id || ""}
        title={title}
        starred={starred}
        isOnline={isOnline}
        isSyncing={isSyncing}
        isModalOpen={isTemplatesModalOpen}
        liveParticipants={participants}
      />

      <div className="max-w-4xl mx-auto px-24 py-16">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            const nextTitle = e.target.value;
            setTitle(nextTitle);
            if (isLiveMode && sharedPageMeta?.get("title") !== nextTitle) {
              sharedPageMeta?.set("title", nextTitle);
            }
          }}
          placeholder="Untitled"
          className="w-full bg-transparent border-none outline-none text-5xl font-bold text-gray-800 mb-6"
        />

        <EditorContent editor={editor} />
      </div>
      {isLiveMode && <LiveCursorOverlay live={live.connection} containerRef={liveContainerRef} />}
    </div>
  );
};

export default Markdown;
