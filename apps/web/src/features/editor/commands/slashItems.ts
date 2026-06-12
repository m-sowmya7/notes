import { Editor } from "@tiptap/react";

export const slashItems = [
  {
    title: "Text",
    description: "Just start writing with plain text",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().setParagraph().run();
    },
  },

  {
    title: "Heading 1",
    description: "Large section heading",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },

  {
    title: "Heading 2",
    description: "Medium section heading",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },

  {
    title: "Heading 3",
    description: "Small section heading",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },

  {
    title: "Bulleted List",
    description: "Create a simple bulleted list",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },

  {
    title: "Numbered List",
    description: "Create a numbered list",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },

  {
    title: "Quote",
    description: "Capture a quote",
    command: ({ editor }: { editor: Editor }) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },

  {
    title: "Callout",
    description: "Emphasize information",
    command: ({ editor }: { editor: Editor }) => {
      editor
        .chain()
        .focus()
        .insertContent(`
          <blockquote>
            💡 Callout
          </blockquote>
        `)
        .run();
    },
  },
];