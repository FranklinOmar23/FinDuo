import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { appTourSteps } from "../lib/appTour";

interface AppTourModalProps {
  open: boolean;
  onClose: () => void;
}

export const AppTourModal = ({ open, onClose }: AppTourModalProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = appTourSteps[stepIndex];
  const StepIcon = currentStep.icon;
  const isLastStep = stepIndex === appTourSteps.length - 1;

  const progressLabel = useMemo(() => `${stepIndex + 1} de ${appTourSteps.length}`, [stepIndex]);

  if (!open) {
    return null;
  }

  const goNext = () => {
    if (isLastStep) {
      onClose();
      setStepIndex(0);
      return;
    }

    setStepIndex((current) => current + 1);
  };

  const goBack = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const closeTour = () => {
    onClose();
    setStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4">
      <div className="panel w-full max-w-md overflow-hidden rounded-[30px] p-0">
        <div className="relative overflow-hidden bg-teal px-5 pb-6 pt-5 text-white">
          <div className="absolute -right-4 top-2 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute right-10 top-14 h-12 w-12 rounded-full bg-white/8" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/75">Tour guiado</p>
              <h3 className="mt-2 text-2xl font-bold leading-tight">{currentStep.title}</h3>
            </div>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white" onClick={closeTour}>
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <div className="relative mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
            <StepIcon className="h-6 w-6" strokeWidth={1.9} />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="theme-heading text-base font-semibold">{currentStep.description}</p>
            <p className="theme-muted mt-3 text-sm">{currentStep.accent}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="theme-muted text-xs uppercase tracking-[0.18em]">Paso {progressLabel}</p>
            <div className="flex items-center gap-1.5">
              {appTourSteps.map((step, index) => (
                <span
                  key={step.id}
                  className={`h-2 rounded-full transition ${index === stepIndex ? "w-6 bg-teal" : "w-2 bg-[#c8d1cf]"}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
            <div className="rounded-2xl border border-[#d8d3c7] px-2 py-3 theme-heading">Inicio</div>
            <div className="rounded-2xl border border-[#d8d3c7] px-2 py-3 theme-heading">Gastos</div>
            <div className="rounded-2xl border border-[#d8d3c7] px-2 py-3 theme-heading">Balance</div>
            <div className="rounded-2xl border border-[#d8d3c7] px-2 py-3 theme-heading">Ahorro</div>
            <div className="rounded-2xl border border-[#d8d3c7] px-2 py-3 theme-heading">Perfil</div>
            <div className="rounded-2xl border border-teal/30 bg-teal/10 px-2 py-3 text-teal">Tour</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="theme-outline-button inline-flex flex-1 items-center justify-center gap-2 rounded-[16px] border px-4 py-3 text-sm font-semibold disabled:opacity-45"
              disabled={stepIndex === 0}
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
              Anterior
            </button>
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-teal px-4 py-3 text-sm font-semibold text-white" onClick={goNext}>
              {isLastStep ? <Check className="h-4 w-4" strokeWidth={2} /> : <ArrowRight className="h-4 w-4" strokeWidth={2} />}
              {isLastStep ? "Empezar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};