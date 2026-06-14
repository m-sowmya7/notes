import { RotateCcw, Trash2 } from "lucide-react";

type DeletedPage = {
  id: string;
  title: string;
  deletedAt: string;
};

const deletedPages: DeletedPage[] = [
  {
    id: "1",
    title: "Old Project Ideas",
    deletedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Archive 2024",
    deletedAt: "1 week ago",
  },
  {
    id: "3",
    title: "Unused Notes",
    deletedAt: "2 weeks ago",
  },
];

const TrashPage = () => {
  return (
    <div className="p-8 bg-[#f6f3ef] min-h-screen">
      <h1 className="text-5xl font-black text-[#1f1f1f] mb-6">
        Trash
      </h1>

      <div className="bg-amber-50 border border-amber-300 text-amber-700 rounded-lg p-3 mb-5">
        Pages in trash will be permanently deleted in
        30 days.
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {deletedPages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between p-4 border-b last:border-none">
            <div>
              <h3 className="font-medium">
                {page.title}
              </h3>

              <p className="text-sm text-gray-500">
                Deleted {page.deletedAt}
              </p>
            </div>

            <div className="flex gap-3">
              <button className="p-2 rounded hover:bg-gray-100">
                <RotateCcw size={18} />
              </button>

              <button className="p-2 rounded hover:bg-red-100 text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashPage;