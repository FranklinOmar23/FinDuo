import type { Contribution, Expense, SavingsGoal } from "@finduo/types";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useCoupleStore } from "../../../store/coupleStore";
import { useToastStore } from "../../../store/toastStore";
import { useContributions } from "../../contributions/hooks/useContributions";
import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useExpenses } from "../../expenses/hooks/useExpenses";

const STORAGE_KEY = "finduo-notification-state";
const MAX_TRACKED_IDS = 60;

interface NotificationState {
  expenseIdsByCouple: Record<string, string[]>;
  contributionIdsByCouple: Record<string, string[]>;
  goalMilestonesByCouple: Record<string, Record<string, number>>;
}

const emptyState = (): NotificationState => ({
  expenseIdsByCouple: {},
  contributionIdsByCouple: {},
  goalMilestonesByCouple: {}
});

const loadState = (): NotificationState => {
  if (typeof window === "undefined") {
    return emptyState();
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return emptyState();
  }

  try {
    const parsed = JSON.parse(rawValue) as NotificationState;
    return {
      expenseIdsByCouple: parsed.expenseIdsByCouple ?? {},
      contributionIdsByCouple: parsed.contributionIdsByCouple ?? {},
      goalMilestonesByCouple: parsed.goalMilestonesByCouple ?? {}
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return emptyState();
  }
};

const persistState = (state: NotificationState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
};

const mergeIds = (ids: string[]) => {
  return Array.from(new Set(ids)).slice(-MAX_TRACKED_IDS);
};

const getMilestone = (goal: SavingsGoal) => {
  if (goal.targetAmount <= 0) {
    return 0;
  }

  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);

  if (progress >= 100) {
    return 100;
  }

  if (progress >= 50) {
    return 50;
  }

  return 0;
};

const isNotificationsGranted = () => {
  return typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted";
};

const showSystemNotification = async (title: string, body: string, tag: string, url: string) => {
  if (!isNotificationsGranted()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.svg",
      badge: "/icons/icon-192x192.svg",
      tag,
      data: {
        url
      }
    });
  } catch {
    const notification = new Notification(title, { body, tag, data: { url } });
    notification.onclick = () => {
      window.focus();
      window.location.assign(url);
      notification.close();
    };
  }
};

const sortByCreatedAt = <T extends { createdAt: string }>(items: T[]) => {
  return [...items].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
};

