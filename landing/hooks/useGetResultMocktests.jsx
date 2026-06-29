import { apiUrl } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";

export const useGetResultMocktests = () => {
  return useQuery({
    queryKey: ["resultMocktests"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/result/mocktests`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};