import type { ApiResponse, SavingsGoal } from "@finduo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export const useSavings = () => {
  const queryClient = useQueryClient();

  const invalidateFinanceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["savings"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    ]);
  };

  const savingsQuery = useQuery({
    queryKey: ["savings"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SavingsGoal[]>>("/savings");
      return response.data.data;
    }
  });

  const addGoalMutation = useMutation({
    mutationFn: async (payload: { name: string; targetAmount: number; currentAmount: number; deadline?: string }) => {
      const response = await api.post<ApiResponse<SavingsGoal>>("/savings", payload);
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  const updateAmountMutation = useMutation({
    mutationFn: async (payload: { id: string; currentAmount: number }) => {
      const response = await api.patch<ApiResponse<SavingsGoal>>(`/savings/${payload.id}/amount`, {
        currentAmount: payload.currentAmount
      });
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<{ deleted: boolean; id: string }>>(`/savings/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  return {
    savingsQuery,
    addGoalMutation,
    updateAmountMutation,
    deleteGoalMutation
  };
};