export const PwaActivityNotifications = () => {
  const stateRef = useRef<NotificationState>(loadState());
  const user = useAuthStore((state) => state.user);
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const pushToast = useToastStore((state) => state.pushToast);
  const { expensesQuery } = useExpenses();
  const { contributionsQuery } = useContributions();
  const dashboardQuery = useDashboard();

  const updateState = (updater: (current: NotificationState) => NotificationState) => {
    const nextState = updater(stateRef.current);
    stateRef.current = nextState;
    persistState(nextState);
  };

  const coupleId = activeCouple?.id;
  const partnerMember = activeCouple?.members.find((member) => member.userId !== user?.id);
  const partnerName = partnerMember?.fullName ?? "Tu pareja";

  useEffect(() => {
    if (!coupleId || activeCouple?.isSolo || !user?.id || !expensesQuery.data) {
      return;
    }

    const partnerExpenses = sortByCreatedAt(expensesQuery.data.filter((expense) => expense.userId !== user.id));
    const storedIds = stateRef.current.expenseIdsByCouple[coupleId];
    const currentIds = partnerExpenses.map((expense) => expense.id);

    if (!storedIds) {
      updateState((current) => ({
        ...current,
        expenseIdsByCouple: {
          ...current.expenseIdsByCouple,
          [coupleId]: mergeIds(currentIds)
        }
      }));
      return;
    }

    const seenIds = new Set(storedIds);
    const unseenExpenses = partnerExpenses.filter((expense) => !seenIds.has(expense.id));

    if (!unseenExpenses.length) {
      return;
    }

    for (const expense of unseenExpenses) {
      const body = `${partnerName} registró ${expense.title} por ${formatMoney(expense.amount)}.`;
      pushToast({
        title: "Nuevo gasto registrado",
        message: body,
        tone: "info"
      });
      void showSystemNotification("Nuevo gasto en FinDúo", body, `expense-${expense.id}`, "/expenses");
    }

    updateState((current) => ({
      ...current,
      expenseIdsByCouple: {
        ...current.expenseIdsByCouple,
        [coupleId]: mergeIds([...storedIds, ...currentIds])
      }
    }));
  }, [activeCouple?.isSolo, coupleId, expensesQuery.data, partnerName, pushToast, user?.id]);

  useEffect(() => {
    if (!coupleId || activeCouple?.isSolo || !user?.id || !contributionsQuery.data) {
      return;
    }

    const partnerContributions = sortByCreatedAt(contributionsQuery.data.filter((contribution) => contribution.userId !== user.id));
    const storedIds = stateRef.current.contributionIdsByCouple[coupleId];
    const currentIds = partnerContributions.map((contribution) => contribution.id);

    if (!storedIds) {
      updateState((current) => ({
        ...current,
        contributionIdsByCouple: {
          ...current.contributionIdsByCouple,
          [coupleId]: mergeIds(currentIds)
        }
      }));
      return;
    }

    const seenIds = new Set(storedIds);
    const unseenContributions = partnerContributions.filter((contribution) => !seenIds.has(contribution.id));

    if (!unseenContributions.length) {
      return;
    }

    for (const contribution of unseenContributions) {
      const body = `${partnerName} hizo un aporte de ${formatMoney(contribution.amount)}.`;
      pushToast({
        title: "Nuevo aporte registrado",
        message: body,
        tone: "success"
      });
      void showSystemNotification("Nuevo aporte en FinDúo", body, `contribution-${contribution.id}`, "/");
    }

    updateState((current) => ({
      ...current,
      contributionIdsByCouple: {
        ...current.contributionIdsByCouple,
        [coupleId]: mergeIds([...storedIds, ...currentIds])
      }
    }));
  }, [activeCouple?.isSolo, contributionsQuery.data, coupleId, partnerName, pushToast, user?.id]);

  useEffect(() => {
    if (!coupleId || activeCouple?.isSolo || !dashboardQuery.data) {
      return;
    }

    const currentMilestones = Object.fromEntries(dashboardQuery.data.savingsGoals.map((goal) => [goal.id, getMilestone(goal)]));
    const storedMilestones = stateRef.current.goalMilestonesByCouple[coupleId];

    if (!storedMilestones) {
      updateState((current) => ({
        ...current,
        goalMilestonesByCouple: {
          ...current.goalMilestonesByCouple,
          [coupleId]: currentMilestones
        }
      }));
      return;
    }

    for (const goal of dashboardQuery.data.savingsGoals) {
      const previousMilestone = storedMilestones[goal.id] ?? 0;
      const currentMilestone = currentMilestones[goal.id] ?? 0;

      if (currentMilestone <= previousMilestone || (currentMilestone !== 50 && currentMilestone !== 100)) {
        continue;
      }

      const body = currentMilestone === 100
        ? `${goal.name} llegó al objetivo completo. Ya pueden enfocarse en la siguiente meta.`
        : `${goal.name} ya alcanzó el 50% del objetivo compartido.`;

      pushToast({
        title: currentMilestone === 100 ? "Meta completada" : "Meta en buen ritmo",
        message: body,
        tone: "success"
      });
      void showSystemNotification(
        currentMilestone === 100 ? "Meta completada en FinDúo" : "Meta al 50% en FinDúo",
        body,
        `goal-${goal.id}-${currentMilestone}`,
        "/savings"
      );
    }

    updateState((current) => ({
      ...current,
      goalMilestonesByCouple: {
        ...current.goalMilestonesByCouple,
        [coupleId]: currentMilestones
      }
    }));
  }, [activeCouple?.isSolo, coupleId, dashboardQuery.data, pushToast]);

  return null;
};