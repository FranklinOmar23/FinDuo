import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useToastStore, type ToastTone } from "../../store/toastStore";

const toneStyles: Record<ToastTone, { icon: ComponentType<SVGProps<SVGSVGElement>>; accent: string; surface: string; text: string }> = {
  info: {
    icon: Info,
    accent: "bg-teal/15 text-teal",
    surface: "from-white/96 via-[#effbf9]/96 to-[#ddf5f0]/92",
    text: "text-[#164b4d]"
  },
  success: {
    icon: CircleCheck,
    accent: "bg-emerald-500/15 text-emerald-600",
    surface: "from-white/96 via-[#edfdf5]/96 to-[#daf7e8]/92",
    text: "text-[#154734]"
  },
  error: {
    icon: CircleAlert,
    accent: "bg-coral/15 text-coral",
    surface: "from-white/96 via-[#fff4f1]/96 to-[#ffe4de]/92",
    text: "text-[#6f2e26]"
  }
};

export const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4" aria-live="polite" aria-atomic="true">
      <div className="flex w-full max-w-md flex-col gap-3">
        {toasts.map((toast) => {
          const tone = toneStyles[toast.tone];
          const Icon = tone.icon;

          return (
            <article
              key={toast.id}
              className={`pointer-events-auto overflow-hidden rounded-[26px] border border-white/70 bg-gradient-to-br ${tone.surface} p-4 shadow-[0_18px_45px_rgba(19,47,52,0.18)] backdrop-blur`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tone.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-display text-base leading-tight ${tone.text}`}>{toast.title}</p>
                  <p className="mt-1 text-sm leading-5 text-[#54706f]">{toast.message}</p>
                </div>
                <button
                  className="theme-soft-button inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/60 text-[#54706f] transition hover:scale-[1.02]"
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Cerrar notificación"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};