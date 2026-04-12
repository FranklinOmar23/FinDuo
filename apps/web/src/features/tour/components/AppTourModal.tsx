import "driver.js/dist/driver.css";
import { driver } from "driver.js";
import { useEffect, useMemo, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MoneyMascotIllustration } from "../../mascot/components/MoneyMascotIllustration";
import { getAppTourSteps } from "../lib/appTour";

interface AppTourModalProps {
  open: boolean;
  onClose: () => void;
  userName?: string | null;
  isSolo?: boolean;
}

export const AppTourModal = ({ open, onClose, userName, isSolo }: AppTourModalProps) => {
  const appTourSteps = useMemo(() => getAppTourSteps(userName, isSolo), [isSolo, userName]);
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);
  const closeHandledRef = useRef(false);

  useEffect(() => {
    if (!open) {
      driverRef.current?.destroy();
      driverRef.current = null;
      return;
    }

    closeHandledRef.current = false;

    const finishTour = () => {
      if (closeHandledRef.current) {
        return;
      }

      closeHandledRef.current = true;
      onClose();
    };

    const mascotMarkup = renderToStaticMarkup(
      <MoneyMascotIllustration size="sm" className="finduo-driver-mascot-figure" />
    );

    const tour = driver({
      animate: true,
      allowClose: true,
      overlayOpacity: 0.7,
      stagePadding: 12,
      stageRadius: 24,
      showProgress: true,
      showButtons: ["previous", "next", "close"],
      prevBtnText: "Atrás",
      nextBtnText: "Siguiente",
      doneBtnText: "Entrarle",
      popoverClass: "finduo-driver-popover",
      steps: appTourSteps.map((step) => ({
        element: step.element,
        popover: {
          title: step.title,
          description: step.description,
          side: step.id === "welcome" ? "bottom" : "top",
          align: step.id === "welcome" ? "start" : "center"
        }
      })),
      onPopoverRender: (popover, { state }) => {
        const step = appTourSteps[state.activeIndex ?? 0];

        if (!step) {
          return;
        }

        popover.wrapper.querySelector(".finduo-driver-hero")?.remove();
        popover.description.querySelector(".finduo-driver-accent")?.remove();

        const hero = document.createElement("div");
        hero.className = "finduo-driver-hero";
        hero.innerHTML = `
          <div class="finduo-driver-copy">
            <p class="finduo-driver-eyebrow">Tour guiado</p>
            <p class="finduo-driver-hook">${step.id === "welcome" ? "Te llevo de la mano por la app." : "Aqui es donde tienes que poner el ojo."}</p>
            <div class="finduo-driver-badge">
              <span class="finduo-driver-coin">$</span>
              <span>Se&ntilde;or Dinero</span>
            </div>
          </div>
          <div class="finduo-driver-illustration mascot-bob">${mascotMarkup}</div>
        `;

        popover.title.parentElement?.insertBefore(hero, popover.title);

        const accent = document.createElement("p");
        accent.className = "finduo-driver-accent";
        accent.textContent = step.accent;
        popover.description.appendChild(accent);
      },
      onDestroyed: () => {
        driverRef.current = null;
        finishTour();
      }
    });

    driverRef.current = tour;

    const timer = window.setTimeout(() => {
      if (driverRef.current === tour) {
        tour.drive();
      }
    }, 80);

    return () => {
      window.clearTimeout(timer);

      if (driverRef.current === tour) {
        tour.destroy();
      }
    };
  }, [appTourSteps, onClose, open]);

  return null;
};