import { RouterProvider } from "react-router-dom";
import { ToastViewport } from "./components/ui/ToastViewport";
import { router } from "./router";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastViewport />
    </>
  );
}
