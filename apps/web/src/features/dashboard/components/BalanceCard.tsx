import { Card } from "../../../components/ui/Card";

interface BalanceCardProps {
  income: number;
  available: number;
}

export const BalanceCard = ({ income, available }: BalanceCardProps) => {
  return (
    <Card className="bg-pine text-white">
      <p className="text-sm uppercase tracking-[0.18em] text-white/70">Balance mensual</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-sm text-white/70">Ingresos</p>
          <h2 className="font-display text-4xl">${income.toFixed(2)}</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/70">Disponible</p>
          <p className="text-2xl font-semibold">${available.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};
