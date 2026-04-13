/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache"
  })
);

registerRoute(
  ({ request }) => request.destination === "style" || request.destination === "script" || request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: "assets-cache"
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 30
      })
    ]
  })
);

self.addEventListener("push", (event) => {
  const payload = event.data?.json() as { title?: string; body?: string; tag?: string; url?: string } | undefined;

  event.waitUntil(
    self.registration.showNotification(payload?.title ?? "FinDúo", {
      body: payload?.body ?? "Tu pareja registró un movimiento.",
      icon: "/icons/icon-192x192.svg",
      badge: "/icons/icon-192x192.svg",
      tag: payload?.tag,
      data: {
        url: payload?.url ?? "/"
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL((((event.notification.data as { url?: string } | undefined)?.url) ?? "/"), self.location.origin).toString();

  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of clients) {
      await client.focus();

      if ("navigate" in client) {
        await client.navigate(targetUrl);
      }

      return;
    }

    await self.clients.openWindow(targetUrl);
  })());
});
