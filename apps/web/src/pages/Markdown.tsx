import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { SlashCommand } from "../features/editor/extensions/SlashCommand";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal } from "../context/TemplatesModalContext";

const Markdown = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [starred, setStarred] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  const user = localStorage.getItem("userId");
  
  useEffect(() => {
    if (!id || !editor) return;

    const loadPage = async () => {
      const res = await fetch(`http://localhost:5000/api/pages/${id}`, {
        method: "GET",
        headers: {
          "x-user-id": user || "",
        }
      });

      const page = await res.json();

      setTitle(page.title);
      setStarred(page.starred);
      
      editor.commands.setContent(page.content || {});
    };

    loadPage();
  }, [id, editor]);

  useEffect(() => {
    if (!editor || !id) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleUpdate = () => {
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        try {

          await fetch(`http://localhost:5000/api/pages/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "x-user-id": user || "",
              },
              body: JSON.stringify({
                title,
                content: editor.getJSON(),
              }),
            }
          );

        } catch (error) {
          console.error(error);
        }
      }, 1000);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      clearTimeout(timeout);
    };
  }, [editor, id, title]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener( "offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!editor || !id) return;

    const save = async () => {
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
              content: editor.getJSON(),
            }),
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    const timeout = setTimeout(
      save,
      1000
    );

    return () => clearTimeout(timeout);
  }, [title, editor, id]);

  if (!editor) return null;

  return (
    <div
      className={`w-full min-h-screen transition-all ${isTemplatesModalOpen ? "blur-sm" : ""}`}>

      <PageToolbar
        pageId={id || ""}
        title={title}
        starred={starred}
        isOnline={isOnline}
        isSyncing={false}
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
