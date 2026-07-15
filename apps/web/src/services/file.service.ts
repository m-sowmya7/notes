// import { apiBaseUrl } from "../utils/runtimeConfig";

// const getUserId = () => {
//   const userId = localStorage.getItem("userId");

//   if (!userId) {
//     throw new Error("User not found");
//   }

//   return userId;
// };

// export const FileService = {
//   async getFile(id: string) {
//     const res = await fetch(`${apiBaseUrl}/pages/${id}`, {
//       headers: {
//         "x-user-id": getUserId(),
//       },
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch page");
//     }

//     return res.json();
//   },

//   async updateFile(
//     id: string,
//     data: {
//       title: string;
//       content: unknown;
//     }
//   ) {
//     const res = await fetch(`${apiBaseUrl}/pages/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "x-user-id": getUserId(),
//       },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to save page");
//     }

//     return res.json();
//   },
// };
import { apiBaseUrl } from "../utils/runtimeConfig";

const getUserId = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User not found");
  }

  return userId;
};

export const FileService = {
  async getFile(id: string) {
    const res = await fetch(`${apiBaseUrl}/pages/${id}`, {
      headers: {
        "x-user-id": getUserId(),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch page");
    }

    return res.json();
  },

  async updateFile(
    id: string,
    data: {
      title: string;
      content: unknown;
    }
  ) {
    const res = await fetch(`${apiBaseUrl}/pages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": getUserId(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to save page");
    }

    return res.json();
  },

  async createFile(type: "MARKDOWN" | "LIST" | "KANBAN") {
    const res = await fetch(`${apiBaseUrl}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": getUserId(),
      },
      body: JSON.stringify({
        title: "Untitled",
        type,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create page");
    }

    return res.json();
  },
};