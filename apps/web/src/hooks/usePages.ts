import { useQuery } from "@tanstack/react-query";
import { PageService } from "../services/dashboard/page.service"

export function usePages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: PageService.getPages,
  });
}