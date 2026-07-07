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
import * as Y from "yjs";

export const onLoadDocument = async () => {
    console.log("Loading document...");
    return new Y.Doc();
};

export const onStoreDocument = async () => {
    console.log("Storing document...");
};