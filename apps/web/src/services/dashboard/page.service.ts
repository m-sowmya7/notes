import { apiBaseUrl } from "../../utils/runtimeConfig";
import { type Page } from "../../types/pageType";

const getUserId = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User not found");
  }

  return userId;
};

export const PageService = {
  async getPages(): Promise<Page[]> {
    const res = await fetch(`${apiBaseUrl}/pages`, {
      headers: {
        "x-user-id": getUserId(),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
  },

  async toggleStar(pageId: string) {
    const res = await fetch(`${apiBaseUrl}/pages/${pageId}/star`, {
      method: "PATCH",
      headers: {
        "x-user-id": getUserId(),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
  },
};