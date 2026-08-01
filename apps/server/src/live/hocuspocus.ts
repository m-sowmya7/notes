import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";

import { onAwarenessUpdate, onConnect, onDisconnect } from "./extensions/awareness";
import { onLoadDocument, onStoreDocument, saveLiveRoomToPage, storeLiveDocument } from "./extensions/persistence";
import { authorizeLiveRoom, liveRoomName } from "./rooms";
import { LiveSessionService } from "../services/liveService";

const PORT = Number(process.env.HOCUSPOCUS_PORT ?? 1234);

export const hocuspocus = new Server({
  extensions: [new Logger()],

  onConnect,

  onDisconnect,

  onAwarenessUpdate,

  onLoadDocument,

  onStoreDocument,

  onAuthenticate: async ({ documentName, token }) => {
    const room = await authorizeLiveRoom(documentName, token);
    return { liveRoom: room };
  },
});

async function saveLoadedRoom(roomId: string) {
  const document = hocuspocus.hocuspocus.documents.get(liveRoomName(roomId));

  if (document) {
    await storeLiveDocument(roomId, document);
  }

  await saveLiveRoomToPage(roomId);
}

/** Ends a room only after its final in-memory CRDT state has been persisted. */
export async function endLiveRoom(roomId: string, ownerId: string) {
  await LiveSessionService.assertOwnerCanEndLiveSession(roomId, ownerId);
  await saveLoadedRoom(roomId);
  const session = await LiveSessionService.endLiveSession(roomId);
  hocuspocus.hocuspocus.closeConnections(liveRoomName(roomId));
  return session;
}

async function expireLiveRooms() {
  const expiredRooms = await LiveSessionService.getExpiredLiveSessions();
  await Promise.all(
    expiredRooms.map(async ({ id }) => {
      await saveLoadedRoom(id);
      await LiveSessionService.endLiveSession(id);
      hocuspocus.hocuspocus.closeConnections(liveRoomName(id));
    }),
  );
}

export async function startHocuspocusServer() {
  try {
    await hocuspocus.listen(PORT);

    // Expiration is enforced even while clients stay connected. A 60-second
    // sweep bounds the delay without scheduling one timer per live room.
    void expireLiveRooms();
    const expiryTimer = setInterval(() => void expireLiveRooms(), 60_000);
    expiryTimer.unref();

    console.log(`🚀 Hocuspocus listening on ws://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to start Hocuspocus server");
    console.error(error);
    process.exit(1);
  }
}
