import { Copy, Link2, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { InviteQrCard } from "../components/InviteQrCard";
import { buildInviteLink, setPendingInviteCode } from "../lib/pendingInvite";
import { useAuthStore } from "../../../store/authStore";

export const InvitePartnerPage = () => {
  const { inviteCode = "" } = useParams();
  const token = useAuthStore((state) => state.token);
  const normalizedInviteCode = inviteCode.trim().toUpperCase();

  useEffect(() => {
    if (!normalizedInviteCode) {
      return;
    }

    setPendingInviteCode(normalizedInviteCode);
  }, [normalizedInviteCode]);

  if (!normalizedInviteCode) {
    return <Navigate to="/login" replace />;
  }

  const inviteLink = buildInviteLink(normalizedInviteCode);

  if (token) {
    return <Navigate to="/onboarding" replace />;
  }

  const copyInviteLink = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="page-shell justify-center gap-5">
      <div className="panel space-y-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
          <UserPlus className="h-6 w-6" strokeWidth={1.9} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-pine/70">Invitación</p>
          <h1 className="mt-2 font-display text-3xl text-pine">Únete a FinDúo</h1>
          <p className="mt-2 text-sm text-pine/80">Recibiste una invitación para vincular tu cuenta con tu compañero. Si todavía no tienes cuenta, regístrate primero; cuando entres, el sistema te unirá automáticamente.</p>
        </div>
        <div className="rounded-[18px] border border-[#d8d3c7] bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#7d8f8d]">Código de invitación</p>
          <p className="mt-1 text-lg font-bold tracking-[0.18em] text-[#17373c]">{normalizedInviteCode}</p>
        </div>
        <InviteQrCard inviteCode={normalizedInviteCode} inviteLink={inviteLink} />
        <button className="theme-outline-button inline-flex items-center justify-center gap-2 rounded-[14px] border px-4 py-3 text-sm font-semibold" onClick={() => void copyInviteLink()}>
          <Copy className="h-4 w-4" strokeWidth={1.9} />
          Copiar enlace
        </button>
      </div>

      <Link className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-teal px-4 py-3 text-sm font-semibold text-white" to="/register">
        <UserPlus className="h-4 w-4" strokeWidth={2} />
        Registrarme y vincularme
      </Link>
      <Link className="theme-outline-button inline-flex items-center justify-center gap-2 rounded-[14px] border px-4 py-3 text-sm font-semibold" to="/login">
        <Link2 className="h-4 w-4" strokeWidth={1.9} />
        Ya tengo cuenta
      </Link>
    </div>
  );
};