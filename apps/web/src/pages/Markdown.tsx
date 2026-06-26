import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../db/localDb";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { SlashCommand } from "../features/editor/extensions/SlashCommand";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";
import { syncPendingPages } from "../services/syncService";

const user = localStorage.getItem("userId") ?? "";

const Markdown = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isTemplatesModalOpen } = useTemplatesModal();


  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Start Yapping and hit '/' for commands...",
      }),
      SlashCommand,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none outline-none min-h-[500px]",
      },
    },
  });

  const savePage = async () => {
    if (!editor || !id) return;
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

      const res = await fetch(`http://localhost:5000/api/pages/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user,
          },
          body: JSON.stringify({
            title,
            content
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

        const res = await fetch(`http://localhost:5000/api/pages/${id}`, {
          method: "GET",
          headers: {
            "x-user-id": user || "",
          },
        });

        if (!res.ok) throw new Error();

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

        editor.commands.setContent(page.content || {});
      }
      catch (error) {
        console.error(error);
      }
    };

    void loadPage();
  }, [id, editor]);

  useEffect(() => {
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
  }, [editor, id, title, starred]);

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

  if (!editor) return null;

  return (
    <div
      className={`w-full min-h-screen transition-all ${isTemplatesModalOpen ? "blur-sm" : ""}`}>

      <PageToolbar
        pageId={id || ""}
        title={title}
        starred={starred}
        isOnline={isOnline}
        isSyncing={isSyncing}
        isModalOpen={isTemplatesModalOpen}
      />

      <div className="max-w-4xl mx-auto px-24 py-16">
        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Untitled"
          className="w-full bg-transparent border-none outline-none text-5xl font-bold text-gray-800 mb-6"
        />

        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Markdown;
