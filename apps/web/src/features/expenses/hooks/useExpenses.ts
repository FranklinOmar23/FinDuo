import type { ApiResponse, Expense } from "@finduo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const invalidateFinanceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["expenses"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    ]);
  };

  const expensesQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Expense[]>>("/expenses");
      return response.data.data;
    }
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (payload: { title: string; amount: number; category: string; expenseDate: string }) => {
      const response = await api.post<ApiResponse<Expense>>("/expenses", payload);
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<{ deleted: boolean; id: string }>>(`/expenses/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      void invalidateFinanceQueries();
    }
  });

  return {
    expensesQuery,
    addExpenseMutation,
    deleteExpenseMutation
  };
};
