import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useExpenses } from "../hooks/useExpenses";

interface AddExpenseFormProps {
  onSuccess?: () => void;
}

export const AddExpenseForm = ({ onSuccess }: AddExpenseFormProps) => {
  const { addExpenseMutation } = useExpenses();
  const categories = [
    { value: "entretenimiento", label: "Entretenimiento" },
    { value: "salidas", label: "Salidas" },
    { value: "supermercado", label: "Supermercado" },
    { value: "transporte", label: "Transporte" },
    { value: "servicios", label: "Servicios" },
    { value: "salud", label: "Salud" },
    { value: "imprevistos", label: "Imprevistos" },
    { value: "otros", label: "Otros" }
  ];
  const [form, setForm] = useState({ title: "", amount: "", category: "otros" });
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addExpenseMutation.mutateAsync({
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      expenseDate: new Date().toISOString()
    });
    setForm({ title: "", amount: "", category: "otros" });
    setCategoryMenuOpen(false);
    onSuccess?.();
  };

  const selectedCategory = categories.find((item) => item.value === form.category)?.label ?? "Otros";

  return (
    <Card>
      <form className="space-y-4" onSubmit={submit}>
        <Input
          label="Concepto"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
        />
        <Input
          label="Monto"
          type="number"
          value={form.amount}
          onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          <span>Categoría</span>
          <div className="relative">
            <button
              className="theme-input flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left outline-none transition focus:border-teal"
              type="button"
              onClick={() => setCategoryMenuOpen((current) => !current)}
            >
              <span>{selectedCategory}</span>
              <ChevronDown className={`h-4 w-4 transition ${categoryMenuOpen ? "rotate-180" : ""}`} strokeWidth={2} />
            </button>
            {categoryMenuOpen ? (
              <div className="theme-elevated-surface absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-teal/15 shadow-xl">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${form.category === category.value ? "bg-teal text-white" : "theme-heading hover:bg-black/5 dark:hover:bg-white/5"}`}
                    type="button"
                    onClick={() => {
                      setForm((current) => ({ ...current, category: category.value }));
                      setCategoryMenuOpen(false);
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </label>
        <Button className="w-full" type="submit" variant="secondary">Registrar gasto</Button>
      </form>
    </Card>
  );
};
