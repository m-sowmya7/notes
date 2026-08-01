import { Copy, Eye, Pencil, Check, Radio, Square } from "lucide-react";
import { Modal } from "@notes/ui";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../utils/runtimeConfig";
import { liveApi } from "../features/live/services/liveApi";
import { useLiveContext } from "../features/live/LiveContext";

type AccessLevel = "view" | "comment" | "edit" | "live";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  pageId: string;
  activeLiveSession?: { id: string; inviteToken?: string } | null;
  canEndLiveSession?: boolean;
  onEndLiveSession?: () => Promise<void>;
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
  activeLiveSession = null,
  canEndLiveSession = false,
  onEndLiveSession,
}: ShareModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { connect } = useLiveContext();
  const [access, setAccess] = useState<AccessLevel | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [liveParticipantName, setLiveParticipantName] = useState("");
  const [error, setError] = useState("");
  const [isEndingSession, setIsEndingSession] = useState(false);
  const activeLiveShareLink = activeLiveSession?.inviteToken
    ? `${window.location.origin}/invite/${activeLiveSession.inviteToken}`
    : "";

  const generateShareLink = async (accessLevel: AccessLevel) => {
    if (!pageId || accessLevel === "live") return;

    try {
      setError("");
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

  const startLiveSession = async () => {
    if (!pageId) return;

    try {
      const participantName = liveParticipantName.trim() || "Host";

      setError("");
      setIsGeneratingLink(true);

      const data = await liveApi.create(pageId);
      setLiveParticipantName(participantName);
      setShareLink(data.url);
      // Connect immediately. Navigating to the same editor route can preserve
      // its mounted components, so waiting for route state alone left hosts
      // outside the awareness room in some browsers.
      connect(data.sessionId, pageId, data.inviteToken);
      // Keep the exact page ID in the route state so the page component can
      // immediately establish the host's WebSocket connection.
      navigate(location.pathname, { replace: true, state: { live: true, sessionId: data.sessionId, inviteToken: data.inviteToken, participantName, pageId, isHost: true } });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start live collaboration.");
      console.error("Error starting live collaboration:", error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopy = async () => {
    const link = access === "live" ? shareLink || activeLiveShareLink : shareLink;
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const endLiveSession = async () => {
    if (!onEndLiveSession) return;

    try {
      setError("");
      setIsEndingSession(true);
      await onEndLiveSession();
      setShareLink("");
      setAccess(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to end the live session.");
    } finally {
      setIsEndingSession(false);
    }
  };

  const closeModal = () => {
    setAccess(null);
    setShareLink("");
    setCopied(false);
    onClose();
  };

  const selectAccess = (accessLevel: AccessLevel) => {
    setShareLink("");
    setCopied(false);
    setError("");
    setAccess(accessLevel);

    if (accessLevel === "live") {
      return;
    }

    void generateShareLink(accessLevel);
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeModal();
      }}
      title={`Spread the tea from "${title || "Untitled"}"`}
    >
      <div className="space-y-3">
        {options.map(({ id, title, description, icon: Icon, bgColor }) => (
          <button
            key={id}
            onClick={() => {
              selectAccess(id as AccessLevel);
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

          {access === "live" ? (
            <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              {activeLiveSession ? (
                <>
                  <p className="text-sm font-medium text-emerald-900">A live session is currently active.</p>
                  {canEndLiveSession && (
                    <button
                      type="button"
                      onClick={() => void endLiveSession()}
                      disabled={isEndingSession}
                      className="flex w-full items-center justify-center gap-2 squircle-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Square size={16} />
                      {isEndingSession ? "Ending session..." : "End live session"}
                    </button>
                  )}
                </>
              ) : (
                <>
              <div className="flex items-end gap-3">
                <label className="flex-1">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">Participant name</span>
                  <input
                    value={liveParticipantName}
                    onChange={(event) => setLiveParticipantName(event.target.value)}
                    placeholder="Enter a name or randomize it"
                    className="w-full squircle-xl border border-neutral-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-400"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setLiveParticipantName("Host")}
                  className="squircle-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Random
                </button>
              </div>

              <button
                onClick={() => void startLiveSession()}
                disabled={isGeneratingLink}
                className="flex w-full items-center justify-center gap-2 squircle-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Radio size={16} />
                {isGeneratingLink ? "Starting session..." : "Start live session"}
              </button>
                </>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {(shareLink || activeLiveShareLink) && (
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareLink || activeLiveShareLink}
                    className="flex-1 squircle-xl border border-neutral-300 px-3 py-2 outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={isGeneratingLink || !(shareLink || activeLiveShareLink)}
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
              )}
            </div>
          ) : (
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
          )}
        </div>
      )}
    </Modal>
  );
};

export default ShareModal;
