import { HandCoins, Home, PiggyBank, ReceiptText, Sparkles, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STORAGE_KEY_PREFIX = "finduo-tour-seen";

export interface AppTourStep {
  id: string;
  title: string;
  description: string;
  accent: string;
  icon: LucideIcon;
}

export const appTourSteps: AppTourStep[] = [
  {
    id: "welcome",
    title: "Bienvenidos a FinDúo",
    description:
      "Esta plataforma existe para incentivar el ahorro en pareja, bajar la loquera financiera y ayudarles a cuidarse entre ustedes sin perder de vista sus metas.",
    accent: "Empiecen con acuerdos claros y dejen que la app les ayude a no soltarse del plan.",
    icon: Sparkles
  },
  {
    id: "home",
    title: "Inicio",
    description:
      "Aquí ven el disponible del mes, sus aportes, las metas activas y el resumen rápido de cómo va la quincena o el mes.",
    accent: "Es la vista para revisar si todavía van bien o si ya toca apretar el gasto.",
    icon: Home
  },
  {
    id: "expenses",
    title: "Gastos",
    description:
      "En esta ventana registran cada gasto, lo categorizan y revisan en qué se está yendo el dinero compartido.",
    accent: "Si anotan todo aquí, dejan de gastar a ciegas.",
    icon: ReceiptText
  },
  {
    id: "balance",
    title: "Balance",
    description:
      "Balance les muestra cuánto ha puesto cada quien, pagos recientes y cómo va la proporción entre ambos para que todo sea más justo.",
    accent: "Sirve para evitar enredos y reclamos porque todo queda visible.",
    icon: HandCoins
  },
  {
    id: "savings",
    title: "Ahorro",
    description:
      "Aquí crean metas, registran abonos y siguen el avance de cada objetivo, sabiendo que cada abono baja el disponible real del mes.",
    accent: "Es donde convierten los planes en progreso medible.",
    icon: PiggyBank
  },
  {
    id: "profile",
    title: "Perfil",
    description:
      "Desde Perfil pueden ajustar la experiencia, compartir invitaciones y revisar la configuración general de su espacio en pareja.",
    accent: "Desde aquí coordinan la cuenta y mantienen a ambos conectados dentro de FinDúo.",
    icon: UserRound
  }
];

export const hasSeenAppTour = (userId: string) => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(`${STORAGE_KEY_PREFIX}:${userId}`) === "1";
};

export const markAppTourAsSeen = (userId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`${STORAGE_KEY_PREFIX}:${userId}`, "1");
};