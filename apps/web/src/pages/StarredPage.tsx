// Sharing is not working here
import { MoreHorizontal, Search, Star, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFolderColor, formatEditedTime } from "../utils/dashboard/helpers";
import { type Page } from "../types/pageType";
import { FolderIcon } from "../components/dashboard/FolderIcon";
import { apiBaseUrl } from "../utils/runtimeConfig";

const StarredPage = () => {
  const navigate = useNavigate();
  const [starredPages, setStarredPages] = useState<Page[]>([]);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const user = localStorage.getItem("userId");
  useEffect(() => {
    const loadStarredPages = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/pages/starred`, {
            headers: {
              "x-user-id": user || "",
            }
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setStarredPages(data);
      } catch (error) {
        console.error(
          "Failed to load starred pages",
          error
        );
      }
    };

    loadStarredPages();
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setActiveMenu(null);
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener(
        "click",
        closeMenu
      );
    };
  }, []);

  const toggleFavorite = async ( pageId: string ) => {
    try {
      setStarredPages((prev) =>
        prev.filter(
          (page) => page.id !== pageId
        )
      );

      await fetch(
        `${apiBaseUrl}/pages/${pageId}/star`,
        {
          method: "PATCH",
          headers: {
            "x-user-id": user || "",
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPages = starredPages.filter(
    (page) => page.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">
      <section className="flex-1 px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black text-[#1f1f1f]">
            Starred Pages
          </h1>
        </div>

        {/* Search */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex w-85 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="text-neutral-400"/>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search starred pages..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white">
          {filteredPages.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              No starred pages found
            </div>
          ) : (
            filteredPages.map(
              (page, index) => (
                <button
                  key={page.id}
                  onClick={() => navigate(`/editor/${page.type}/${page.id}`)}
                  className={`flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-neutral-50 ${index !== filteredPages.length - 1 ? "border-b border-neutral-100" : ""}`}>
                  {/* Left */}
                  <div className="flex items-center gap-5">
                    <FolderIcon
                      color={getFolderColor(
                        page.type
                      )}
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">
                        {page.title}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        {formatEditedTime(
                          page.updatedAt
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <Star size={16} className="fill-yellow-400 text-yellow-400"/>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === page.id ? null : page.id);
                        }}>
                        <MoreHorizontal
                          size={20}
                          className="text-neutral-500"
                        />
                      </button>
                    </div>

                    {activeMenu === page.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
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
                          <Star size={16}/>
                          UnFavorite
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              )
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default StarredPage;