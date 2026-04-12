import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { extractApiErrorMessage } from "../../../lib/extractApiErrorMessage";
import { useContributions } from "../hooks/useContributions";

interface AddContributionFormProps {
  onSuccess?: () => void;
}

export const AddContributionForm = ({ onSuccess }: AddContributionFormProps) => {
  const { addContributionMutation } = useContributions();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await addContributionMutation.mutateAsync({
        amount: Number(amount),
        contributionDate: new Date().toISOString(),
        note
      });
      setAmount("");
      setNote("");
      onSuccess?.();
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, "No se pudo registrar el aporte."));
    }
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Monto aportado" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <Input label="Nota" value={note} onChange={(event) => setNote(event.target.value)} />
        {errorMessage ? <p className="text-sm font-medium text-[#d14f3f]">{errorMessage}</p> : null}
        <Button className="w-full" type="submit">Registrar aporte</Button>
      </form>
    </Card>
  );
};
