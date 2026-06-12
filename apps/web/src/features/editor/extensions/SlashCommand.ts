import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";

import React from "react";
import ReactDOM from "react-dom/client";

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
          let root: ReactDOM.Root;

          return {
            onStart: (props) => {
              component = document.createElement("div");

              root = ReactDOM.createRoot(component);

              root.render(
                React.createElement(SlashCommandList, {
                  // items: slashItems,
                  items: props.items,
                  command: (item: any) => {
                    item.command({ editor: props.editor });
                    popup?.[0]?.hide();
                  },
                })
              );

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