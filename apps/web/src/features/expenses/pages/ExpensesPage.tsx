import { useMemo, useState } from "react";
import { AddExpenseForm } from "../components/AddExpenseForm";
import { Modal } from "../../../components/ui/Modal";
import { useExpenses } from "../hooks/useExpenses";
import { useAuthStore } from "../../../store/authStore";
import { useCoupleStore } from "../../../store/coupleStore";

const categories = ["Todos", "entretenimiento", "salidas", "supermercado", "transporte"];

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
};

export const ExpensesPage = () => {
  const [category, setCategory] = useState("Todos");
  const [open, setOpen] = useState(false);
  const { expensesQuery, deleteExpenseMutation } = useExpenses();
  const user = useAuthStore((state) => state.user);
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const isSolo = Boolean(activeCouple?.isSolo);
  const items = useMemo(() => {
    return (expensesQuery.data ?? []).filter((expense) => category === "Todos" || expense.category === category);
  }, [category, expensesQuery.data]);
  const totalSpent = items.reduce((sum, expense) => sum + expense.amount, 0);
  const monthLabel = new Intl.DateTimeFormat("es-MX", { month: "long" }).format(new Date());

  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between pt-2">
        <div>
          <h1 className="phone-title">Gastos</h1>
          <p className="phone-subtitle first-letter:uppercase">{isSolo ? `Tu flujo de ${monthLabel}` : monthLabel}</p>
        </div>
        <button className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>
          + Nuevo
        </button>
      </header>

      <article className="relative overflow-hidden rounded-[22px] bg-[#f57f51] p-5 text-white">
        <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/12" />
        <p className="text-sm font-semibold text-white/85">{isSolo ? "Total gastado por ti" : "Total gastado"}</p>
        <p className="mt-2 text-5xl font-bold leading-none">{formatMoney(totalSpent)}</p>
        <p className="mt-3 text-sm text-white/80">{items.length} movimientos</p>
      </article>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {categories.map((item) => {
            const normalized = item === "Todos" ? item : item;
            const active = category === normalized;

            return (
              <button
                key={item}
                className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize ${active ? "border-teal bg-teal text-white" : "border-[#d7d1c5] bg-white text-[#67807f]"}`}
                onClick={() => setCategory(normalized)}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((expense) => {
          const payer = activeCouple?.members.find((member) => member.userId === expense.userId);
          const payerLabel = expense.userId === user?.id ? "Tú" : (payer?.fullName ?? "Pareja");

          return (
            <article key={expense.id} className="phone-card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e5ff] text-[#9b63e3]">▣</div>
                <div>
                  <p className="font-semibold text-[#17373c]">{expense.title}</p>
                  <p className="text-xs text-[#8a9896]">{payerLabel} · {new Date(expense.expenseDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#ff5e57]">-{formatMoney(expense.amount)}</p>
                <button className="mt-1 text-xs font-semibold text-[#8a9896]" onClick={() => deleteExpenseMutation.mutate(expense.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={open} title="Registrar gasto" onClose={() => setOpen(false)}>
        <AddExpenseForm onSuccess={() => setOpen(false)} />
      </Modal>
    </section>
  );
};
