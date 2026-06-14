import { useState, useEffect } from 'react';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { SlashCommand } from "../features/editor/extensions/SlashCommand";
import PageToolbar from "../components/PageToolbar";
import { useTemplatesModal }
  from "../context/TemplatesModalContext";
const Markdown = () => {
  const [title, setTitle] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const {
    isTemplatesModalOpen,
  } = useTemplatesModal();

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      SlashCommand,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none outline-none min-h-[500px]",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className={`w-full min-h-screen transition-all ${isTemplatesModalOpen ? "blur-sm" : ""}`}>
      <PageToolbar
        title={title}
        isOnline={isOnline}
        isSyncing={false}
        isModalOpen={isTemplatesModalOpen}
      />

      <div className="max-w-4xl mx-auto px-24 py-16">
        {/* Page Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent border-none outline-none text-5xl font-bold text-gray-800 placeholder:text-gray-400 mb-6"
        />
        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Markdown;