// Tasks : 
// 1. share option in the options has to work
// 2. what the hell am i supposed to put in the option for a page (probably share and favourites)
import { MoreHorizontal, Search, ChevronDown, Star, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Page } from "../../types/pageType";

const getFolderColor = (type?: string) => {
  switch (type) {
    case "MARKDOWN":
      return "#a8c48b";
    case "LIST":
      return "#8fc2ef";
    case "KANBAN":
      return "#d7a2dc";
    default:
      return "#cfcfcf";
  }
};

const formatEditedTime = (dateString?: string) => {
  if (!dateString) return "Recently created";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 60) return `Edited ${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Edited ${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `Edited ${diffDays} day ago`;
};

const FolderIcon = ({ color }: { color: string }) => (
  <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
    <path
      d="M3 9C3 6.79086 4.79086 5 7 5H15L18 8H35C37.2091 8 39 9.79086 39 12V27C39 29.2091 37.2091 31 35 31H7C4.79086 31 3 29.2091 3 27V9Z"
      fill={color}
      stroke="#4B4B4B"
      strokeWidth="1.5"
    />
    <path d="M3 11H39" stroke="#4B4B4B" strokeWidth="1.5" />
  </svg>
);

type SortOption = "recent" | "oldest" | "az" | "za" | "type";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Last Modified",
  oldest: "Oldest First",
  az: "A → Z",
  za: "Z → A",
  type: "By Page Type",
};

const DashboardPage = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pages");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPages(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPages();
  }, []);

  const toggleFavorite = async (pageId: string) => {
    const currentPage = pages.find((p) => p.id === pageId);
    if (!currentPage) return;

    const newStarValue = !currentPage.starred;

    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, starred: newStarValue } : page
      )
    );

    try {
      await fetch(`http://localhost:5000/api/pages/${pageId}/star`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error(error);
      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId ? { ...page, starred: !newStarValue } : page
        )
      );
    }
  };

  useEffect(() => {
    const closeMenus = () => {
      setActiveMenu(null);
      setShowSortMenu(false);
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedPages = [...filteredPages].sort((a, b) => {
    if (a.starred !== b.starred) return a.starred ? -1 : 1;

    switch (sortBy) {
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      case "oldest":
        return (
          new Date(a.updatedAt ?? 0).getTime() -
          new Date(b.updatedAt ?? 0).getTime()
        );
      case "type":
        return (a.type ?? "").localeCompare(b.type ?? "");
      default:
        return (
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
        );
    }
  });

  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">
      <section className="flex-1 px-12 py-10">
        <h1 className="text-5xl font-black text-[#1f1f1f]">All Pages</h1>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex w-85 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">
              {SORT_LABELS[sortBy]}
              <ChevronDown size={16} />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-neutral-200 bg-white shadow-lg">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key);
                        setShowSortMenu(false);
                      }}
                      className={`flex w-full items-center px-4 py-3 text-sm hover:bg-neutral-50 ${sortBy === key ? "font-semibold" : ""}`}>
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white">
          {sortedPages.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-400">
              No pages found.
            </p>
          ) : (
            sortedPages.map((page, index) => (
              <div
                key={page.id}
                onClick={() => navigate(`/editor/${page.type}/${page.id}`)}
                className={`flex w-full cursor-pointer items-center justify-between px-6 py-5 transition hover:bg-neutral-50 ${index !== sortedPages.length - 1
                    ? "border-b border-neutral-100" : ""}`}>
                <div className="flex items-center gap-5">
                  <FolderIcon color={getFolderColor(page.type)} />
                  <div>
                    <h3 className="text-lg font-semibold">{page.title}</h3>
                    <p className="text-sm text-neutral-500">
                      {formatEditedTime(page.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3">
                    {page.starred && <Star size={16} className="fill-yellow-400 text-yellow-400" />}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setActiveMenu(
                          activeMenu === page.id ? null : page.id
                        );
                      }}>
                      <MoreHorizontal
                        size={20}
                        className="text-neutral-500"
                      />
                    </button>
                  </div>

                  {activeMenu === page.id && (
                    <div
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      className="absolute right-0 top-8 z-50 w-52 rounded-xl border border-neutral-200 bg-white shadow-lg">

                      <button
                        onClick={() => {
                          setActiveMenu(null);
                          // open share modal here
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-neutral-50">
                        <Share2 size={16} />
                        Share
                      </button>

                      <button
                        onClick={() => {
                          toggleFavorite(page.id);
                          setActiveMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-yellow-600 hover:bg-neutral-50">
                        <Star size={16} />
                        UnFavorite
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;