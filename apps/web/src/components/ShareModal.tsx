import { Copy, Eye, Pencil, Check, Radio } from "lucide-react";
import { Modal } from "@notes/ui";
import { useEffect, useState } from "react";
import { apiBaseUrl } from "../utils/runtimeConfig";

type AccessLevel = "view" | "comment" | "edit" | "live";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  pageId: string;
};

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
  {
    id: "live",
    title: "Start a Live Collaboration",
    description: "Partner up and vibe together",
    icon: Radio,
    bgColor: "bg-green-100",
  },
];

const ShareModal = ({
  open,
  onClose,
  title,
  pageId,
}: ShareModalProps) => {
  const [access, setAccess] = useState<AccessLevel | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  // const [isLiveStarting, setIsLiveStarting] = useState(false);
  const generateShareLink = async (accessLevel: AccessLevel) => {
    if (!pageId) return;

    try {
      setIsGeneratingLink(true);

      const res = await fetch(`${apiBaseUrl}/share-links/${pageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access: accessLevel === "view" ? "VIEW" : "EDIT",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate share link");
      }

      const data = await res.json();
      setShareLink(data.url);
    } catch (error) {
      console.error("Error generating share link:", error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  useEffect(() => {
    if (!open || !access) return;
    generateShareLink(access);
  }, [open, access, pageId]);

  useEffect(() => {
    if (!open) {
      setAccess(null);
      setShareLink("");
      setCopied(false);
    }
  }, [open]);

  const handleCopy = async () => {
    if (!shareLink) return;
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

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Spread the tea from "${title || "Untitled"}"`}
    >
      <div className="space-y-3">
        {options.map(({ id, title, description, icon: Icon, bgColor }) => (
          <button
            key={id}
            onClick={() => {
              setShareLink("");
              setCopied(false);
              setAccess(id as AccessLevel);
            }}
            className={`group flex h-18 w-full items-center justify-between border px-4 transition-all squircle-xl ${
              access === id
                ? "border-primary shadow-sm"
                : "border-border bg-surface hover:border-border hover:bg-surface-strong/50"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className={`flex size-11 shrink-0 items-center justify-center squircle-lg ${bgColor}`}
              >
                <Icon size={18} />
              </div>

              <div className="flex min-w-0 flex-col justify-center text-left">
                <p className="truncate text-body font-semibold leading-none">
                  {title}
                </p>
                <p className="mt-1 text-body-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            {access === id && (
              <div className="flex h-6 w-6 items-center justify-center squircle-lg bg-violet-500 text-white">
                <Check size={14} />
              </div>
            )}
          </button>
        ))}
      </div>

      {access && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Share The Vibe</p>

          <div className="flex gap-2">
            <input
              readOnly
              value={isGeneratingLink ? "Whipping up the link..." : shareLink}
              className="flex-1 squircle-xl border border-neutral-300 px-3 py-2 outline-none"
            />

            <button
              onClick={handleCopy}
              disabled={isGeneratingLink || !shareLink}
              className={`flex items-center gap-2 squircle-xl px-4 py-2 text-white transition ${
                copied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-violet-600 hover:bg-violet-700"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ShareModal;
