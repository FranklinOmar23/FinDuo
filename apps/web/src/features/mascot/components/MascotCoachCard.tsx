import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { MoneyMascotIllustration } from "./MoneyMascotIllustration";

type MascotMode = "solo" | "couple";

interface MascotCoachCardProps {
  title: string;
  message: string;
  accent?: string;
  mode?: MascotMode;
  onDismiss?: () => void;
}

const modeCopy: Record<MascotMode, { label: string; motivation: string }> = {
  solo: {
    label: "Modo solo",
    motivation: "Tu disciplina manda el ritmo. Cada peso bien puesto te hace mas fuerte."
  },
  couple: {
    label: "Modo pareja",
    motivation: "Cuando los dos jalan parejo, el dinero deja de ser pleito y se vuelve plan."
  }
};

export const MascotCoachCard = ({ title, message, accent, mode = "solo", onDismiss }: MascotCoachCardProps) => {
  const [dismissed, setDismissed] = useState(false);
  const modeContent = modeCopy[mode];

  if (dismissed) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4">
      <div className="pointer-events-auto ml-auto flex w-fit max-w-[280px] flex-col items-end mascot-float-in">
        <div className="relative w-[calc(100vw-8rem)] min-w-[220px] max-w-[260px] rounded-[24px] border border-[#e8d8a6] bg-[linear-gradient(135deg,#fff9ea_0%,#fff1ca_100%)] px-4 pb-4 pt-3 shadow-[0_16px_36px_rgba(110,83,17,0.18)]">
          <button
            aria-label="Ocultar al Señor Dinero"
            className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#9d6b12] transition hover:bg-white"
            type="button"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.1} />
          </button>

          <div className="pr-9">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffcf5f] text-[#a86f05] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.3} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#a77813" }}>Señor Dinero</p>
              <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-semibold" style={{ color: "#8a6517" }}>
                {modeContent.label}
              </span>
            </div>

            <h3 className="mt-2 font-display text-[28px] leading-[1.02]" style={{ color: "#6e4c0f" }}>{title}</h3>
            <p className="mt-3 text-[15px] leading-6" style={{ color: "#6a5423" }}>{message}</p>
            <p className="mt-3 text-[13px] font-semibold leading-5" style={{ color: "#9d6b12" }}>
              {modeContent.motivation}
            </p>
            {accent ? (
              <p className="mt-3 rounded-[18px] bg-white/80 px-3 py-2 text-[13px] font-medium leading-5" style={{ color: "#8a6517" }}>
                {accent}
              </p>
            ) : null}
          </div>

          <div className="absolute -bottom-3 right-8 h-5 w-5 rotate-45 border-b border-r border-[#e8d8a6] bg-[#fff1ca]" />
        </div>

        <div className="relative -mt-1 mr-2 w-[78px] shrink-0 mascot-bob">
          <MoneyMascotIllustration className="drop-shadow-[0_16px_26px_rgba(41,93,18,0.3)]" />
        </div>
      </div>
    </div>
  );
};