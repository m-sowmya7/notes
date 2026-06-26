import { db } from "../db/localDb";

export const syncPendingPages = async () => {
   try {
      const pending = await db.pages
        .filter(page => page.pendingSync)
        .toArray();

      for (const page of pending) {
        const res = await fetch(
          `http://localhost:5000/api/pages/${page.id}`,
          {
            method: "PUT",
            // does the userId need to be passed here???
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: page.title,
              content: page.content,
            }),
          }
        );

        if (res.ok) {
          await db.pages.update(page.id, {
            pendingSync: false,
            updatedAt:new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
};