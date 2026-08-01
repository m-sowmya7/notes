import type { LiveUser } from "./types";

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

export function createLocalUser(name: string): LiveUser {
  return { id: crypto.randomUUID(), name, color: colors[Math.floor(Math.random() * colors.length)]! };
}
