import { Copy } from "lucide-react";

export default function LiveSessionDialog({ inviteUrl }: { inviteUrl: string }) {
  const copy = () => void navigator.clipboard.writeText(inviteUrl);
  return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm font-medium text-emerald-900">Live session ready</p><div className="mt-3 flex gap-2"><input readOnly value={inviteUrl} className="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm" /><button onClick={copy} className="rounded-lg bg-emerald-700 px-3 text-white" aria-label="Copy invite"><Copy size={16} /></button></div></div>;
}
