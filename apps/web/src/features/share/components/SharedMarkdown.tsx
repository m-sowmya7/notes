import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { Content } from "@tiptap/core";
import { useEffect } from "react";

export default function SharedMarkdown({ content, editable, onChange }: { content: unknown; editable: boolean; onChange: (content: unknown) => void }) {
  const editor = useEditor({ extensions: [StarterKit], content: content as Content, editable, onUpdate: ({ editor: current }) => onChange(current.getJSON()) });
  useEffect(() => { if (editor && !editor.isFocused) editor.commands.setContent(content as Content); }, [content, editor]);
  return <EditorContent editor={editor} />;
}
