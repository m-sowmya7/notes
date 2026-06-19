// Tasks : 
// 1. ofc access restrictions
// 2. share to other apps (not necessary rn cause it makes a link)
import { X, Copy, Eye, MessageSquare, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

type AccessLevel = "view" | "comment" | "edit";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
};

const shareLink = "https://notes.app/share/abc123";

const options = [
  {
    id: "view",
    title: "View Only",
    description: "Can peek, can't tweak",
    icon: Eye,
    bgColor: "bg-pink-100",
  },
  // {
  //   id: "comment",
  //   title: "Comment Only",
  //   description: "View and add comments",
  //   icon: MessageSquare,
  //   bgColor: "bg-blue-100",
  // },
  {
    id: "edit",
    title: "Edit Access",
    description: "Cook freely",
    icon: Pencil,
    bgColor: "bg-purple-100",
  },
];

const ShareModal = ({
  open,
  onClose,
  title,
}: ShareModalProps) => {
  const [access, setAccess] = useState<AccessLevel>("view");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="w-120 rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Spread the tea from "{title || "Untitled"}"
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {options.map(({ id, title, description, icon: Icon, bgColor }) => (
            <button
              key={id}
              onClick={() => setAccess(id as AccessLevel)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
                access === id ? "border-violet-400 bg-violet-50" : "border-neutral-200"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}>
                  <Icon size={18} />
                </div>

                <div className="text-left">
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-neutral-500">
                    {description}
                  </p>
                </div>
              </div>

              {access === id && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Share Link */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Share The Vibe</p>

          <div className="flex gap-2">
            <input
              readOnly
              value={shareLink}
              className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 outline-none"
            />

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-white transition ${
                copied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}>
              <Copy size={16} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareModal;