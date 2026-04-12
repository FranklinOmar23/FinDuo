import type { ApiResponse, CoupleSummary } from "@finduo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { clearPendingInviteCode, getPendingInviteCode } from "../../features/couples/lib/pendingInvite";
import { InstallPwaBanner } from "../../features/pwa/components/InstallPwaBanner";
import { AppTourModal } from "../../features/tour/components/AppTourModal";
import { hasSeenAppTour, markAppTourAsSeen } from "../../features/tour/lib/appTour";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { useCoupleStore } from "../../store/coupleStore";
import { BottomNav } from "./BottomNav";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const setActiveCouple = useCoupleStore((state) => state.setActiveCouple);
  const pendingInviteCode = getPendingInviteCode();
  const [tourOpen, setTourOpen] = useState(false);

  const coupleQuery = useQuery({
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

  const autoJoinMutation = useMutation({
    mutationFn: async (inviteCode: string) => {
      const response = await api.post<ApiResponse<CoupleSummary>>("/couples/join", { inviteCode });
      return response.data.data;
    },
    onSuccess: (couple) => {
      setActiveCouple(couple);
      clearPendingInviteCode();
    }
  });

  useEffect(() => {
    if (activeCouple && pendingInviteCode) {
      clearPendingInviteCode();
      return;
    }

    if (!pendingInviteCode || activeCouple || coupleQuery.isLoading || autoJoinMutation.isPending) {
      return;
    }

    if (coupleQuery.data === null) {
      autoJoinMutation.mutate(pendingInviteCode, {
        onError: () => {
          clearPendingInviteCode();
        }
      });
    }
  }, [activeCouple, autoJoinMutation, coupleQuery.data, coupleQuery.isLoading, pendingInviteCode]);

  useEffect(() => {
    if (!user?.id || !activeCouple || location.pathname === "/onboarding") {
      return;
    }

    if (!hasSeenAppTour(user.id)) {
      setTourOpen(true);
    }
  }, [activeCouple, location.pathname, user?.id]);

  const handleTourClose = () => {
    if (user?.id) {
      markAppTourAsSeen(user.id);
    }

    setTourOpen(false);
  };

  if (coupleQuery.isLoading || autoJoinMutation.isPending) {
    return (
      <div className="page-shell relative items-center justify-center">
        <div className="phone-card w-full p-6 text-center text-sm text-[#708381]">{autoJoinMutation.isPending ? "Vinculando la invitación con tu cuenta..." : "Cargando tu espacio compartido..."}</div>
      </div>
    );
  }

  if (activeCouple && !activeCouple.isSolo && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-shell relative">
      <main className="flex-1 space-y-4">
        <InstallPwaBanner />
        {children}
      </main>
      <BottomNav />
      <AppTourModal open={tourOpen} onClose={handleTourClose} />
    </div>
  );
};
