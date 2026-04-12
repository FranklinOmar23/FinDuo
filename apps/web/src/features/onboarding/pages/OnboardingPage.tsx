import { Link } from "react-router-dom";
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
        <p className="mt-2 text-sm text-pine/80">Pueden crear una pareja ahora, unirse con un código de invitación o continuar solos por el momento.</p>
        {activeCouple ? (
          <p className="mt-3 text-sm font-semibold text-teal">Código de invitación actual: {activeCouple.inviteCode}</p>
        ) : null}
      </div>
      {!activeCouple ? (
        <div className="phone-card space-y-3 p-4">
          <div>
            <p className="theme-heading text-base font-semibold">¿Prefieres seguir sin pareja?</p>
            <p className="theme-muted mt-1 text-sm">Puedes entrar a la app ahora mismo y vincularte más adelante desde perfil o con un enlace de invitación.</p>
          </div>
          <Link className="theme-outline-button inline-flex w-full items-center justify-center rounded-[14px] border px-4 py-3 text-sm font-semibold" to="/">
            Continuar sin pareja
          </Link>
        </div>
      ) : null}
      <CreateCoupleForm />
      <JoinCoupleForm />
    </section>
  );
};
