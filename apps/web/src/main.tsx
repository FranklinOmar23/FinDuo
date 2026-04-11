import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect } from "react";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import { useThemeStore } from "./store/themeStore";

const ThemeEffect = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.body.classList.toggle("finduo-dark", theme === "dark");
  }, [theme]);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeEffect />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
