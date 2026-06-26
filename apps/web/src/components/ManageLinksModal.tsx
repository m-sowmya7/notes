import { X, Trash2, Copy, Check } from "lucide-react";
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
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyLink = async (id: string, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const input = document.createElement("textarea");
            input.value = url;

            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
        }

        setCopiedId(id);

        setTimeout(() => {
            setCopiedId((current) => (current === id ? null : current));
        }, 2000);
    };

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
                    Array.isArray(data) ? data : Array.isArray(data.links) ? data.links : []
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
        try {
            const res = await fetch(
                `http://localhost:5000/api/share-links/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error(await res.text());
            }

            setLinks((prev) =>
                prev.filter((link) => link.id !== id)
            );
        } catch (err) {
            console.error(err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30">
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
                            const url = `${window.location.origin}/share/${link.token}`;

                            return (
                                <div key={link.id} className="flex items-center justify-between border-b px-6 py-4">
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {link.access}
                                        </div>

                                        <div className="mt-1 truncate text-sm text-neutral-500">
                                            {url}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => copyLink(link.id, url)} className="rounded-lg p-2 transition hover:bg-neutral-100">
                                            {copiedId === link.id ? (
                                                <Check size={18} className="text-green-600"
                                                />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                        </button>

                                        <button onClick={() => deleteLink(link.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
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