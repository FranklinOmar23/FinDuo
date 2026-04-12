export interface ReleaseNoteRow {
  area: string;
  change: string;
  impact: "Alta" | "Media" | "Baja";
}

export interface ReleaseNotes {
  version: string;
  headline: string;
  summary: string;
  rows: ReleaseNoteRow[];
}

export const currentReleaseNotes: ReleaseNotes = {
  version: "v0.1.0",
  headline: "Nueva actualización disponible",
  summary: "Hay una versión nueva de FinDúo lista para instalar. Actualiza para cargar los cambios más recientes.",
  rows: [
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
  ]
};