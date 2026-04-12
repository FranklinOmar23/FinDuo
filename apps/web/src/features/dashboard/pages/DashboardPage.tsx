import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightLeft, Crosshair, Plus, Settings2, TrendingDown, Wallet } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { AddContributionForm } from "../../contributions/components/AddContributionForm";
import { useExpenses } from "../../expenses/hooks/useExpenses";
import { acceptSoloMode, hasAcceptedSoloMode } from "../../onboarding/lib/soloMode";
import { useDashboard } from "../hooks/useDashboard";
import { useAuthStore } from "../../../store/authStore";
import { useCoupleStore } from "../../../store/coupleStore";

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
};

const monthLabel = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(new Date());

const CHART_COLORS = ["#1ca4a5", "#f28a68", "#f2be5c", "#8e53d4", "#6bb7ff"];

const normalizeCategoryLabel = (value: string) => {
  if (!value) {
    return "Otros";
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const DashboardPage = () => {
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [soloModeAccepted, setSoloModeAccepted] = useState(() => hasAcceptedSoloMode());
  const { data } = useDashboard();
  const { expensesQuery } = useExpenses();
  const user = useAuthStore((state) => state.user);
  const activeCouple = useCoupleStore((state) => state.activeCouple);
  const summary = data ?? {
    month: new Date().toISOString().slice(0, 7),
    totalIncome: 0,
    totalExpenses: 0,
    reservedSavings: 0,
    availableToSpend: 0,
    contributions: [],
    savingsGoals: []
  };
  const soloContributionAmount = summary.contributions
    .filter((contribution) => contribution.userId === user?.id)
    .reduce((sum, contribution) => sum + contribution.amount, 0);
  const soloTopGoal = summary.savingsGoals[0] ?? null;
  const soloTopGoalPercent = soloTopGoal && soloTopGoal.targetAmount > 0 ? Math.round((soloTopGoal.currentAmount / soloTopGoal.targetAmount) * 100) : 0;

  if (!activeCouple || activeCouple.isSolo) {
    return (
      <section className="space-y-4">
        <header className="flex items-start justify-between pt-2">
          <div>
            <p className="text-sm text-[#869592] first-letter:uppercase">{monthLabel}</p>
            <h1 className="phone-title">FinDúo</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpenContributionModal(true)}>
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              Abonar
            </button>
            <Link className="theme-outline-button inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-teal hover:text-teal" to="/profile">
              <Settings2 className="h-4 w-4" strokeWidth={1.9} />
            </Link>
          </div>
        </header>

        <article className="relative overflow-hidden rounded-[22px] bg-teal p-5 text-white">
          <div className="absolute -right-6 top-3 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 right-4 h-28 w-28 rounded-full bg-white/8" />
          <p className="text-sm font-semibold text-white/85">Disponible este mes</p>
          <p className="mt-2 text-5xl font-bold leading-none">{formatMoney(summary.availableToSpend)}</p>
          <div className="mt-5 flex items-center justify-between text-xs text-white/80">
            <span>Presupuesto usado</span>
            <span>{summary.totalIncome > 0 ? Math.round((summary.totalExpenses / summary.totalIncome) * 100) : 0}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/20">
            <div className="h-2 rounded-full bg-white" style={{ width: `${summary.totalIncome > 0 ? Math.min(Math.round((summary.totalExpenses / summary.totalIncome) * 100), 100) : 0}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="metric-chip"><Wallet className="h-3.5 w-3.5" /> {formatMoney(summary.totalIncome)}</span>
            <span className="metric-chip"><TrendingDown className="h-3.5 w-3.5" /> {formatMoney(summary.totalExpenses)}</span>
            <span className="metric-chip"><Crosshair className="h-3.5 w-3.5" /> {formatMoney(summary.reservedSavings)}</span>
          </div>
        </article>

        <article className="phone-card space-y-4 p-5">
          <p className="theme-heading text-xl font-semibold">Ahora mismo estás usando FinDúo solo.</p>
          <p className="theme-muted text-sm">Tienes acceso al inicio y a tu perfil. Cuando quieran compartir gastos, aportes y metas, crea una pareja o únete con un código de invitación.</p>
          <div className="grid gap-3">
            <button
              className={`inline-flex items-center justify-center rounded-[14px] px-4 py-3 text-sm font-semibold ${soloModeAccepted ? "theme-soft-button border border-transparent text-[#4d6969]" : "theme-outline-button border"}`}
              type="button"
              onClick={() => {
                acceptSoloMode();
                setSoloModeAccepted(true);
              }}
            >
              Estás en modo solo
            </button>
            <Link className="inline-flex items-center justify-center rounded-[14px] bg-teal px-4 py-3 text-sm font-semibold text-white" to="/onboarding">
              Crear o unirme a una pareja
            </Link>
          </div>
        </article>

        <article className="phone-card p-4">
          <div className="flex items-center justify-between">
            <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Aportes del mes</p>
            <p className="theme-muted text-xs">Modo solo</p>
          </div>
          <div className="mt-4 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#9bcfd2] bg-[#e5f3f5] text-[#1f6f73]">
              {(user?.fullName ?? "T").slice(0, 1).toUpperCase()}
            </div>
            <p className="theme-heading mt-3 text-2xl font-bold">{formatMoney(soloContributionAmount)}</p>
            <p className="theme-muted text-sm">Tú</p>
          </div>
          <button className="mt-4 w-full rounded-[14px] bg-teal px-4 py-3 text-sm font-semibold text-white" type="button" onClick={() => setOpenContributionModal(true)}>
            Abonar ahora
          </button>
        </article>

        <div>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="theme-heading text-base font-semibold">Metas de ahorro</h2>
            <Link className="text-xs font-semibold text-teal" to="/savings">Ver todas</Link>
          </div>
          <article className="phone-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4e6] text-[#ef7d4d]"><Crosshair className="h-5 w-5" strokeWidth={2} /></div>
              <div className="flex-1">
                {soloTopGoal ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <p className="theme-heading font-semibold">{soloTopGoal.name}</p>
                      <p className="text-sm font-semibold text-[#5b8fa0]">{soloTopGoalPercent}%</p>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-[#d7e6e7]">
                      <div className="h-1.5 rounded-full bg-teal" style={{ width: `${Math.min(soloTopGoalPercent, 100)}%` }} />
                    </div>
                    <p className="theme-muted mt-2 text-sm">{formatMoney(soloTopGoal.currentAmount)} de {formatMoney(soloTopGoal.targetAmount)}</p>
                  </>
                ) : (
                  <>
                    <p className="theme-heading font-semibold">Aún no tienes metas activas</p>
                    <p className="theme-muted mt-2 text-sm">Crea una meta personal para empezar a separar dinero dentro de tu propio espacio.</p>
                  </>
                )}
                <Link className="mt-4 inline-flex items-center justify-center rounded-[14px] bg-teal px-4 py-3 text-sm font-semibold text-white" to="/savings">
                  {soloTopGoal ? "Abonar a mis metas" : "Crear mi primera meta"}
                </Link>
              </div>
            </div>
          </article>
        </div>

        <article className="phone-card p-4">
          <h2 className="theme-heading text-base font-semibold">Gastos por categoría</h2>
          <div className="mt-4 flex items-center gap-5">
            <div className="flex shrink-0 flex-col items-center">
              <div className="relative h-28 w-28">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(148, 169, 166, 0.18)" strokeWidth="20" />
                </svg>
                <div className="absolute inset-[22px] flex items-center justify-center rounded-full" style={{ background: "var(--finduo-card-bg)" }}>
                  <div className="text-center">
                    <p className="theme-heading text-xl font-bold leading-none">{formatMoney(0)}</p>
                  </div>
                </div>
              </div>
              <p className="theme-muted mt-2 text-[10px] uppercase tracking-[0.14em]">0 categorías</p>
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <p className="theme-heading font-semibold">Sin gastos registrados</p>
              <p className="theme-muted text-sm">Registra gastos personales para ver aquí la distribución por categoría.</p>
            </div>
          </div>
        </article>

        <Modal open={openContributionModal} title="Registrar aporte">
          <AddContributionForm onSuccess={() => setOpenContributionModal(false)} />
        </Modal>
      </section>
    );
  }

  const usagePercent = summary.totalIncome > 0 ? Math.round((summary.totalExpenses / summary.totalIncome) * 100) : 0;
  const topGoal = summary.savingsGoals[0] ?? null;
  const topGoalPercent = topGoal && topGoal.targetAmount > 0 ? Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100) : 0;
  const contributionsByUser = summary.contributions.reduce<Record<string, { userId: string; amount: number }>>((accumulator, contribution) => {
    const current = accumulator[contribution.userId] ?? { userId: contribution.userId, amount: 0 };
    current.amount += contribution.amount;
    accumulator[contribution.userId] = current;
    return accumulator;
  }, {});
  const members = activeCouple?.members ?? [];
  const meMember = members.find((member) => member.userId === user?.id);
  const partnerMember = members.find((member) => member.userId !== user?.id);
  const me = user?.id ? contributionsByUser[user.id] ?? { userId: user.id, amount: 0 } : null;
  const partner = partnerMember ? contributionsByUser[partnerMember.userId] ?? { userId: partnerMember.userId, amount: 0 } : null;
  const meInitial = (meMember?.fullName ?? user?.fullName ?? "T").slice(0, 1).toUpperCase();
  const partnerInitial = (partnerMember?.fullName ?? "P").slice(0, 1).toUpperCase();
  const expenses = expensesQuery.data ?? [];
  const categoryTotals = expenses.reduce<Record<string, number>>((accumulator, expense) => {
    const key = normalizeCategoryLabel(expense.category);
    accumulator[key] = (accumulator[key] ?? 0) + expense.amount;
    return accumulator;
  }, {});
  const categoryEntries = Object.entries(categoryTotals)
    .map(([name, total], index) => ({
      name,
      total,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }))
    .sort((left, right) => right.total - left.total);
  const totalCategoryAmount = categoryEntries.reduce((accumulator, item) => accumulator + item.total, 0);

  let strokeOffset = 0;
  const chartSegments = categoryEntries.map((item) => {
    const percentage = totalCategoryAmount > 0 ? (item.total / totalCategoryAmount) * 100 : 0;
    const segment = {
      ...item,
      percentage,
      dashArray: `${percentage} ${100 - percentage}`,
      dashOffset: -strokeOffset
    };

    strokeOffset += percentage;
    return segment;
  });
  const chartLegend = categoryEntries.slice(0, 4);
  const categoryCountLabel = `${chartLegend.length} ${chartLegend.length === 1 ? "categoría" : "categorías"}`;

  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between pt-2">
        <div>
          <p className="text-sm text-[#869592] first-letter:uppercase">{monthLabel}</p>
          <h1 className="phone-title">FinDúo</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpenContributionModal(true)}>
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            Aporte
          </button>
          <Link className="theme-outline-button inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-teal hover:text-teal" to="/profile">
            <Settings2 className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>
      </header>

      <article className="relative overflow-hidden rounded-[22px] bg-teal p-5 text-white">
        <div className="absolute -right-6 top-3 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 right-4 h-28 w-28 rounded-full bg-white/8" />
        <p className="text-sm font-semibold text-white/85">Disponible este mes</p>
        <p className="mt-2 text-5xl font-bold leading-none">{formatMoney(summary.availableToSpend)}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-white/80">
          <span>Presupuesto usado</span>
          <span>{usagePercent}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/20">
          <div className="h-2 rounded-full bg-white" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="metric-chip"><Wallet className="h-3.5 w-3.5" /> {formatMoney(summary.totalIncome)}</span>
          <span className="metric-chip"><TrendingDown className="h-3.5 w-3.5" /> {formatMoney(summary.totalExpenses)}</span>
          <span className="metric-chip"><Crosshair className="h-3.5 w-3.5" /> {formatMoney(summary.reservedSavings)}</span>
        </div>
      </article>

      <article className="phone-card p-4">
        <div className="flex items-center justify-between">
          <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Aportes del mes</p>
          <p className="theme-muted text-xs">{activeCouple?.name ?? "Pareja"}</p>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#9bcfd2] bg-[#e5f3f5] text-[#1f6f73]">{meInitial}</div>
            <p className="theme-heading mt-3 text-2xl font-bold">{formatMoney(me?.amount ?? 0)}</p>
            <p className="theme-muted text-sm">Tú</p>
          </div>
          <div className="theme-muted text-xl"><ArrowRightLeft className="h-5 w-5" strokeWidth={1.8} /></div>
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#f4cdc1] bg-[#fff1ea] text-[#ea845f]">{partnerInitial}</div>
            <p className="theme-heading mt-3 text-2xl font-bold">{formatMoney(partner?.amount ?? 0)}</p>
            <p className="theme-muted text-sm">Pareja</p>
          </div>
        </div>
      </article>

      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="theme-heading text-base font-semibold">Metas de ahorro</h2>
          <Link className="text-xs font-semibold text-teal" to="/savings">Ver todas</Link>
        </div>
        {topGoal ? (
          <article className="phone-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4e6] text-[#ef7d4d]"><Crosshair className="h-5 w-5" strokeWidth={2} /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="theme-heading font-semibold">{topGoal.name}</p>
                  <p className="text-sm font-semibold text-[#5b8fa0]">{topGoalPercent}%</p>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[#d7e6e7]">
                  <div className="h-1.5 rounded-full bg-teal" style={{ width: `${Math.min(topGoalPercent, 100)}%` }} />
                </div>
                <p className="theme-muted mt-2 text-sm">{formatMoney(topGoal.currentAmount)} de {formatMoney(topGoal.targetAmount)}</p>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      <article className="phone-card p-4">
        <h2 className="theme-heading text-base font-semibold">Gastos por categoría</h2>
        <div className="mt-4 flex items-center gap-5">
          <div className="flex shrink-0 flex-col items-center">
          <div className="relative h-28 w-28">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(148, 169, 166, 0.18)" strokeWidth="20" />
              {chartSegments.map((segment) => (
                <circle
                  key={segment.name}
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  pathLength="100"
                  stroke={segment.color}
                  strokeLinecap="round"
                  strokeWidth="20"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                />
              ))}
            </svg>
            <div className="absolute inset-[22px] flex items-center justify-center rounded-full" style={{ background: "var(--finduo-card-bg)" }}>
              <div className="text-center">
                <p className="theme-heading text-xl font-bold leading-none">{formatMoney(totalCategoryAmount)}</p>
              </div>
            </div>
          </div>
            <p className="theme-muted mt-2 text-[10px] uppercase tracking-[0.14em]">{categoryCountLabel}</p>
          </div>
          <div className="flex-1 space-y-3 text-sm">
            {chartLegend.length > 0 ? (
              chartLegend.map((item) => {
                const percentage = totalCategoryAmount > 0 ? Math.round((item.total / totalCategoryAmount) * 100) : 0;

                return (
                  <div className="flex items-center justify-between gap-3" key={item.name}>
                    <div className="flex min-w-0 items-center gap-2" style={{ color: item.color }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="theme-heading font-semibold">{percentage}%</p>
                      <p className="theme-muted text-xs">{formatMoney(item.total)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-1">
                <p className="theme-heading font-semibold">Sin gastos registrados</p>
                <p className="theme-muted text-sm">Agrega gastos del mes para ver la distribución por categoría.</p>
              </div>
            )}
          </div>
        </div>
      </article>

      <Modal open={openContributionModal} title="Registrar aporte">
        <AddContributionForm onSuccess={() => setOpenContributionModal(false)} />
      </Modal>
    </section>
  );
};
