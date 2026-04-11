import { CreateCoupleForm } from "../components/CreateCoupleForm";
import { JoinCoupleForm } from "../components/JoinCoupleForm";
import { useOnboarding } from "../hooks/useOnboarding";

export const OnboardingPage = () => {
  const { activeCouple } = useOnboarding();

  return (
    <section className="space-y-4">
      <div className="panel p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-pine/70">Onboarding</p>
        <h2 className="mt-2 font-display text-3xl text-pine">Activen su espacio conjunto</h2>
        <p className="mt-2 text-sm text-pine/80">Una persona crea la pareja y la otra se une con el código de invitación.</p>
        {activeCouple ? (
          <p className="mt-3 text-sm font-semibold text-teal">Código de invitación actual: {activeCouple.inviteCode}</p>
        ) : null}
      </div>
      <CreateCoupleForm />
      <JoinCoupleForm />
    </section>
  );
};
