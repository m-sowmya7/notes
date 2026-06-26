export type Page = {
  id: string;
  title: string;
  type?: "MARKDOWN" | "LIST" | "KANBAN";
  starred?: boolean;
  updatedAt?: string;
};