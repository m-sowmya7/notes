import { Link, useLocation } from 'react-router-dom'
import { Home, Folder, Star, Trash2, Plus, ChevronDown, NotebookPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TemplatesModal from './TemplatesModal'
import { useTemplatesModal } from '../context/TemplatesModalContext'
const navItems = [
  {
    label: 'All Pages',
    icon: Folder,
    path: '/pages',
  },
  {
    label: 'Starred',
    icon: Star,
    path: '/starred',
  },
  {
    label: 'Trash',
    icon: Trash2,
    path: '/trash',
  },
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {isTemplatesModalOpen, setIsTemplatesModalOpen} = useTemplatesModal();

  return (
    <aside className="flex h-screen w-65 flex-col border-r border-neutral-200 bg-[#f8f5f1]">
      {/* Logo */}
      <div className="px-8 pt-6">
        <div className="flex h-12 w-full items-center justify-center rounded-xl border border-neutral-400 bg-[#e7eadf] text-3xl font-bold text-[#2c2c2c] mb-3"
          onClick={() => navigate('/')}>
          <NotebookPen />
        </div>

        <button
          onClick={() => setIsTemplatesModalOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCD67F] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-[#F7F1DE] transition hover:opacity-95">
          <Plus size={18} />
          New Page
        </button>

        <TemplatesModal
          open={isTemplatesModalOpen}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col gap-2 px-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100">
          <Home size={18} />
          Home
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-[#C8AAAA]/20 text-black' : 'text-neutral-700 hover:bg-neutral-100'}`}>
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Profile */}
      {/* <div className="p-4">
        <button
          className="
            flex w-full items-center justify-between
            rounded-2xl border border-neutral-200
            bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full bg-[#b7aa98]
                text-sm font-semibold text-white">
              U
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-800">
                User Name
              </p>

              <p className="text-xs text-neutral-500">
                Free plan
              </p>
            </div>
          </div>

          <ChevronDown size={16} className="text-neutral-500" />
        </button>
      </div> */}
    </aside>
  )
}

export default Sidebar