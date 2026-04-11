import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";

interface SpendingProgressProps {
  expenses: number;
  budget: number;
}

export const SpendingProgress = ({ expenses, budget }: SpendingProgressProps) => {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl text-pine">Gasto vs presupuesto</h3>
        <p className="text-sm text-pine/70">${expenses.toFixed(2)} usados</p>
      </div>
      <ProgressBar value={expenses} total={budget} />
    </Card>
  );
};
