// not being used anywhere
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  page: {
    title: string;
    content: any;
  };
};

const ShareView = ({ page }: Props) => {
  const editor = useEditor({
    editable: false,

    extensions: [StarterKit],

    content: page.content,
  });

  if (!editor) return null;

  return (
    <main className="min-h-screen bg-[#f6f3ef]">
      <div className="mx-auto max-w-4xl px-24 py-16">
        <h1 className="mb-8 text-5xl font-bold">
          {page.title}
        </h1>

        <EditorContent editor={editor} />
      </div>
    </main>
  );
};

export default ShareView;