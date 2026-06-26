import Dexie, { type Table } from "dexie";

export interface OfflinePage {
  id: string;
  title: string;
  content: any;
  starred: boolean;
  pendingSync: boolean;
  updatedAt: string;
}

class NotesDB extends Dexie {
  pages!: Table<OfflinePage>;

  constructor() {
    super("NotesDB");

    this.version(1).stores({
      pages: "id,pendingSync,updatedAt",
    });
  }
}

export const db = new NotesDB();