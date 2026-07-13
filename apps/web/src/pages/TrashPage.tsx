// import { RotateCcw, Trash2 } from "lucide-react";

// type DeletedPage = {
//   id: string;
//   title: string;
//   deletedAt: string;
// };

// const deletedPages: DeletedPage[] = [
//   {
//     id: "1",
//     title: "Old Project Ideas",
//     deletedAt: "2 days ago",
//   },
//   {
//     id: "2",
//     title: "Archive 2024",
//     deletedAt: "1 week ago",
//   },
//   {
//     id: "3",
//     title: "Unused Notes",
//     deletedAt: "2 weeks ago",
//   },
// ];

const TrashPage = () => {
  return (
    <main className="flex min-h-screen bg-[#f6f3ef]">
      <section className="flex-1 px-12 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black text-[#1f1f1f]">
            Trash
          </h1>
        </div>
        <div className="mt-8">
          Be Right Back! This page is under construction...
        </div>
      </section>
    </main>
  )
}

export default TrashPage;