import { Radio } from "lucide-react";

export default function LiveStatus({ connected }: { connected: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${connected ? "text-emerald-700" : "text-amber-700"}`}><Radio size={14} /><span className={`size-2 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`} />{connected ? "Live" : "Connecting"}</span>;
}
