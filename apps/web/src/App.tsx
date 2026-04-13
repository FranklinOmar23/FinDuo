import { RouterProvider } from "react-router-dom";
import { ToastViewport } from "./components/ui/ToastViewport";
import { NotificationPermissionBanner } from "./features/pwa/components/NotificationPermissionBanner";
import { PwaActivityNotifications } from "./features/pwa/components/PwaActivityNotifications";
import { UpdatePwaBanner } from "./features/pwa/components/UpdatePwaBanner";
import { router } from "./router";

export default function App() {
  return (
    <>
      <PwaActivityNotifications />
      <NotificationPermissionBanner />
      <UpdatePwaBanner />
      <RouterProvider router={router} />
      <ToastViewport />
    </>
  );
}
