import { CheckCircle2, History, Scale, Wallet } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useContributions } from "../../contributions/hooks/useContributions";
import { useExpenses } from "../../expenses/hooks/useExpenses";
import { getLatestBalanceSettlement, saveBalanceSettlement } from "../lib/balanceSettlement";
import { useAuthStore } from "../../../store/authStore";
import { useCoupleStore } from "../../../store/coupleStore";
import { useToastStore } from "../../../store/toastStore";

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
};

export const BalancePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const pushToast = useToastStore((state) => state.pushToast);
  const contributions = useContributions().contributionsQuery.data ?? [];
  const expenses = useExpenses().expensesQuery.data ?? [];
  const isSolo = Boolean(activeCouple?.isSolo);

  if (!activeCouple) {
    return (
      <section className="space-y-4">
        <header className="pt-2">
          <h1 className="phone-title">Balance</h1>
          <p className="phone-subtitle">Necesitan una pareja para comparar aportes y gastos</p>
        </header>

        <article className="phone-card space-y-4 p-5">
          <p className="theme-heading text-lg font-semibold">Todavía no hay balance compartido.</p>
          <p className="theme-muted text-sm">Puedes volver luego cuando tengan una pareja creada o unirte desde el código de invitación.</p>
        </article>
      </section>
    );
  }

  const totalByUser = contributions.reduce<Record<string, number>>((accumulator, contribution) => {
    accumulator[contribution.userId] = (accumulator[contribution.userId] ?? 0) + contribution.amount;
    return accumulator;
  }, {});
  const members = activeCouple.members ?? [];
  const meMember = members.find((member) => member.userId === user?.id);
  const partnerMember = members.find((member) => member.userId !== user?.id);
  const meAmount = user?.id ? (totalByUser[user.id] ?? 0) : 0;
  const partnerAmount = partnerMember ? (totalByUser[partnerMember.userId] ?? 0) : 0;
  const totalContributions = meAmount + partnerAmount;
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const availableBalance = totalContributions - totalExpenses;
  const firstShare = totalContributions > 0 ? Math.round((meAmount / totalContributions) * 100) : 0;
  const secondShare = totalContributions > 0 ? Math.round((partnerAmount / totalContributions) * 100) : 0;
  const myInitial = (meMember?.fullName ?? user?.fullName ?? "T").slice(0, 1).toUpperCase();
  const partnerInitial = (partnerMember?.fullName ?? "P").slice(0, 1).toUpperCase();
  const recentExpenses = expenses.slice(0, 3);
  const latestSettlement = useMemo(() => (
    activeCouple?.id ? getLatestBalanceSettlement(activeCouple.id) : null
  ), [activeCouple?.id]);
  const currentDifference = meAmount - partnerAmount;
  const baselineDifference = latestSettlement?.baselineDifference ?? 0;
  const pendingDifference = currentDifference - baselineDifference;
  const settlementAmount = Math.abs(pendingDifference) / 2;
  const settlementDirection = pendingDifference > 0 ? "partner-owes-me" : pendingDifference < 0 ? "i-owe-partner" : "even";
  const settlementMessage = settlementDirection === "partner-owes-me"
    ? `${partnerMember?.fullName ?? "Tu pareja"} te debe ${formatMoney(settlementAmount)} para emparejar aportes.`
    : settlementDirection === "i-owe-partner"
      ? `Tú le debes ${formatMoney(settlementAmount)} a ${partnerMember?.fullName ?? "tu pareja"} para emparejar aportes.`
      : "Ya están a mano en aportes."
  ;

  const handleMarkPaid = () => {
    if (!activeCouple || !user?.id || !partnerMember || settlementDirection === "even") {
      return;
    }

    const payerUserId = settlementDirection === "partner-owes-me" ? partnerMember.userId : user.id;
    const payerName = settlementDirection === "partner-owes-me" ? (partnerMember.fullName ?? "Pareja") : (user.fullName ?? "Tú");
    const receiverUserId = settlementDirection === "partner-owes-me" ? user.id : partnerMember.userId;
    const receiverName = settlementDirection === "partner-owes-me" ? (user.fullName ?? "Tú") : (partnerMember.fullName ?? "Pareja");

    saveBalanceSettlement({
      coupleId: activeCouple.id,
      amount: settlementAmount,
      baselineDifference: currentDifference,
      payerUserId,
      payerName,
      receiverUserId,
      receiverName
    });

    pushToast({
      title: "Balance liquidado",
      message: `${payerName} quedó marcado como quien pagó ${formatMoney(settlementAmount)} a ${receiverName}.`,
      tone: "success"
    });

    navigate("/balance/history");
  };

  if (isSolo) {
    const recentMovements = [...contributions.map((item) => ({
      id: `contribution-${item.id}`,
      title: item.note?.trim().length ? item.note : "Aporte registrado",
      amount: item.amount,
      date: item.contributionDate,
      tone: "positive" as const,
      label: "Ingreso"
    })), ...expenses.map((item) => ({
      id: `expense-${item.id}`,
      title: item.title,
      amount: item.amount,
      date: item.expenseDate,
      tone: "negative" as const,
      label: item.category
    }))]
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
      .slice(0, 4);

    return (
      <section className="space-y-4">
        <header className="pt-2">
          <h1 className="phone-title">Balance</h1>
          <p className="phone-subtitle">Resumen de tu espacio personal</p>
        </header>

        <article className="phone-card p-5">
          <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Disponible ahora</p>
          <p className="theme-heading mt-3 text-5xl font-bold leading-none">{formatMoney(availableBalance)}</p>
          <p className="theme-muted mt-3 text-sm">Tus aportes menos tus gastos registrados.</p>
        </article>

        <div className="grid grid-cols-2 gap-3">
          <article className="phone-card p-4">
            <p className="theme-muted text-xs">Aportes acumulados</p>
            <p className="theme-heading mt-2 text-3xl font-bold">{formatMoney(totalContributions)}</p>
          </article>
          <article className="phone-card p-4">
            <p className="theme-muted text-xs">Gastos acumulados</p>
            <p className="mt-2 text-3xl font-bold text-[#f57f51]">{formatMoney(totalExpenses)}</p>
          </article>
        </div>

        <article className="phone-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="theme-heading font-semibold">Movimiento reciente</p>
              <p className="theme-muted text-sm">Tu actividad financiera más reciente.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9bcfd2] bg-[#e4f5f4] text-sm text-[#1f6f73]">
              {myInitial}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {recentMovements.length > 0 ? (
              recentMovements.map((movement) => (
                <div key={movement.id} className="theme-elevated-surface flex items-center justify-between rounded-2xl p-3">
                  <div>
                    <p className="theme-heading font-semibold">{movement.title}</p>
                    <p className="theme-muted text-xs">{movement.label} · {new Date(movement.date).toLocaleDateString("es-MX")}</p>
                  </div>
                  <p className={`font-semibold ${movement.tone === "positive" ? "text-teal" : "text-[#f57f51]"}`}>
                    {movement.tone === "positive" ? "+" : "-"}{formatMoney(movement.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-sand p-4 text-sm text-pine">
                Todavía no registras movimientos. Empieza con un aporte o un gasto para ver tu balance personal aquí.
              </div>
            )}
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="pt-2">
        <h1 className="phone-title">Balance</h1>
        <p className="phone-subtitle">¿Quién debe qué?</p>
      </header>

      <article className="phone-card overflow-hidden p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Pendiente entre ustedes</p>
            <p className="theme-heading mt-2 text-3xl font-bold leading-none">{settlementDirection === "even" ? formatMoney(0) : formatMoney(settlementAmount)}</p>
            <p className="theme-muted mt-2 text-sm">{settlementMessage}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(28,164,165,0.12)] text-teal">
            <Scale className="h-6 w-6" strokeWidth={2} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="theme-elevated-surface inline-flex min-h-[106px] flex-col items-center justify-center rounded-[18px] border border-[rgba(112,205,195,0.18)] px-4 py-4 text-center transition hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-[0_12px_28px_rgba(14,81,79,0.14)] disabled:cursor-not-allowed disabled:opacity-55"
            type="button"
            onClick={handleMarkPaid}
            disabled={settlementDirection === "even"}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(20,166,150,0.12)] text-teal">
              <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="theme-heading mt-3 text-sm font-semibold">Marcar pagado</span>
          </button>
          <button
            className="theme-elevated-surface inline-flex min-h-[106px] flex-col items-center justify-center rounded-[18px] border border-[rgba(242,138,104,0.16)] px-4 py-4 text-center transition hover:-translate-y-0.5 hover:border-[#f28a68]/30 hover:shadow-[0_12px_28px_rgba(85,47,22,0.14)]"
            type="button"
            onClick={() => navigate("/balance/history")}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(242,138,104,0.12)] text-[#f28a68]">
              <History className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="theme-heading mt-3 text-sm font-semibold">Ver historial</span>
          </button>
        </div>
      </article>

      <article className="phone-card p-4">
        <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Contribución proporcional</p>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#9bcfd2] bg-[#e4f5f4] text-sm text-[#1f6f73]">
              {myInitial}
            </div>
            <p className="theme-heading mt-3 text-[30px] font-bold leading-none">{formatMoney(meAmount)}</p>
            <p className="mt-2 text-sm text-[#52a3a1]">{firstShare}%</p>
          </div>
          <div className="theme-muted text-xl">⇆</div>
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#f4c9bd] bg-[#fff1ec] text-sm text-[#ea845f]">
              {partnerInitial}
            </div>
            <p className="theme-heading mt-3 text-[30px] font-bold leading-none">{formatMoney(partnerAmount)}</p>
            <p className="mt-2 text-sm text-[#ea845f]">{secondShare}%</p>
          </div>
        </div>
        <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-[#e8efee]">
          <div className="bg-teal" style={{ width: `${firstShare}%` }} />
          <div className="bg-[#f28a68]" style={{ width: `${secondShare}%` }} />
        </div>
      </article>

      <article className="phone-card p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Pagos recientes</p>
          <span className="theme-muted inline-flex items-center gap-1 text-xs"><Wallet className="h-3.5 w-3.5" strokeWidth={1.9} /> Disponible {formatMoney(availableBalance)}</span>
        </div>
        <div className="mt-4 space-y-3">
          {recentExpenses.length > 0 ? recentExpenses.map((expense) => {
            const payer = members.find((member) => member.userId === expense.userId);

            return (
            <div key={expense.id} className="theme-elevated-surface flex items-center justify-between rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0e4ff] text-[#9b63e3]">▣</div>
                <div>
                  <p className="theme-heading font-semibold">{expense.title}</p>
                  <p className="theme-muted text-xs">{payer?.fullName ?? "Pareja"} pagó · {new Date(expense.expenseDate).toLocaleDateString("es-MX")}</p>
                </div>
              </div>
              <p className="font-semibold text-teal">+{formatMoney(expense.amount)}</p>
            </div>
          );}) : (
            <div className="rounded-2xl bg-sand p-4 text-sm text-pine">
              Todavía no hay gastos compartidos recientes para calcular movimientos entre ustedes.
            </div>
          )}
        </div>
      </article>

      <article className="phone-card flex flex-col items-center justify-center p-8 text-center">
        <div className="text-3xl">⚖️</div>
        <p className="theme-heading mt-3 font-semibold">{settlementDirection === "even" ? "¡Están a mano!" : "Aún hay una diferencia pendiente"}</p>
        <p className="theme-muted text-sm">Total gastado: {formatMoney(totalExpenses)}</p>
      </article>
    </section>
  );
};