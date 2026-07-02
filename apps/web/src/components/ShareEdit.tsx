// not being used anywhere
import { useEffect } from "react";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

type Props = {
  page: {
    title: string;
    content: any;
  };

  onSave: (content: any) => void;
};

const ShareEdit = ({
  page,
  onSave,
}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],

    content: page.content,

    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none outline-none min-h-[500px]",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    let timeout: ReturnType<
      typeof setTimeout
    >;

    const handleUpdate = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        onSave(
          editor.getJSON()
        );
      }, 1000);
    };

    editor.on(
      "update",
      handleUpdate
    );

    return () => {
      editor.off(
        "update",
        handleUpdate
      );

      clearTimeout(timeout);
    };
  }, [editor, onSave]);

  if (!editor) return null;

  return (
    <main className="min-h-screen bg-[#f6f3ef]">
      <div className="mx-auto max-w-4xl px-24 py-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-5xl font-bold">
            {page.title}
          </h1>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            Edit Access
          </span>
        </div>

        <EditorContent
          editor={editor}
        />
      </div>
    </main>
  );
};

export default ShareEdit;