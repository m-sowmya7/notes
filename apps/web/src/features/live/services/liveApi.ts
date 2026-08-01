import { apiBaseUrl } from "../../../utils/runtimeConfig";
import type { LiveInvite, LiveSessionResponse } from "../types";

const endpoint = `${apiBaseUrl}/share-links/live`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${endpoint}${path}`, init);
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(payload?.error ?? "Live collaboration request failed");
  }
  return response.json() as Promise<T>;
}

export const liveApi = {
  create: (pageId: string) => request<LiveSessionResponse>(`/page/${pageId}`, { method: "POST", headers: { "x-user-id": localStorage.getItem("userId") ?? "" } }),
  status: (pageId: string) => request<{ id?: string; sessionId?: string; active?: boolean } | null>(`/page/${pageId}`),
  invite: (token: string) => request<LiveInvite>(`/invite/${token}`),
  join: (token: string, participantName: string) => request<{ sessionId: string; pageId: string; inviteToken: string; participantName?: string }>(`/invite/${token}/join`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ participantName, name: participantName }) }),
  end: (sessionId: string) => request<void>(`/session/${sessionId}/end`, { method: "PATCH", headers: { "x-user-id": localStorage.getItem("userId") ?? "" } }),
};
