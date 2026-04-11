import type { SavingsGoal } from "@finduo/types";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";

interface GoalCardProps {
  goal: SavingsGoal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl text-pine">{goal.name}</h3>
          <p className="text-sm text-pine/70">Meta: ${goal.targetAmount.toFixed(2)}</p>
        </div>
        <span className="text-xs uppercase tracking-[0.14em] text-pine/60">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "Sin fecha"}</span>
      </div>
      <ProgressBar value={goal.currentAmount} total={goal.targetAmount} />
    </Card>
  );
};
