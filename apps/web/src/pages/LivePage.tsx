import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SharedKanban, { type KanbanContent } from "../features/share/components/SharedKanban";
import SharedList, { type ListContent } from "../features/share/components/SharedList";
import SharedMarkdown from "../features/share/components/SharedMarkdown";
import { useLiveProvider } from "../features/live/useLiveProvider";
import { apiBaseUrl } from "../utils/runtimeConfig";

type PageType = "MARKDOWN" | "LIST" | "KANBAN";

type LiveSession = {
  id: string;
  active: boolean;
  page: {
    title: string;
    type: PageType;
    content: unknown;
  };
};

export default function LivePage() {
  const { inviteToken } = useParams();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [error, setError] = useState("");
  const invalidInvite = !inviteToken;
  const live = useLiveProvider(session?.id || "", Boolean(session?.active));

  useEffect(() => {
    if (!inviteToken) return;

    const controller = new AbortController();
    fetch(`${apiBaseUrl}/share-links/live/invite/${inviteToken}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("This live collaboration link has expired.");
        return res.json() as Promise<LiveSession>;
      })
      .then(setSession)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unable to join the session.");
      });

    return () => controller.abort();
  }, [inviteToken]);

  if (invalidInvite || error || !session || !live) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-600">
        {error || (invalidInvite ? "Invalid live collaboration link." : "Joining live collaboration...")}
      </div>
    );
  }

  const { page } = session;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="min-w-0 truncate text-4xl font-bold">{page.title}</h1>
        <span className="shrink-0 text-sm text-green-600">Live collaboration</span>
      </div>

      {page.type === "MARKDOWN" && (
        <SharedMarkdown content={page.content} editable liveYdoc={live.ydoc} onChange={() => {}} />
      )}
      {page.type === "LIST" && (
        <SharedList content={page.content as ListContent} editable liveYdoc={live.ydoc} onChange={() => {}} />
      )}
      {page.type === "KANBAN" && (
        <SharedKanban content={page.content as KanbanContent} editable liveYdoc={live.ydoc} onChange={() => {}} />
      )}
    </main>
  );
}
