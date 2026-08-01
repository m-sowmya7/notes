import { ArrowLeft, Radio } from "lucide-react";
import LiveParticipants, { type Participant } from "./LiveParticipants";

type Props = {
  title: string;
  participants: Participant[];
  onBack: () => void;
};

export default function LiveSessionToolbar({
  title,
  participants,
  onBack,
}: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-md p-2 transition hover:bg-neutral-100"
            aria-label="Back to pages"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <Radio size={12} />
              Live collaboration
            </div>
            <h1 className="truncate text-lg font-semibold text-neutral-900">
              {title || "Untitled"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LiveParticipants participants={participants} />
        </div>
      </div>
    </header>
  );
}