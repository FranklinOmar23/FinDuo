import { BellRing, CheckCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";

const DISMISS_KEY = "finduo-notification-permission-dismissed";

const supportsNotifications = () => {
  return typeof window !== "undefined" && "Notification" in window;
};

const showActivationConfirmation = async () => {
  if (typeof window === "undefined" || Notification.permission !== "granted") {
    return;
  }

  const title = "Notificaciones activadas";
  const body = "FinDúo te avisará cuando haya gastos, aportes o avances importantes en sus metas.";

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.svg",
      badge: "/icons/icon-192x192.svg",
      tag: "finduo-notifications-enabled",
      data: {
        url: "/"
      }
    });
  } catch {
    const notification = new Notification(title, { body });
    notification.onclick = () => {
      window.focus();
      window.location.assign("/");
      notification.close();
    };
  }
};

export const NotificationPermissionBanner = () => {
  const user = useAuthStore((state) => state.user);
  const [dismissed, setDismissed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(() => (supportsNotifications() ? Notification.permission : "denied"));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    setPermission(supportsNotifications() ? Notification.permission : "denied");
  }, []);

  if (!user || !supportsNotifications() || permission !== "default" || dismissed) {
    return null;
  }

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const enableNotifications = async () => {
    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);

    if (nextPermission === "granted") {
      window.localStorage.removeItem(DISMISS_KEY);
      await showActivationConfirmation();
      return;
    }

    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[26px] border border-teal/20 bg-[linear-gradient(135deg,rgba(15,118,110,0.18),rgba(15,118,110,0.06))] p-4 shadow-[0_18px_45px_rgba(19,47,52,0.22)] backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-white">
              <BellRing className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="theme-heading text-sm font-semibold">Activa notificaciones de FinDúo</p>
                <span className="rounded-full bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-teal">PWA</span>
              </div>
              <p className="theme-muted mt-1 text-sm">Te avisaremos cuando tu pareja registre un gasto o un aporte y cuando una meta compartida llegue al 50% o al 100%.</p>
            </div>
          </div>
          <button className="theme-soft-button flex h-8 w-8 items-center justify-center rounded-full" type="button" onClick={dismiss}>
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white" type="button" onClick={() => void enableNotifications()}>
            <CheckCheck className="h-4 w-4" strokeWidth={2} />
            Permitir avisos
          </button>
          <button className="theme-outline-button inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" type="button" onClick={dismiss}>
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
};