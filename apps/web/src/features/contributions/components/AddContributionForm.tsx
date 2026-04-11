import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useContributions } from "../hooks/useContributions";

interface AddContributionFormProps {
  onSuccess?: () => void;
}

export const AddContributionForm = ({ onSuccess }: AddContributionFormProps) => {
  const { addContributionMutation } = useContributions();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addContributionMutation.mutateAsync({
      amount: Number(amount),
      contributionDate: new Date().toISOString(),
      note
    });
    setAmount("");
    setNote("");
    onSuccess?.();
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Monto aportado" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <Input label="Nota" value={note} onChange={(event) => setNote(event.target.value)} />
        <Button className="w-full" type="submit">Registrar aporte</Button>
      </form>
    </Card>
  );
};
