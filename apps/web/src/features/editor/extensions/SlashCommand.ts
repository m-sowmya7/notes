import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";

import React from "react";
import ReactDOM from "react-dom/client";

import SlashCommandList from "../../../components/SlashCommandList";
import type { SlashCommandListRef } from "../../../components/SlashCommandList";
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
          let componentRef: React.RefObject<SlashCommandListRef | null>;

          const renderComponent = (props: any) => {
            root.render(
              React.createElement(SlashCommandList, {
                ref: componentRef,
                items: props.items,
                command: (item: any) => {
                  item.command({ editor: props.editor });
                  popup?.[0]?.hide();
                },
              })
            );
          };

          return {
            onStart: (props) => {
              component = document.createElement("div");
              componentRef = React.createRef<SlashCommandListRef>();
              root = ReactDOM.createRoot(component);

              renderComponent(props);

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                showOnCreate: true,
              });
            },

            onUpdate(props) {
              renderComponent(props);
              popup[0].setProps({
                getReferenceClientRect:
                  props.clientRect as any,
              });
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }
              return (
                componentRef?.current?.onKeyDown(props.event) ??
                false
              );
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