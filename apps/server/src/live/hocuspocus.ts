import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";

import { onConnect, onDisconnect } from "./extensions/awareness";
import { onLoadDocument, onStoreDocument } from "./extensions/persistence";

const PORT = Number(process.env.HOCUSPOCUS_PORT ?? 1234);

export const hocuspocus = new Server({
  extensions: [new Logger()],

  onConnect,

  onDisconnect,

  onLoadDocument,

  onStoreDocument,
});

export async function startHocuspocusServer() {
  try {
    await hocuspocus.listen(PORT);

    console.log(`🚀 Hocuspocus listening on ws://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to start Hocuspocus server");
    console.error(error);
    process.exit(1);
  }
}
