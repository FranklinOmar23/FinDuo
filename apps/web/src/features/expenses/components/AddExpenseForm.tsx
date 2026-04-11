import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useExpenses } from "../hooks/useExpenses";

interface AddExpenseFormProps {
  onSuccess?: () => void;
}

export const AddExpenseForm = ({ onSuccess }: AddExpenseFormProps) => {
  const { addExpenseMutation } = useExpenses();
  const [form, setForm] = useState({ title: "", amount: "", category: "otros" });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addExpenseMutation.mutateAsync({
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      expenseDate: new Date().toISOString()
    });
    setForm({ title: "", amount: "", category: "otros" });
    onSuccess?.();
  };

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
          <select
            className="rounded-2xl border border-teal/15 bg-white px-4 py-3"
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          >
            <option value="entretenimiento">Entretenimiento</option>
            <option value="salidas">Salidas</option>
            <option value="supermercado">Supermercado</option>
            <option value="transporte">Transporte</option>
            <option value="servicios">Servicios</option>
            <option value="salud">Salud</option>
            <option value="imprevistos">Imprevistos</option>
            <option value="otros">Otros</option>
          </select>
        </label>
        <Button className="w-full" type="submit" variant="secondary">Registrar gasto</Button>
      </form>
    </Card>
  );
};
