/*
This is the bridge between

Y.Doc -> Database

Responsibilities:

Load a document from PostgreSQL
Save a document to PostgreSQL
Convert binary ↔ database

This is where Prisma belongs.

Typical flow:

User joins -> Page ID -> Find page -> Read stored Yjs state -> Create Y.Doc -> Later -> User edits -> Y.Doc changes -> Store snapshot

No websocket code here. No awareness.*/
import type { onLoadDocumentPayload, onStoreDocumentPayload } from "@hocuspocus/server";
import { PageType } from "../../generated/prisma/enums";
import * as Y from "yjs";
import { yXmlFragmentToProsemirrorJSON } from "y-prosemirror";
import { prisma } from "../../prisma/client";

type LiveRoomContext = { liveRoom?: { id?: unknown } };

function liveRoomId(context: unknown): string {
  const roomId = (context as LiveRoomContext).liveRoom?.id;
  if (typeof roomId !== "string" || roomId.length === 0) {
    throw new Error("Live room was not authorized");
  }
  return roomId;
}

/** Loads the saved binary CRDT state into Hocuspocus' document. */
export async function onLoadDocument({ context }: onLoadDocumentPayload) {
  const room = await prisma.liveRoom.findUnique({
    where: { id: liveRoomId(context) },
    select: { yjsState: true },
  });
  if (!room) throw new Error("Live room not found");

  const document = new Y.Doc();
  if (room.yjsState) Y.applyUpdate(document, room.yjsState);
  return document;
}

/** Hocuspocus debounces calls to this hook before storing a compact snapshot. */
export async function onStoreDocument({ context, document }: onStoreDocumentPayload) {
  const roomId = liveRoomId(context);

  await storeLiveDocument(roomId, document);
  await saveLiveRoomToPage(roomId);
}

export async function storeLiveDocument(roomId: string, document: Y.Doc) {
  await prisma.liveRoom.update({
    where: { id: roomId },
    data: { yjsState: Buffer.from(Y.encodeStateAsUpdate(document)) },
  });
}

/** Copies the final CRDT state into the page's existing JSON content format. */
export async function saveLiveRoomToPage(roomId: string) {
  const room = await prisma.liveRoom.findUnique({
    where: { id: roomId },
    select: { yjsState: true, pageId: true, page: { select: { type: true } } },
  });
  if (!room || !room.yjsState) return;

  const document = new Y.Doc();
  Y.applyUpdate(document, room.yjsState);

  const content = (() => {
    switch (room.page.type) {
      case PageType.MARKDOWN:
        return yXmlFragmentToProsemirrorJSON(document.getXmlFragment("default"));
      case PageType.LIST:
        return {
          items: document.getMap("list-state").get("items") ?? document.getArray("items").toJSON(),
        };
      case PageType.KANBAN:
        const board = document.getMap("kanban-board");
        return {
          columns: board.get("columns") ?? document.getArray("columns").toJSON(),
          cards: board.get("cards") ?? document.getArray("cards").toJSON(),
        };
    }
  })();

  await prisma.page.update({ where: { id: room.pageId }, data: { content } });
}
