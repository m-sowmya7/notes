import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  content: any;
  editable: boolean;
  onChange: (content: unknown) => void;
}

export default function SharedMarkdown({
  content,
  editable,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  return (
    <div className="border rounded-lg p-4">
      <EditorContent editor={editor} />
    </div>
  );
}
