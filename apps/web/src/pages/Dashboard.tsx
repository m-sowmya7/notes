// Tasks : 
// 1. The starred page position has to be changed
// 2. what the hell am i supposed to put in the option for a page (probably share and edit)
// 3. the colors for folders has to be assigned based on the type of file (for ex green for markdown, blue for list, purple for kanban)
import { MoreHorizontal, Search, ChevronDown, Star } from 'lucide-react'

const pages = [
  {
    title: 'Project Planning Board',
    edited: 'Edited 2 mins ago',
    color: '#a8c48b',
    starred: true,
  },
  {
    title: 'Website Redesign',
    edited: 'Edited 1 day ago',
    color: '#d7a2dc',
  },
  {
    title: 'Client Meeting Notes',
    edited: 'Edited 3 days ago',
    color: '#8fc2ef',
  },
]

const FolderIcon = ({ color }: { color: string }) => {
  return (
    <svg
      width="42"
      height="34"
      viewBox="0 0 42 34"
      fill="none">
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

const DashboardPage = () => {
  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">

      <section className="flex-1 px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black text-[#1f1f1f]">
            All Pages
          </h1>
        </div>

        {/* Top Controls */}
        <div className="mt-8 flex items-center justify-between">
          {/* Search */}
          <div
            className="
              flex w-85 items-center gap-3
              rounded-xl border border-neutral-200
              bg-white px-4 py-3
            "
          >
            <Search size={18} className="text-neutral-400" />

            <input
              type="text"
              placeholder="Search pages..."
              className="
                w-full bg-transparent text-sm
                outline-none placeholder:text-neutral-400
              "
            />
          </div>

          {/* Sort */}
          <button
            className="
              flex items-center gap-2
              rounded-xl border border-neutral-200
              bg-white px-4 py-3
              text-sm font-medium text-neutral-700
            "
          >
            Last modified
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Pages List */}
        <div
          className="
            mt-8 overflow-hidden rounded-2xl
            border border-neutral-200 bg-white
          "
        >
          {pages.map((page, index) => (
            <button
              key={page.title}
              className={`
                flex w-full items-center justify-between
                px-6 py-5 text-left transition
                hover:bg-neutral-50
                ${index !== pages.length - 1 ? 'border-b border-neutral-100' : ''}
              `}
            >
              <div className="flex items-center gap-5">
                <FolderIcon color={page.color} />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-800">
                      {page.title}
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-neutral-500">
                    {page.edited}
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
  )
}

export default DashboardPage