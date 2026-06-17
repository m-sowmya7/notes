import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TemplatesModalProps = {
  open: boolean;
  onClose: () => void;
};

const templates = [
  {
    id: "markdown",
    title: "Plain Text",
    description: "Simple markdown document",
    type: "MARKDOWN",
    path: "/editor/markdown",
    bg: "bg-blue-100",
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <path
          d="M22 14H42L50 22V58H22V14Z"
          stroke="#5B5B5B"
          strokeWidth="2"
          fill="#DBEAFE"
        />
        <path
          d="M42 14V22H50"
          stroke="#5B5B5B"
          strokeWidth="2"
        />
      </svg>
    ),
  },

  {
    id: "list",
    title: "List",
    description: "Organize tasks and ideas",
    type: "LIST",
    path: "/editor/list",
    bg: "bg-[#dfe8d2]",
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect
          x="14"
          y="14"
          width="44"
          height="44"
          rx="4"
          fill="#c7d4b3"
          stroke="#5B5B5B"
          strokeWidth="1.5"
        />

        {[22, 32, 42].map((y) => (
          <g key={y}>
            <circle cx="24" cy={y} r="2" fill="#5B5B5B" />
            <line
              x1="30"
              y1={y}
              x2="48"
              y2={y}
              stroke="#5B5B5B"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
    ),
  },

  {
    id: "kanban",
    title: "Kanban Board",
    description: "Track workflows visually",
    type: "KANBAN",
    path: "/editor/kanban",
    bg: "bg-[#dfdcfa]",
    icon: (
      <svg width="80" height="72" viewBox="0 0 80 72" fill="none">
        <rect
          x="10"
          y="14"
          width="18"
          height="44"
          rx="2"
          fill="#c9c2f3"
          stroke="#5B5B5B"
          strokeWidth="1.5"
        />

        <rect
          x="31"
          y="14"
          width="18"
          height="44"
          rx="2"
          fill="#c9c2f3"
          stroke="#5B5B5B"
          strokeWidth="1.5"
        />

        <rect
          x="52"
          y="14"
          width="18"
          height="44"
          rx="2"
          fill="#c9c2f3"
          stroke="#5B5B5B"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

const TemplatesModal = ({ open, onClose }: TemplatesModalProps) => {
  const navigate = useNavigate();

  const createPage = async ( type: string, path: string ) => {
    try {
      let content: any = {};

      switch (type) {
        case "MARKDOWN":
          content = {};
          break;

        case "LIST":
          content = {
            items: [
              {
                id: crypto.randomUUID(),
                text: "",
                completed: false,
              },
            ],
          };
          break;

        case "KANBAN":
          content = {
            columns: [
              {
                id: crypto.randomUUID(),
                title: "To Do",
                cards: [],
              },
            ],
          };
          break;

        default:
          content = {};
      }

      const res = await fetch(
        "http://localhost:5000/api/pages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "",
            type,
            content,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to create page (${res.status})`
        );
      }

      const page = await res.json();

      navigate(`${path}/${page.id}`);

      onClose();
    } catch (error) {
      console.error(
        "Error creating page:",
        error
      );
    }
  };

  if (!open) return null;

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className=" relative w-full max-w-202.5 rounded-[28px] border border-neutral-200 bg-white p-10 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-neutral-900">
              Create New Page
            </h1>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-neutral-100">
            <X
              size={28}
              className="text-neutral-700"
            />
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-8">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() =>
                createPage(
                  template.type,
                  template.path
                )
              }
              className={`group flex h-60 w-55 flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 ${template.bg} transition duration-200 hover:scale-[1.02] hover:shadow-lg`}>
              {template.icon}

              <div className="space-y-1 text-center">
                <span className="block text-xl font-semibold text-neutral-800">
                  {template.title}
                </span>

                <p className="text-sm text-neutral-600">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;