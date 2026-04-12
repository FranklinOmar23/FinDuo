const STORAGE_KEY_PREFIX = "finduo-tour-seen";

export interface AppTourStep {
  id: string;
  element: string;
  title: string;
  description: string;
  accent: string;
}

export const getAppTourSteps = (userName?: string | null, isSolo?: boolean): AppTourStep[] => [
  {
    id: "welcome",
    element: '[data-tour="dashboard-header"]',
    title: `Hola${userName ? ` ${userName}` : ""}, soy el Señor Dinero`,
    description:
      isSolo
        ? "En modo solo tú llevas el volante completo. Yo voy a aparecer de vez en cuando para empujarte, felicitarte o jalarte las orejas si te me descuidas."
        : "En modo pareja ustedes comparten metas, decisiones y consecuencias. Yo voy a aparecer de vez en cuando para ayudarles a mantener el rumbo sin dramas financieros.",
    accent: isSolo
      ? "Mensaje del modo solo: construir paz financiera contigo mismo tambien es una victoria grande."
      : "Mensaje del modo pareja: cuando se alinean como equipo, cada abono pesa el doble en tranquilidad.",
  },
  {
    id: "home",
    element: '[data-tour="dashboard-summary"]',
    title: "Inicio",
    description:
      isSolo
        ? "Aquí ves tu disponible del mes, tus aportes, tus metas activas y el resumen rápido de cómo va tu orden financiero."
        : "Aquí ven el disponible del mes, sus aportes, las metas activas y el resumen rápido de cómo va la quincena o el mes.",
    accent: isSolo
      ? "Revísalo como tablero personal: mientras más claro lo veas, menos te saboteas."
      : "Revísenlo como tablero de equipo: si ambos lo miran, ambos sostienen el plan.",
  },
  {
    id: "expenses",
    element: '[data-tour="nav-expenses"]',
    title: "Gastos",
    description:
      isSolo
        ? "En esta ventana registras cada gasto, lo categorizas y ves con honestidad en qué se te está yendo el dinero."
        : "En esta ventana registran cada gasto, lo categorizan y revisan en qué se está yendo el dinero compartido.",
    accent: isSolo
      ? "Anotar te da control; ignorarlo te deja improvisando."
      : "Si los dos anotan aquí, dejan de gastar a ciegas y de discutir por suposiciones.",
  },
  {
    id: "balance",
    element: '[data-tour="nav-balance"]',
    title: "Balance",
    description:
      isSolo
        ? "Balance te deja ver cómo se mueve tu dinero entre aportes, gastos y reservas para que no pierdas perspectiva."
        : "Balance les muestra cuánto ha puesto cada quien, pagos recientes y cómo va la proporción entre ambos para que todo sea más justo.",
    accent: isSolo
      ? "Tu competencia aqui es tu version desordenada de ayer."
      : "Sirve para evitar enredos y reclamos porque todo queda visible y parejo.",
  },
  {
    id: "savings",
    element: '[data-tour="dashboard-savings"]',
    title: "Ahorro",
    description:
      isSolo
        ? "Aquí creas metas, registras abonos y sigues el avance de cada objetivo sabiendo que cada peso apartado es una promesa contigo."
        : "Aquí crean metas, registran abonos y siguen el avance de cada objetivo, sabiendo que cada abono baja el disponible real del mes.",
    accent: isSolo
      ? "Cada abono te prueba que sí puedes construir constancia."
      : "Es donde convierten los planes en progreso medible para los dos.",
  },
  {
    id: "profile",
    element: '[data-tour="nav-profile"]',
    title: "Perfil",
    description:
      isSolo
        ? "Desde Perfil ajustas tu experiencia, revisas tu cuenta y decides cuándo quieres pasar de tu espacio personal a uno compartido."
        : "Desde Perfil pueden ajustar la experiencia, compartir invitaciones y revisar la configuración general de su espacio en pareja.",
    accent: isSolo
      ? "Tu espacio tambien merece orden fino, aunque hoy avances por tu cuenta."
      : "Desde aqui coordinan la cuenta y mantienen a ambos conectados dentro de FinDuo.",
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