import { RouterProvider } from "react-router-dom";
import { ToastViewport } from "./components/ui/ToastViewport";
import { UpdatePwaBanner } from "./features/pwa/components/UpdatePwaBanner";
import { router } from "./router";

export default function App() {
  return (
    <>
      <UpdatePwaBanner />
      <RouterProvider router={router} />
      <ToastViewport />
    </>
  );
}
