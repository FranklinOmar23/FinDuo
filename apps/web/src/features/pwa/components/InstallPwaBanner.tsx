import { Download, Share2, Smartphone, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const DISMISS_KEY = "finduo-pwa-dismissed";

const isStandaloneDisplay = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
};

const isIos = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

export const InstallPwaBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(isStandaloneDisplay());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      window.localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const showIosGuide = useMemo(() => !installed && isIos(), [installed]);
  const shouldShow = !installed && !dismissed && (Boolean(deferredPrompt) || showIosGuide);

  if (!shouldShow) {
    return null;
  }

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "1");
    }

    setDismissed(true);
  };

  const install = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="phone-card mb-4 overflow-hidden border-teal/20 bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(15,118,110,0.04))] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-white">
            <Smartphone className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="theme-heading text-sm font-semibold">Instala FinDúo en tu celular</p>
            <p className="theme-muted mt-1 text-sm">
              {deferredPrompt
                ? "Ábrela como una app, con acceso rápido desde la pantalla de inicio."
                : "En iPhone usa Compartir y luego Agregar a pantalla de inicio para instalarla."}
            </p>
          </div>
        </div>
        <button className="theme-soft-button flex h-8 w-8 items-center justify-center rounded-full" onClick={dismiss}>
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {deferredPrompt ? (
          <button className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white" onClick={() => void install()}>
            <Download className="h-4 w-4" strokeWidth={2} />
            Instalar app
          </button>
        ) : null}

        {showIosGuide ? (
          <div className="theme-outline-button inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">
            <Share2 className="h-4 w-4" strokeWidth={1.9} />
            Safari → Compartir → Agregar a inicio
          </div>
        ) : null}
      </div>
    </div>
  );
};