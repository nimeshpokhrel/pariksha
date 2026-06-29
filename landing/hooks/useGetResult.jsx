import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "@/lib/config";

export const useGetResult = () => {
  return useMutation({
    mutationKey: ["result"],
    mutationFn: async ({ mocktest, symbol_no }) => {
      const response = await fetch(`${apiUrl}/result/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mocktest, symbolNo: symbol_no }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch result");
      }
      return data;
    },
  });
};
