import { useState } from "react";
import { Crosshair, Plus, Trash2 } from "lucide-react";
import { AddGoalForm } from "../components/AddGoalForm";
import { Modal } from "../../../components/ui/Modal";
import { MascotCoachCard } from "../../mascot/components/MascotCoachCard";
import { markMascotEventSeen, shouldShowMascotEvent } from "../../mascot/lib/mascotGuide";
import { useSavings } from "../hooks/useSavings";
import { useAuthStore } from "../../../store/authStore";
import { useCoupleStore } from "../../../store/coupleStore";

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
};

export const SavingsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const user = useAuthStore((state) => state.user);
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const { savingsQuery, updateAmountMutation, deleteGoalMutation } = useSavings();
  const goals = savingsQuery.data ?? [];
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalReserved = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const highlightedGoal = goals[0] ?? null;
  const highlightedGoalPercent = highlightedGoal && highlightedGoal.targetAmount > 0 ? Math.round((highlightedGoal.currentAmount / highlightedGoal.targetAmount) * 100) : 0;

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? null;

  const mascotSavingsMessage = (() => {
    if (!user?.id || !highlightedGoal) {
      return null;
    }

    if (highlightedGoalPercent >= 100 && shouldShowMascotEvent(user.id, `goal-${highlightedGoal.id}-100`, 9999)) {
      return {
        key: `goal-${highlightedGoal.id}-100`,
        title: activeCouple?.isSolo ? "Meta cerrada, crack" : "Meta cerrada, dupla firme",
        message: activeCouple?.isSolo
          ? `La meta ${highlightedGoal.name} ya está completa. El mérito es tuyo por aguantar el plan sin soltarlo.`
          : `La meta ${highlightedGoal.name} ya está completa. El Señor Dinero aprueba esa coordinación en pareja.`,
        accent: activeCouple?.isSolo
          ? "Aprovecha el envión: quien cumple una meta solo, ya sabe construir la siguiente."
          : "Saque otra meta mientras el impulso de los dos sigue caliente."
      };
    }

    if (highlightedGoalPercent >= 50 && shouldShowMascotEvent(user.id, `goal-${highlightedGoal.id}-50`, 9999)) {
      return {
        key: `goal-${highlightedGoal.id}-50`,
        title: activeCouple?.isSolo ? "Vas muy bien" : "Van muy bien",
        message: activeCouple?.isSolo
          ? `Tu meta ${highlightedGoal.name} ya cruzó la mitad con ${highlightedGoalPercent}%. Sigue así, que vas construyendo confianza contigo.`
          : `La meta ${highlightedGoal.name} ya cruzó la mitad con ${highlightedGoalPercent}%. Cuando los dos sostienen el ritmo, el progreso se nota de verdad.`,
        accent: activeCouple?.isSolo
          ? "Ese porcentaje ya no es promesa, ya es progreso serio hecho por ti."
          : "Ese porcentaje ya no es promesa, ya es progreso serio de equipo."
      };
    }

    return null;
  })();

  const submitDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedGoal) {
      return;
    }

    await updateAmountMutation.mutateAsync({
      id: selectedGoal.id,
      currentAmount: selectedGoal.currentAmount + Number(depositAmount)
    });

    setDepositAmount("");
    setSelectedGoalId(null);
  };

  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between pt-2">
        <div>
          <h1 className="phone-title">Ahorro</h1>
          <p className="phone-subtitle">Metas y progreso</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" strokeWidth={2.4} />
          Nueva meta
        </button>
      </header>

      <article className="relative overflow-hidden rounded-[22px] bg-teal p-5 text-white">
        <div className="absolute right-2 top-2 h-16 w-16 rounded-full bg-white/10" />
        <p className="text-sm font-semibold text-white/85">Ahorro automático del mes</p>
        <p className="mt-2 text-5xl font-bold leading-none">{formatMoney(totalCurrent)}</p>
        <p className="mt-3 text-sm text-white/85">10% de los aportes mensuales</p>
      </article>

      <article className="phone-card grid grid-cols-2 gap-4 p-4">
        <div>
          <p className="text-xs text-[#8a9896]">Total en metas</p>
          <p className="mt-1 text-3xl font-bold text-[#17373c]">{formatMoney(totalCurrent)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#8a9896]">Metas activas</p>
          <p className="mt-1 text-3xl font-bold text-[#17373c]">{goals.length}</p>
        </div>
      </article>

      {mascotSavingsMessage ? (
        <MascotCoachCard
          title={mascotSavingsMessage.title}
          message={mascotSavingsMessage.message}
          accent={mascotSavingsMessage.accent}
          mode={activeCouple?.isSolo ? "solo" : "couple"}
          onDismiss={() => {
            if (user?.id) {
              markMascotEventSeen(user.id, mascotSavingsMessage.key);
            }
          }}
        />
      ) : null}

      <div>
        <h2 className="mb-3 text-base font-semibold text-[#17373c]">Mis metas</h2>
        {goals.map((goal) => {
          const percent = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;

          return (
            <article key={goal.id} className="phone-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4e6] text-[#ef7d4d]"><Crosshair className="h-5 w-5" strokeWidth={2} /></div>
                  <div>
                    <p className="font-semibold text-[#17373c]">{goal.name}</p>
                    <p className="text-sm text-[#8aa0a2]">{formatMoney(goal.currentAmount)} de {formatMoney(goal.targetAmount)}</p>
                  </div>
                </div>
                <button className="text-[#9ca7a6]" onClick={() => deleteGoalMutation.mutate(goal.id)}><Trash2 className="h-4 w-4" strokeWidth={1.9} /></button>
              </div>
              <div className="mt-4 h-2 rounded-full bg-[#d8e8e7]">
                <div className="h-2 rounded-full bg-teal" style={{ width: `${Math.min(percent, 100)}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#8a9896]">Progreso</span>
                <span className="font-semibold text-[#4d8ea0]">{percent}%</span>
              </div>
              <button className="mt-3 w-full rounded-full border border-[#b6d6da] py-2 text-sm font-semibold text-[#4a8f96]" onClick={() => setSelectedGoalId(goal.id)}>
                + Abonar
              </button>
            </article>
          );
        })}
      </div>

      <Modal open={open} title="Nueva meta de ahorro" onClose={() => setOpen(false)}>
        <AddGoalForm onSuccess={() => setOpen(false)} />
      </Modal>

      <Modal open={Boolean(selectedGoal)} title="Abonar a la meta" onClose={() => setSelectedGoalId(null)}>
        <form className="space-y-4" onSubmit={submitDeposit}>
          <p className="text-sm text-[#8a9896]">Meta seleccionada: {selectedGoal?.name}</p>
          <input
            className="w-full rounded-full border border-[#d7d1c5] px-4 py-3 outline-none"
            placeholder="Monto a abonar"
            type="number"
            value={depositAmount}
            onChange={(event) => setDepositAmount(event.target.value)}
          />
          <button className="w-full rounded-full bg-teal py-3 text-sm font-semibold text-white" type="submit">
            Guardar abono
          </button>
          <button className="w-full rounded-full border border-[#d7d1c5] py-3 text-sm font-semibold text-[#17373c]" type="button" onClick={() => setSelectedGoalId(null)}>
            Cancelar
          </button>
        </form>
      </Modal>
    </section>
  );
};
