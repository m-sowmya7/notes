import { ArrowLeft, Star, Link, Share2, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ShareModal from "./ShareModal";

type PageToolbarProps = {
  title: string;
  isOnline: boolean;
  isSyncing: boolean;
  isModalOpen?: boolean;
};

const PageToolbar = ({
  title,
  isOnline,
  isSyncing,
  isModalOpen,
}: PageToolbarProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <header
      className={`
    sticky top-0 z-50
    flex items-center justify-between
    px-6 py-3
    border-b border-neutral-200
    transition-all
    ${isModalOpen
          ? "bg-white/40 backdrop-blur-md"
          : "bg-white/90 backdrop-blur"
        }
  `}
    >
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
              className={`flex items-center gap-1 text-sm ${isOnline
                ? "text-green-600"
                : "text-neutral-500"
                }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${isOnline
                  ? "bg-green-500"
                  : "bg-neutral-400"
                  }`}
              />
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

        <button className="p-2 rounded-md hover:bg-neutral-100">
          <Link size={18} />
        </button>

        <button className="p-2 rounded-md hover:bg-neutral-100">
          <Star size={18} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-neutral-100"
          >
            <MoreHorizontal size={18} />
          </button>

          {open && (
            <div
              className="
                absolute right-0 top-11
                w-52
                bg-white
                border border-neutral-200
                rounded-xl
                shadow-lg
                py-1
              ">
              <button
                className="
                  w-full
                  flex items-center gap-2
                  px-3 py-2
                  text-red-500
                  hover:bg-red-50
                ">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={title}
      />
    </header>
  );
};

export default PageToolbar;