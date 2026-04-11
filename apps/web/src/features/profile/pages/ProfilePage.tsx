import { useEffect, useState } from "react";
import { Copy, Heart, Link2, MoonStar, SunMedium, UserPlus } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useCoupleStore } from "../../../store/coupleStore";
import { useThemeStore } from "../../../store/themeStore";
import { useAuth } from "../../auth/hooks/useAuth";
import { InviteQrCard } from "../../couples/components/InviteQrCard";
import { buildInviteLink } from "../../couples/lib/pendingInvite";

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const couple = useCoupleStore((state) => state.activeCouple);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { logoutMutation } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [partnerName, setPartnerName] = useState(couple?.name ?? "");
  const [savingsPercent, setSavingsPercent] = useState(String(couple?.savingsPercent ?? 10));
  const [copiedInvite, setCopiedInvite] = useState(false);
  const inviteLink = couple?.inviteCode ? buildInviteLink(couple.inviteCode) : "";
  const members = couple?.members ?? [];
  const myMember = members.find((member) => member.userId === user?.id);
  const partnerMember = members.find((member) => member.userId !== user?.id);
  const myDisplayName = myMember?.fullName ?? user?.fullName ?? "Tú";
  const partnerDisplayName = partnerMember?.fullName ?? "Pendiente de vincular";

  useEffect(() => {
    setFullName(myDisplayName);
  }, [myDisplayName]);

  useEffect(() => {
    setPartnerName(partnerDisplayName);
  }, [partnerDisplayName]);

  const copyInvite = async () => {
    if (!inviteLink || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(inviteLink);
    setCopiedInvite(true);
    window.setTimeout(() => setCopiedInvite(false), 1800);
  };

  return (
    <section className="space-y-4">
      <header className="pt-2">
        <h1 className="phone-title">Perfil</h1>
        <p className="phone-subtitle">Configura tu FinDúo</p>
      </header>

      <article className="relative overflow-hidden rounded-[22px] bg-teal p-5 text-center text-white">
        <div className="absolute right-4 top-3 h-16 w-16 rounded-full bg-white/10" />
        <div className="mx-auto flex w-fit items-center gap-2">
          <Heart className="h-4 w-4 fill-[#ff5d5d] text-[#ff5d5d]" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d39a6d] bg-[#8d7456] text-sm">{user?.fullName?.slice(0, 1).toUpperCase() ?? "P"}</div>
        </div>
        <p className="mt-4 text-xl font-bold">Tú &amp; Pareja</p>
        <p className="mt-1 text-sm text-white/80">FinDúo · Finanzas en pareja</p>
      </article>

      <article className="phone-card p-4">
        <p className="theme-heading mb-3 text-sm font-semibold">Nombres</p>
        <div className="space-y-3">
          <label className="theme-muted block text-sm">
            Tu nombre
            <input className="theme-input mt-2 w-full rounded-full border px-4 py-3 outline-none" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Ej: Carlos" />
          </label>
          <label className="theme-muted block text-sm">
            Nombre de tu pareja
            <input className="theme-input mt-2 w-full rounded-full border px-4 py-3 outline-none" value={partnerName} onChange={(event) => setPartnerName(event.target.value)} placeholder="Ej: María" />
          </label>
        </div>
      </article>

      <article className="phone-card p-4">
        <p className="theme-heading mb-3 text-sm font-semibold">Ahorro automático</p>
        <label className="theme-muted block text-sm">
          Porcentaje de ahorro (%)
          <input className="theme-input mt-2 w-full rounded-full border px-4 py-3 outline-none" value={savingsPercent} onChange={(event) => setSavingsPercent(event.target.value)} />
        </label>
        <p className="theme-muted mt-3 text-xs">Se reservará automáticamente este % de cada aporte antes de calcular gastos disponibles.</p>
        <div className="theme-muted mt-4 flex items-center justify-between text-xs">
          <span>Ahorro: {savingsPercent}%</span>
          <span>Disponible: {100 - Number(savingsPercent || 0)}%</span>
        </div>
      </article>

      {couple ? (
        <article className="phone-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="theme-heading text-sm font-semibold">Invitar a compañero</p>
              <p className="theme-muted mt-1 text-sm">Comparte este enlace. Si la otra persona se registra o inicia sesión desde ahí, quedará vinculada automáticamente contigo.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
              <UserPlus className="h-5 w-5" strokeWidth={1.9} />
            </div>
          </div>
          <div className="mt-4 rounded-[18px] border border-[#d7d1c5] px-4 py-3">
            <p className="theme-muted text-xs uppercase tracking-[0.16em]">Código</p>
            <p className="theme-heading mt-1 font-bold tracking-[0.18em]">{couple.inviteCode}</p>
            <p className="theme-muted mt-3 break-all text-xs">{inviteLink}</p>
          </div>
          <InviteQrCard inviteCode={couple.inviteCode} inviteLink={inviteLink} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-teal px-4 py-3 text-sm font-semibold text-white" onClick={() => void copyInvite()}>
              <Copy className="h-4 w-4" strokeWidth={1.9} />
              {copiedInvite ? "Copiado" : "Copiar link"}
            </button>
            <a className="theme-outline-button inline-flex items-center justify-center gap-2 rounded-[14px] border px-4 py-3 text-sm font-semibold" href={inviteLink} target="_blank" rel="noreferrer">
              <Link2 className="h-4 w-4" strokeWidth={1.9} />
              Abrir enlace
            </a>
          </div>
        </article>
      ) : null}

      <button className="w-full rounded-[14px] bg-teal py-3 text-sm font-semibold text-white">Guardar cambios</button>

      <article className="phone-card flex items-center justify-between p-4">
        <div>
          <p className="theme-heading font-semibold">Modo oscuro</p>
          <p className="theme-muted text-sm">Cambia la apariencia de la app: {theme === "dark" ? "activo" : "inactivo"}</p>
        </div>
        <button className="theme-soft-button flex h-10 w-10 items-center justify-center rounded-full transition" onClick={toggleTheme}>
          {theme === "dark" ? <SunMedium className="h-5 w-5" strokeWidth={1.9} /> : <MoonStar className="h-5 w-5" strokeWidth={1.9} />}
        </button>
      </article>

      <button className="theme-outline-button w-full rounded-[14px] border py-3 text-sm font-semibold" onClick={() => logoutMutation.mutate()}>
        Cerrar sesión
      </button>
    </section>
  );
};
