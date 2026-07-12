import { useEffect, useMemo } from "react";
import { createLiveProvider, destroyProvider } from "./provider";

export function useLiveProvider(pageId: string, enabled: boolean) {
  const live = useMemo(() => {
    if (!pageId || !enabled) return null;
    return createLiveProvider(`page:${pageId}`);
  }, [pageId, enabled]);

  useEffect(() => {
    return () => {
      if (live) destroyProvider(live.provider);
    };
  }, [live]);

  return live;
}