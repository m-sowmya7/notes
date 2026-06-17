// Tasks : 
// 1. The starred page position has to be changed and starred pages should go to starred page
// 2. what the hell am i supposed to put in the option for a page (probably share and edit)
// 3. search functionality and sorting (how to sort them)
import { MoreHorizontal, Search, ChevronDown, Star } from "lucide-react";
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
  if (!dateString) {
    return "Recently created";
  }

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 60) {
    return `Edited ${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `Edited ${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `Edited ${diffDays} day ago`;
};

const FolderIcon = ({ color }: { color: string }) => {
  return (
    <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
      <path
        d="M3 9C3 6.79086 4.79086 5 7 5H15L18 8H35C37.2091 8 39 9.79086 39 12V27C39 29.2091 37.2091 31 35 31H7C4.79086 31 3 29.2091 3 27V9Z"
        fill={color}
        stroke="#4B4B4B"
        strokeWidth="1.5"
      />
      <path
        d="M3 11H39"
        stroke="#4B4B4B"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const DashboardPage = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/pages"
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setPages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPages();
  }, []);

  const sortedPages = [...pages].sort((a, b) => {
    if (a.starred === b.starred) {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;

      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return dateB - dateA;
    }

    return a.starred ? -1 : 1;
  });

  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">
      <section className="flex-1 px-12 py-10">
        <h1 className="text-5xl font-black text-[#1f1f1f]">
          All Pages
        </h1>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex w-85 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="text-neutral-400" />

            <input
              type="text"
              placeholder="Search pages..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">
            Last modified
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {sortedPages.map((page, index) => (
            <button
              key={page.id}
              onClick={() =>
                navigate(`/editor/${page.type}/${page.id}`)
              }
              className={`flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-neutral-50 ${index !== sortedPages.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div className="flex items-center gap-5">
                <FolderIcon
                  color={getFolderColor(page.type)}
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {page.title}
                    </h3>

                    {page.starred && (
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    )}
                  </div>

                  <p className="text-sm text-neutral-500">
                    {formatEditedTime(page.updatedAt)}
                  </p>
                </div>
              </div>

              <MoreHorizontal
                size={20}
                className="text-neutral-500"
              />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;