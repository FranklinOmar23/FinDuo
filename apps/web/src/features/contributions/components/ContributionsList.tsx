import type { Contribution } from "@finduo/types";
import { Card } from "../../../components/ui/Card";
import { useContributions } from "../hooks/useContributions";

interface ContributionsListProps {
  items: Contribution[];
}

export const ContributionsList = ({ items }: ContributionsListProps) => {
  const { deleteContributionMutation } = useContributions();

  return (
    <Card>
      <h3 className="font-display text-2xl text-pine">Historial de aportes</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-sand px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-pine">${item.amount.toFixed(2)}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-pine/70">{new Date(item.contributionDate).toLocaleDateString()}</span>
                <button className="text-xs font-semibold text-[#d14f3f]" onClick={() => deleteContributionMutation.mutate(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-pine/80">Ahorro reservado: ${item.savingsReserved.toFixed(2)}</p>
            {item.note ? <p className="mt-1 text-xs text-pine/70">{item.note}</p> : null}
          </article>
        ))}
      </div>
    </Card>
  );
};
