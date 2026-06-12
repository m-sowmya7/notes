import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";

import { createRoot, type Root } from "react-dom/client";

import SlashCommandList from "../../../components/SlashCommandList";
import { slashItems } from "../commands/slashItems";

export const SlashCommand = Extension.create({
  name: "slash-command",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,

        char: "/",

        items: ({ query }) => {
          return slashItems.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },

        render() {
          let component: HTMLDivElement;
          let popup: any;
          let root: Root;
          let currentProps: any;

          function renderList() {
            root.render(
              <SlashCommandList
                items={currentProps.items}
                command={(item) => {
                  currentProps.editor
                    .chain()
                    .focus()
                    .deleteRange(currentProps.range)
                    .run();

                  item.command({ editor: currentProps.editor });

                  popup?.[0]?.hide();
                }}
              />
            );
          }

          return {
            onStart: (props) => {
              currentProps = props;
              component = document.createElement("div");
              root = createRoot(component);
              renderList();

              popup = tippy("body", {
                getReferenceClientRect:
                  props.clientRect as any,
                appendTo: () => document.body,
                content: component,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                showOnCreate: true,
              });
            },

            onUpdate(props) {
              currentProps = props;
              renderList();
              popup[0].setProps({
                getReferenceClientRect:
                  props.clientRect as any,
              });
            },

            onExit() {
              popup[0].destroy();
              root.unmount();
            },
          };
        },
      }),
    ];
  },
});