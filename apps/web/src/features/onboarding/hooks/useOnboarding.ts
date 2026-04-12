import type { ApiResponse, CoupleSummary } from "@finduo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "../../../lib/api";
import { useCoupleStore } from "../../../store/coupleStore";
import { clearSoloMode } from "../lib/soloMode";

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const setActiveCouple = useCoupleStore((state) => state.setActiveCouple);

  useQuery({
    queryKey: ["couple", "me"],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<CoupleSummary | null>>("/couples/me");
        setActiveCouple(response.data.data);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          setActiveCouple(null);
          return null;
        }

        throw error;
      }
    },
    retry: false
  });

  const createCoupleMutation = useMutation({
    mutationFn: async (payload: { name: string; savingsPercent: number }) => {
      const response = await api.post<ApiResponse<CoupleSummary>>("/couples", payload);
      return response.data.data;
    },
    onSuccess: (couple) => {
      clearSoloMode();
      setActiveCouple(couple);
      void queryClient.invalidateQueries({ queryKey: ["couple", "me"] });
    }
  });

  const joinCoupleMutation = useMutation({
    mutationFn: async (payload: { inviteCode: string }) => {
      const response = await api.post<ApiResponse<CoupleSummary>>("/couples/join", payload);
      return response.data.data;
    },
    onSuccess: (couple) => {
      clearSoloMode();
      setActiveCouple(couple);
      void queryClient.invalidateQueries({ queryKey: ["couple", "me"] });
    }
  });

  return {
    activeCouple,
    createCoupleMutation,
    joinCoupleMutation
  };
};