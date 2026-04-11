import type { ApiResponse, DashboardSummary } from "@finduo/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DashboardSummary>>("/dashboard");
      return response.data.data;
    },
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true
  });
};
