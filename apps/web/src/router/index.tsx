import { createHashRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { PrivateRoute } from "../components/layout/PrivateRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { BalancePage } from "../features/balance/pages/BalancePage";
import { BalanceHistoryPage } from "../features/balance/pages/BalanceHistoryPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ContributionsPage } from "../features/contributions/pages/ContributionsPage";
import { InvitePartnerPage } from "../features/couples/pages/InvitePartnerPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { ExpensesPage } from "../features/expenses/pages/ExpensesPage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { SavingsPage } from "../features/savings/pages/SavingsPage";

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/invite/:inviteCode",
    element: <InvitePartnerPage />
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/onboarding",
    element: (
      <PrivateRoute>
        <AppLayout>
          <OnboardingPage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/contributions",
    element: (
      <PrivateRoute>
        <AppLayout>
          <ContributionsPage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/expenses",
    element: (
      <PrivateRoute>
        <AppLayout>
          <ExpensesPage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/balance",
    element: (
      <PrivateRoute>
        <AppLayout>
          <BalancePage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/balance/history",
    element: (
      <PrivateRoute>
        <AppLayout>
          <BalanceHistoryPage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/savings",
    element: (
      <PrivateRoute>
        <AppLayout>
          <SavingsPage />
        </AppLayout>
      </PrivateRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </PrivateRoute>
    )
  }
]);
