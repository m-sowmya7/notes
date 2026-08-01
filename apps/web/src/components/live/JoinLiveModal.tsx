import { useState } from "react";

export default function JoinLiveModal({ onJoin, busy = false }: { onJoin: (name: string) => void; busy?: boolean }) {
  const [name, setName] = useState("");
  return <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onJoin(name.trim()); }} className="space-y-3"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-emerald-500" /><button disabled={busy || !name.trim()} className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60">{busy ? "Joining…" : "Join live session"}</button></form>;
}
