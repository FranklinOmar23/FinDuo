import type { Contribution } from "@finduo/types";
import { Avatar } from "../../../components/ui/Avatar";
import { Card } from "../../../components/ui/Card";

interface ContributionsSummaryProps {
  contributions: Contribution[];
}

export const ContributionsSummary = ({ contributions }: ContributionsSummaryProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-pine">Aportes de la quincena</h3>
        <span className="text-sm text-pine/70">{contributions.length} movimientos</span>
      </div>
      <div className="mt-4 space-y-3">
        {contributions.map((contribution) => (
          <div key={contribution.id} className="flex items-center justify-between rounded-2xl bg-sand px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={contribution.userId} />
              <div>
                <p className="font-semibold text-pine">{contribution.userId}</p>
                <p className="text-xs text-pine/70">{new Date(contribution.contributionDate).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="font-semibold text-ink">${contribution.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
