import { MoreHorizontal, Search, ChevronDown, Star, Share2, Link2 } from "lucide-react";
import { useState } from "react";
import { usePages } from "../hooks/usePages";
import { useToggleStar } from "../hooks/useToggleStar";
import { useNavigate } from "react-router-dom";
import ManageLinksModal from "../components/ManageLinksModal";
import ShareModal from "../components/ShareModal";
import { getFolderColor, formatEditedTime, SORT_LABELS, type SortOption } from "../utils/dashboard/helpers";
import { FolderIcon } from "../components/dashboard/FolderIcon";
import { Button, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@notes/ui";

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPageTitle, setSelectedPageTitle] = useState("");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: pages = [] } = usePages();
  const toggleStarMutation = useToggleStar();

  const toggleFavorite = (pageId: string) => {
    toggleStarMutation.mutate(pageId);
  };

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
        return (new Date(a.updatedAt ?? 0).getTime() - new Date(b.updatedAt ?? 0).getTime());
      case "type":
        return (a.type ?? "").localeCompare(b.type ?? "");
      default:
        return (new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
    }
  });

  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">
      <section className="flex-1 px-12 py-10">
        <h1 className="text-5xl font-black text-[#1f1f1f]">All Pages</h1>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex w-85 items-center gap-3 squircle-xl border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-white! border-border!">
                {SORT_LABELS[sortBy]}
                <ChevronDown size={16} />
              </Button>
            </DropdownTrigger>

            <DropdownContent
              alignOffset={-48}
              align="end"
              side="bottom"
              className="w-48">
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                ([key, label]) => (
                  <DropdownItem
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={sortBy === key ? "font-semibold" : ""}>
                    {label}
                  </DropdownItem>
                ),
              )}
            </DropdownContent>
          </Dropdown>
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
                  ? "border-b border-neutral-100"
                  : ""
                  }`}>
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
                    {page.starred && (
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === page.id ? null : page.id);
                      }}>
                      <MoreHorizontal size={20} className="text-neutral-500" />
                    </button>
                  </div>

                  {activeMenu === page.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-8 z-50 w-52 rounded-xl border border-neutral-200 bg-white shadow-lg">
                      <button
                        onClick={() => {
                          setSelectedPageId(page.id);
                          setSelectedPageTitle(page.title);
                          setShowShareModal(true);
                          setActiveMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-neutral-50">
                        <Share2 size={16} />
                        Share
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPageId(page.id);
                          setShowLinksModal(true);
                          setActiveMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-neutral-50">
                        <Link2 size={16} />
                        Manage Links
                      </button>

                      <button
                        onClick={() => {
                          toggleFavorite(page.id);
                          setActiveMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-yellow-600 hover:bg-neutral-50">
                        <Star size={16} />
                        {page.starred ? "Unfavorite" : "Favorite"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <ManageLinksModal
        open={showLinksModal}
        pageId={selectedPageId || ""}
        onClose={() => {
          setShowLinksModal(false);
          setSelectedPageId(null);
        }}
      />
      <ShareModal
        open={showShareModal}
        title={selectedPageTitle}
        pageId={selectedPageId ?? ""}
        onClose={() => {
          setShowShareModal(false);
          setSelectedPageId(null);
          setSelectedPageTitle("");
        }}
      />
    </main>
  );
};

export default DashboardPage;