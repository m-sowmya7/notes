// Tasks : 
// 1. redirection of pages to actual editors
// 2. still getting that 500 error but the pages are being displayed
// 3. should be able to removethe pages from starred from here
// 4. the pages properties should be there like type of the page and the icon color as they are like in the dashboard
import { MoreHorizontal, Search, Star } from 'lucide-react'
import { useState, useEffect } from 'react';
// const starredPages = [
//   {
//     title: 'Project Planning Board',
//     edited: 'Edited 2 mins ago',
//     color: '#a8c48b',
//     starred: true,
//   },
//   {
//     title: 'Website Redesign',
//     edited: 'Edited 1 day ago',
//     color: '#d7a2dc',
//     starred: true,
//   },
//   {
//     title: 'Brand Guidelines',
//     edited: 'Edited 5 days ago',
//     color: '#8fc2ef',
//     starred: true,
//   },
// ]


const FolderIcon = ({ color }: { color: string }) => {
  return (
    <svg
      width="42"
      height="34"
      viewBox="0 0 42 34"
      fill="none"
    >
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
  )
}

const StarredPage = () => {
  const [starredPages, setStarredPages] = useState<any[]>([]);
  useEffect(() => {
    try {
      const loadStarredPages = async () => {
        const res = await fetch("http://localhost:5000/api/pages/starred");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStarredPages(data);
      }

      loadStarredPages();
    }
    catch(error) {
      throw new Error("Failed to load starred pages");
    }
}, [])
  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">
      <section className="flex-1 px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black text-[#1f1f1f]">
            Starred Pages
          </h1>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex w-85 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="text-neutral-400" />

            <input
              type="text"
              placeholder="Search starred pages..."
              className="
                w-full bg-transparent text-sm
                outline-none placeholder:text-neutral-400"/>
          </div>

        </div>

        {/* List */}
        <div
          className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {starredPages.map((page, index) => (
            <button
              key={page.title}
              className={`
                flex w-full items-center justify-between
                px-6 py-5 text-left transition
                hover:bg-neutral-50
                ${index !== starredPages.length - 1
                  ? 'border-b border-neutral-100'
                  : ''
                }`}>
              <div className="flex items-center gap-5">
                <FolderIcon color={page.color} />

                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {page.title}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {page.edited}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Star
                  size={18}
                  className="fill-[#f5b301] text-[#f5b301]"
                />

                <MoreHorizontal
                  size={20}
                  className="text-neutral-500"
                />
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default StarredPage