import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useOnboarding } from "../hooks/useOnboarding";

export const JoinCoupleForm = () => {
  const { joinCoupleMutation, activeCouple } = useOnboarding();
  const [inviteCode, setInviteCode] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await joinCoupleMutation.mutateAsync({ inviteCode });
    setInviteCode("");
  };

  return (
    <Card className="space-y-4">
      {activeCouple ? (
        <div className="rounded-2xl bg-teal/10 p-4 text-sm text-pine">
          Ya perteneces a {activeCouple.name}. El código actual es {activeCouple.inviteCode}.
        </div>
      ) : null}
      <form className="space-y-4" onSubmit={submit}>
        <Input
          label="Código de invitación"
          maxLength={8}
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
        />
        <Button className="w-full" type="submit" variant="secondary" disabled={joinCoupleMutation.isPending}>Unirme con código</Button>
      </form>
    </Card>
  );
};
