import type { Expense } from "@finduo/types";
import { Card } from "../../../components/ui/Card";
import { ExpenseItem } from "./ExpenseItem";

interface ExpensesListProps {
  items: Expense[];
}

export const ExpensesList = ({ items }: ExpensesListProps) => {
  return (
    <Card>
      <h3 className="font-display text-2xl text-pine">Gastos del mes</h3>
      <div className="mt-4 space-y-3">
        {items.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </Card>
  );
};
