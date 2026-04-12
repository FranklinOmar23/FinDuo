import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["favicon.svg", "icons/icon-192x192.svg", "icons/icon-512x512.svg"],
      manifest: {
        name: "FinDúo",
        short_name: "FinDúo",
        description: "PWA de finanzas para parejas con soporte offline",
        theme_color: "#0f766e",
        background_color: "#f5efe4",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "es",
        icons: [
          {
            src: "/icons/icon-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable"
          },
          {
            src: "/icons/icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      injectManifest: {
        swSrc: resolve(__dirname, "src/sw.ts")
      },
      devOptions: {
        enabled: true,
        type: "module"
      },
      disable: false
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    port: 5173
  }
}));
