import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { SlashCommand } from "../../editor/extensions/SlashCommand";
interface Props {
  content: any;
  editable: boolean;
  onChange: (content: unknown) => void;
}

export default function SharedMarkdown({ content, editable, onChange }: Props) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Start Yapping and hit '/' for commands...",
      }),
      SlashCommand,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none outline-none min-h-[500px]",
      },
    },
  });

  return (
    <div className="border rounded-lg p-4  bg-[#b6e9c6]/30">
      <EditorContent editor={editor} />
    </div>
  );
}
