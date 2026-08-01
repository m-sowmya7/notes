import { useEffect, useState, type RefObject } from "react";
import type { LiveConnection, LiveUser } from "../../features/live/types";

type Cursor = LiveUser & { x: number; y: number; clientId: number };
export default function LiveCursorOverlay({ live, containerRef }: { live: LiveConnection | null; containerRef: RefObject<HTMLElement | null> }) {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  useEffect(() => {
    const awareness = live?.provider.awareness;
    if (!awareness) return;
    const update = () => setCursors(Array.from(awareness.getStates().entries()).flatMap(([clientId, state]) => {
      const value = state as { user?: LiveUser; cursor?: { x?: number; y?: number } };
      return clientId !== awareness.clientID && value.user && typeof value.cursor?.x === "number" && typeof value.cursor?.y === "number" ? [{ ...value.user, x: value.cursor.x, y: value.cursor.y, clientId }] : [];
    }));
    const move = (event: MouseEvent) => { const bounds = containerRef.current?.getBoundingClientRect(); if (bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom) awareness.setLocalStateField("cursor", { x: event.clientX, y: event.clientY }); };
    awareness.on("change", update); update(); window.addEventListener("mousemove", move);
    return () => { awareness.off("change", update); window.removeEventListener("mousemove", move); awareness.setLocalStateField("cursor", null); };
  }, [containerRef, live]);
  return <div className="pointer-events-none fixed inset-0 z-40">{cursors.map((cursor) => <div key={cursor.clientId} className="absolute" style={{ left: cursor.x, top: cursor.y }}><span className="rounded px-1.5 py-0.5 text-xs font-medium text-white shadow" style={{ backgroundColor: cursor.color }}>{cursor.name}</span></div>)}</div>;
}
