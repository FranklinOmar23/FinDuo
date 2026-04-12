import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { extractApiErrorMessage } from "../../../lib/extractApiErrorMessage";
import { useSavings } from "../hooks/useSavings";

interface AddGoalFormProps {
  onSuccess?: () => void;
}

export const AddGoalForm = ({ onSuccess }: AddGoalFormProps) => {
  const { addGoalMutation } = useSavings();
  const [form, setForm] = useState({ name: "", targetAmount: "", currentAmount: "0", deadline: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const normalizedDeadline = form.deadline ? new Date(form.deadline).toISOString() : undefined;

      await addGoalMutation.mutateAsync({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount),
        deadline: normalizedDeadline
      });

      setForm({ name: "", targetAmount: "", currentAmount: "0", deadline: "" });
      onSuccess?.();
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, "No se pudo crear la meta."));
    }
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Nombre de la meta" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <Input label="Monto objetivo" type="number" value={form.targetAmount} onChange={(event) => setForm((current) => ({ ...current, targetAmount: event.target.value }))} />
        <Input label="Monto actual" type="number" value={form.currentAmount} onChange={(event) => setForm((current) => ({ ...current, currentAmount: event.target.value }))} />
        <Input label="Fecha límite" type="datetime-local" value={form.deadline} onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))} />
        {errorMessage ? <p className="text-sm font-medium text-[#d14f3f]">{errorMessage}</p> : null}
        <Button className="w-full" type="submit">Crear meta</Button>
      </form>
    </Card>
  );
};
