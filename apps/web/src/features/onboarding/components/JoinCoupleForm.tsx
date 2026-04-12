import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useOnboarding } from "../hooks/useOnboarding";

export const JoinCoupleForm = () => {
  const { joinCoupleMutation, activeCouple } = useOnboarding();
  const [inviteCode, setInviteCode] = useState("");
  const realCouple = activeCouple && !activeCouple.isSolo ? activeCouple : null;
  const hasRealCouple = Boolean(realCouple);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await joinCoupleMutation.mutateAsync({ inviteCode });
    setInviteCode("");
  };

  const handleInviteCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInviteCode(event.target.value.toUpperCase());
  };

  return (
    <Card className="space-y-4">
      {hasRealCouple ? (
        <div className="rounded-2xl bg-teal/10 p-4 text-sm text-pine">
          Ya perteneces a {realCouple?.name}. El código actual es {realCouple?.inviteCode}.
        </div>
      ) : null}
      <form className="space-y-4" onSubmit={submit}>
        {activeCouple?.isSolo ? (
          <div className="rounded-2xl bg-sand p-4 text-sm text-pine">
            Si ingresas un código, dejarás tu espacio personal y pasarás a la pareja compartida.
          </div>
        ) : null}
        <Input
          label="Código de invitación"
          maxLength={8}
          value={inviteCode}
          onChange={handleInviteCodeChange}
        />
        <Button className="w-full" type="submit" variant="secondary" disabled={joinCoupleMutation.isPending}>Unirme con código</Button>
      </form>
    </Card>
  );
};
