import type { ApiResponse, Contribution } from "@finduo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useCoupleStore } from "../../../store/coupleStore";

export const useContributions = () => {
  const queryClient = useQueryClient();
  const activeCouple = useCoupleStore((state) => state.activeCouple);

  const invalidateFinanceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["contributions"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    ]);
  };

  const contributionsQuery = useQuery({
    queryKey: ["contributions"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ data: Contribution[]; pagination: any }>>("/contributions");
      return response.data.data.data; // Extraer array del objeto con paginación
    },
    enabled: Boolean(activeCouple),
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true
  });

  const addContributionMutation = useMutation({
    mutationFn: async (payload: { amount: number; contributionDate: string; note?: string }) => {
      const response = await api.post<ApiResponse<Contribution>>("/contributions", payload);
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  const deleteContributionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<{ deleted: boolean; id: string }>>(`/contributions/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  return {
    contributionsQuery,
    addContributionMutation,
    deleteContributionMutation
  };
};
