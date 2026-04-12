import { RefreshCw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { registerSW } from "virtual:pwa-register";

const updateSummaryRows = [
  {
    area: "Modo solo",
    change: "Correcciones para aportes, gastos y metas personales",
    impact: "Alta"
  },
  {
    area: "PWA",
    change: "Aviso visible cuando hay una nueva versión disponible",
    impact: "Media"
  },
  {
    area: "UX",
    change: "Mejoras en modales, perfil y formularios en tema oscuro",
    impact: "Media"
  }
];

export const UpdatePwaBanner = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const updateServiceWorker = useMemo(
    () =>
      registerSW({
        immediate: true,
        onNeedRefresh() {
          setNeedRefresh(true);
          setDismissed(false);
        }
      }),
    []
  );

  if (!needRefresh || dismissed) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[26px] border border-teal/20 bg-[linear-gradient(135deg,rgba(15,118,110,0.18),rgba(15,118,110,0.08))] p-4 shadow-[0_18px_45px_rgba(19,47,52,0.22)] backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-white">
              <RefreshCw className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="theme-heading text-sm font-semibold">Nueva actualización disponible</p>
              <p className="theme-muted mt-1 text-sm">Hay una versión nueva de FinDúo lista para instalar. Actualiza para cargar los cambios más recientes.</p>
            </div>
          </div>
          <button className="theme-soft-button flex h-8 w-8 items-center justify-center rounded-full" type="button" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-[20px] border border-teal/15 bg-white/50 dark:bg-black/10">
          <div className="grid grid-cols-[0.9fr_2fr_auto] gap-3 border-b border-teal/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#567176]">
            <span>Área</span>
            <span>Cambio</span>
            <span>Impacto</span>
          </div>
          <div>
            {updateSummaryRows.map((row) => (
              <div key={row.area} className="grid grid-cols-[0.9fr_2fr_auto] gap-3 border-b border-teal/10 px-4 py-3 text-sm last:border-b-0">
                <span className="font-semibold text-[#185154]">{row.area}</span>
                <span className="text-[#54706f]">{row.change}</span>
                <span className="rounded-full bg-teal/12 px-2.5 py-1 text-xs font-semibold text-teal">{row.impact}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={() => void updateServiceWorker(true)}
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
            Actualizar ahora
          </button>
          <button className="theme-outline-button inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" type="button" onClick={() => setDismissed(true)}>
            Más tarde
          </button>
        </div>
      </div>
    </div>
  );
};