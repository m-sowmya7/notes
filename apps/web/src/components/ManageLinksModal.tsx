// not deleting in the database yet, just removing from the UI for now
// close modal when clicking outside of it
// copy link to clipboard when clicking on the copy button is not working
// the modal size should be scrollable if there are too many links (limit the height to 400px or so)
import { X, Trash2, Copy } from "lucide-react";
import { useEffect, useState } from "react";

type ShareLink = {
    id: string;
    token: string;
    access: "VIEW" | "EDIT";
    createdAt: string;
};

type Props = {
    pageId: string;
    open: boolean;
    onClose: () => void;
};

export default function ManageLinksModal({
    pageId,
    open,
    onClose,
}: Props) {
    const [links, setLinks] = useState<ShareLink[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !pageId) return;

        const fetchLinks = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `http://localhost:5000/api/share-links/page/${pageId}`
                );

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();

                setLinks(
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.links)
                            ? data.links
                            : []
                );
            } catch (err) {
                console.error(err);
                setLinks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [open, pageId]);

    const deleteLink = async (id: string) => {
        await fetch(
            `http://localhost:5000/api/share/${id}`,
            {
                method: "DELETE",
            }
        );

        setLinks((prev) =>
            prev.filter((link) => link.id !== id)
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30">
            <div className="w-[650px] rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        Shared Links
                    </h2>

                    <button onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="max-h-[450px] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center">
                            Loading...
                        </div>
                    ) : links.length === 0 ? (
                        <div className="p-8 text-center text-neutral-400">
                            No shared links found
                        </div>
                    ) : (
                        links.map((link) => {
                            const url =
                                `${window.location.origin}/share/${link.token}`;

                            return (
                                <div
                                    key={link.id}
                                    className="flex items-center justify-between border-b px-6 py-4"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {link.access}
                                        </div>

                                        <div className="mt-1 truncate text-sm text-neutral-500">
                                            {url}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                navigator.clipboard.writeText(url)
                                            }
                                            className="rounded-lg p-2 hover:bg-neutral-100"
                                        >
                                            <Copy size={16} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteLink(link.id)
                                            }
                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}