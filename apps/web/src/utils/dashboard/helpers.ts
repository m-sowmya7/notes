export const getFolderColor = (type?: string) => {
  switch (type) {
    case "MARKDOWN":
      return "#a8c48b";
    case "LIST":
      return "#8fc2ef";
    case "KANBAN":
      return "#d7a2dc";
    default:
      return "#cfcfcf";
  }
};

export const formatEditedTime = (dateString?: string) => {
  if (!dateString) return "Recently created";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 60) return `Edited ${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Edited ${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `Edited ${diffDays} day ago`;
};

export type SortOption = "recent" | "oldest" | "az" | "za" | "type";

export const SORT_LABELS: Record<SortOption, string> = {
  recent: "Last Modified",
  oldest: "Oldest First",
  az: "A → Z",
  za: "Z → A",
  type: "By Page Type",
};