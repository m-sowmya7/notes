import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { SlashCommand } from "../../editor/extensions/SlashCommand";
interface Props {
  content: any;
  editable: boolean;
  liveYdoc?: Y.Doc;
  onChange: (content: unknown) => void;
}

export default function SharedMarkdown({ content, editable, liveYdoc, onChange }: Props) {
  const seededLiveContent = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
      }),
      ...(liveYdoc
        ? [
            Collaboration.configure({
              document: liveYdoc,
            }),
          ]
        : []),
      Placeholder.configure({
        placeholder:
          "Start Yapping and hit '/' for commands...",
      }),
      SlashCommand,
    ],
    content: liveYdoc ? undefined : content,
    editable,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none outline-none min-h-[500px]",
      },
    },
  }, [liveYdoc]);

  useEffect(() => {
    if (!editor || !liveYdoc || seededLiveContent.current) return;

    const fragment = liveYdoc.getXmlFragment("default");
    if (fragment.length === 0 && content) {
      editor.commands.setContent(content);
    }

    seededLiveContent.current = true;
  }, [content, editor, liveYdoc]);

  return (
    <div className="border rounded-lg p-4  bg-[#b6e9c6]/30">
      <EditorContent editor={editor} />
    </div>
  );
}
