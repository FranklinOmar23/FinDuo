import type { ApiResponse, DashboardSummary } from "@finduo/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useCoupleStore } from "../../../store/coupleStore";

export const useDashboard = () => {
  const activeCouple = useCoupleStore((state) => state.activeCouple);

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DashboardSummary>>("/dashboard");
      return response.data.data;
    },
    enabled: Boolean(activeCouple),
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true
  });
};
