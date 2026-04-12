import { useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useOnboarding } from "../hooks/useOnboarding";

export const CreateCoupleForm = () => {
  const { createCoupleMutation, activeCouple } = useOnboarding();
  const [name, setName] = useState("");
  const [savingsPercent, setSavingsPercent] = useState("10");
  const realCouple = activeCouple && !activeCouple.isSolo ? activeCouple : null;
  const hasRealCouple = Boolean(realCouple);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createCoupleMutation.mutateAsync({
      name,
      savingsPercent: Number(savingsPercent)
    });
    setName("");
    setSavingsPercent("10");
  };

  return (
    <Card className="space-y-4">
      {hasRealCouple ? (
        <div className="space-y-3 rounded-2xl bg-sand p-4">
          <Badge>Código activo</Badge>
          <div>
            <p className="text-sm text-pine/70">Comparte este código con tu pareja</p>
            <p className="mt-2 font-display text-3xl tracking-[0.24em] text-pine">{realCouple?.inviteCode}</p>
          </div>
          <p className="text-sm text-pine/80">Pareja: {realCouple?.name}</p>
        </div>
      ) : null}
      <form className="space-y-4" onSubmit={submit}>
        {activeCouple?.isSolo ? (
          <div className="rounded-2xl bg-teal/10 p-4 text-sm text-pine">
            Estás en modo solo. Si completas este formulario, tu espacio personal se convertirá en una pareja compartida.
          </div>
        ) : null}
        <Input label="Nombre de la pareja" value={name} onChange={(event) => setName(event.target.value)} />
        <Input
          label="Porcentaje de ahorro"
          type="number"
          value={savingsPercent}
          onChange={(event) => setSavingsPercent(event.target.value)}
        />
        <Button className="w-full" type="submit" disabled={createCoupleMutation.isPending}>{activeCouple?.isSolo ? "Convertir a pareja" : "Crear pareja"}</Button>
      </form>
    </Card>
  );
};
