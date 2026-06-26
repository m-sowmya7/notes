import { ArrowLeft, Star, Share2, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ShareModal from "./ShareModal";
import { type PageToolbarProps } from "../types/pageToolbarType";

const PageToolbar = ({
  pageId,
  title,
  starred,
  isOnline,
  isSyncing,
  isModalOpen,
}: PageToolbarProps) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isStarred, setIsStarred] = useState(starred);

  useEffect(() => {
    setIsStarred(starred);
  }, [starred]);

  const handleToggleStar = async () => {
    try {
      setIsStarred((prev) => !prev);

      const user = localStorage.getItem("userId");
      if (!user) {
        throw new Error("User not found");
      }
      const res = await fetch(`http://localhost:5000/api/pages/${pageId}/star`,
        {
          method: "PATCH",
          headers: {
            "x-user-id": user || "",
          }
        }
      );

      if (!res.ok) {
        throw new Error();
      }
    } catch (error) {
      setIsStarred((prev) => !prev);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:5000/api/pages/${pageId}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": localStorage.getItem("userId") || "",
          }
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete page");
      }
      navigate('/pages');
    }
    catch (error) {
      console.log(error);
      alert("Failed to delete page. Please try again.");
    }
    finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className={`sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-neutral-200 transition-all
    ${isModalOpen ? "bg-white/40 backdrop-blur-md" : "bg-white/90 backdrop-blur"}`}>
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/pages')}
          className="p-2 rounded-md hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <span className="max-w-75 truncate font-medium text-neutral-700">
            {title || "Untitled"}
          </span>

          {isSyncing ? (
            <div className="flex items-center gap-1 text-amber-600 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Syncing...
            </div>
          ) : (
            <div
              className={`flex items-center gap-1 text-sm ${isOnline ? "text-green-600" : "text-neutral-500"}`}>
              <div className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-neutral-400"}`}/>
              {isOnline ? "Online" : "Offline"}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-md hover:bg-neutral-100" onClick={() => setShareOpen(true)}>
          <Share2 size={18} />
        </button>

        <button
          onClick={handleToggleStar}
          className="p-2 rounded-md hover:bg-neutral-100">
          <Star
            size={18}
            className={`transition-all duration-200 ${isStarred ? "fill-yellow-400 text-yellow-400" : "text-black"}`}
          />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-neutral-100">
            <MoreHorizontal size={18} />
          </button>

          {open && (
            <div
              className="absolute right-0 top-11 w-52 bg-white border border-neutral-200 rounded-xl shadow-lg py-1">
              <button
                onClick={() => {
                  setShowDeleteModal(true)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <ShareModal
        open={shareOpen}
        pageId={pageId}
        onClose={() => setShareOpen(false)}
        title={title}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 z-100 m-75 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-red-50 p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900">
              Delete Page
            </h2>

            <p className="mt-2 text-sm text-black">
              Bestie, are you absolutely sure you wanna delete{" "}
              <span className="font-medium">{title}</span>?
            </p>

            <p className="mt-1 text-sm text-black">
              This action cannot be ctrl+z'd.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-md border px-4 py-2 hover:bg-neutral-50">
                Nah
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50">
                {isDeleting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Yes, Got for it.
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PageToolbar;