import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageService } from "../services/dashboard/page.service"

export function useToggleStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PageService.toggleStar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pages"],
      });
    },
  });
}