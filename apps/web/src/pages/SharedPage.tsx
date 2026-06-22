// Tasks:
// 1. Obviously the ui is basic, gotta change that 
// 2. add a button to save the page (where edit access is given) to that user's profile
// 3. the changes are not being saved to the database, need to fix that, or do i need sockets for that?
// 4. serperate pages for the 3 models (markdown, list, kanban) and render the correct one based on the page type
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import ShareView from "../components/ShareView";
// import ShareEdit from "../components/ShareEdit";

// type SharedResponse = {
//   page: {
//     id: string;
//     title: string;
//     content: any;
//     type: "MARKDOWN" | "LIST" | "KANBAN";
//   };
//   access: "VIEW" | "EDIT";
// };

// const SharedPage = () => {
//   const { token } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<SharedResponse | null>(null);

//   useEffect(() => {
//     if (!token) return;

//     const loadPage = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/share-links/token/${token}`
//         );

//         if (!res.ok) {
//           throw new Error("Invalid link");
//         }

//         const result = await res.json();

//         setData(result);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPage();
//   }, [token]);

//   const saveContent = async (content: any) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/shares/${token}/content`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             content,
//           }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to save");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Invalid Share Link
//       </div>
//     );
//   }

//   return data.access === "EDIT" ? (
//     <ShareEdit
//       page={data.page}
//       onSave={saveContent}
//     />
//   ) : (
//     <ShareView
//       page={data.page}
//     />
//   );
// };

// export default SharedPage;

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SharedMarkdown from "../features/share/components/SharedMarkdown";
import SharedList, { type ListContent } from "../features/share/components/SharedList";
import SharedKanban, { type KanbanContent } from "../features/share/components/SharedKanban";

type PageType = "MARKDOWN" | "LIST" | "KANBAN";

interface SharedPageData {
  id: string;
  title: string;
  type: PageType;
  content: unknown;
}

interface SharedResponse {
  page: SharedPageData;
  access: "VIEW" | "EDIT";
}

export default function SharedPage() {
  const { token } = useParams();
  const [data, setData] = useState<SharedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!token) {
      setError("Invalid share link");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    fetch(`http://localhost:5000/api/share-links/token/${token}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("This share link is invalid or has expired.");
        return res.json() as Promise<SharedResponse>;
      })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unable to load this page.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [token]);

  const savePage = useCallback(async (changes: { title?: string; content?: unknown }) => {
    if (!token || data?.access !== "EDIT") return;
    setSaveState("saving");
    try {
      const res = await fetch(`http://localhost:5000/api/share-links/token/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      setSaveState("saved");
    } catch (err) {
      console.error(err);
      setSaveState("error");
    }
  }, [data?.access, token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        {error || "Page not found"}
      </div>
    );
  }

  const editable = data.access === "EDIT";
  const { page } = data;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-8 py-10">
      <div className="mb-8 flex items-center gap-4">
        <input
          value={page.title}
          readOnly={!editable}
          onChange={(event) => setData((current) => current ? { ...current, page: { ...current.page, title: event.target.value } } : current)}
          onBlur={(event) => savePage({ title: event.target.value })}
          className="min-w-0 flex-1 bg-transparent text-4xl font-bold outline-none read-only:cursor-default"
        />
        <span className="text-sm text-neutral-500">
          {editable ? (saveState === "saving" ? "Saving..." : saveState === "error" ? "Save failed" : saveState === "saved" ? "Saved" : "Can edit") : "View only"}
        </span>
      </div>

      {page.type === "MARKDOWN" && (
        <SharedMarkdown
          content={page.content}
          editable={editable}
          onChange={(content) => savePage({ content })}
        />
      )}

      {page.type === "LIST" && (
        <SharedList
          content={page.content as ListContent}
          editable={editable}
          onChange={(content) => savePage({ content })}
        />
      )}

      {page.type === "KANBAN" && (
        <SharedKanban
          content={page.content as KanbanContent}
          editable={editable}
          onChange={(content) => savePage({ content })}
        />
      )}
    </main>
  );
}
