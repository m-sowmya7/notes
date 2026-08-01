import type { Participant } from "../components/live/LiveParticipants";

export type PageToolbarProps = {
  pageId: string;
  title: string;
  starred: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  isModalOpen?: boolean;
  liveParticipants?: Participant[];
};
