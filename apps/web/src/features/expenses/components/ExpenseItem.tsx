import type { Expense } from "@finduo/types";

interface ExpenseItemProps {
  expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  return (
    <article className="rounded-2xl bg-sand px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-pine">{expense.title}</h4>
          <p className="text-xs uppercase tracking-[0.14em] text-pine/60">{expense.category}</p>
        </div>
        <p className="font-semibold text-ink">${expense.amount.toFixed(2)}</p>
      </div>
    </article>
  );
};
