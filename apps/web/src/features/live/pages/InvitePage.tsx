import { AlertCircle, Loader2, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { liveApi } from "../services/liveApi";
import type { LiveInvite, PageType } from "../types";

const editorType: Record<PageType, string> = { MARKDOWN: "markdown", LIST: "list", KANBAN: "kanban" };

export default function InvitePage() {
  const { inviteToken = "" } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<LiveInvite | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void liveApi.invite(inviteToken).then((value) => { if (!cancelled) setInvite(value); }).catch((reason: Error) => { if (!cancelled) setError(reason.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [inviteToken]);

  const join = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!invite || !name.trim()) return;
    setJoining(true); setError("");
    try {
      const joined = await liveApi.join(inviteToken, name.trim());
      navigate(`/editor/${editorType[invite.pageType]}/${joined.pageId}`, { replace: true, state: { live: true, sessionId: joined.sessionId, inviteToken: joined.inviteToken, participantName: name.trim(), pageId: joined.pageId, isHost: false } });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to join this session."); }
    finally { setJoining(false); }
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-emerald-600" />
      </main>)
  if (error || !invite?.active)
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-neutral-50 p-6">
        <section className="w-full rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-amber-600" />
          <h1 className="text-xl font-semibold">This live session is unavailable</h1>
          <p className="mt-2 text-sm text-neutral-600">{error || "The session has ended or the invite has expired."}</p>
        </section>
      </main>
    )

  return (
    <main className="w-full flex items-center justify-center min-h-screen bg-neutral-50 p-6">
      <section className="w-100 min-h-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Radio size={21} />
        </div>
        <p className="text-sm font-medium text-emerald-700">Live collaboration</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">Join “{invite.pageTitle}”</h1>
        <p className="mt-2 text-sm text-neutral-600">Choose the name collaborators will see while you edit.</p>
        <form className="mt-6 space-y-4" onSubmit={join}>
          <label className="block text-sm font-medium text-neutral-700">
            Your name
            <input autoFocus required maxLength={60} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-neutral-300 px-3 py-2.5 outline-none focus:border-emerald-500" placeholder="Ada Lovelace" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={joining || !name.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
            {joining && <Loader2 size={16} className="animate-spin" />}
            Join session
          </button>
        </form>
      </section>
    </main>
  )
}
