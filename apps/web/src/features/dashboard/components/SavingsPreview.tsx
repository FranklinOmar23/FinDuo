import type { SavingsGoal } from "@finduo/types";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";

interface SavingsPreviewProps {
  goals: SavingsGoal[];
}

export const SavingsPreview = ({ goals }: SavingsPreviewProps) => {
  return (
    <Card>
      <h3 className="font-display text-2xl text-pine">Metas activas</h3>
      <div className="mt-4 space-y-4">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-pine">{goal.name}</span>
              <span className="text-sm text-pine/70">${goal.currentAmount} / ${goal.targetAmount}</span>
            </div>
            <ProgressBar value={goal.currentAmount} total={goal.targetAmount} />
          </div>
        ))}
      </div>
    </Card>
  );
};
