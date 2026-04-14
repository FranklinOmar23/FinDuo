import { ArrowLeft, Clock3, ReceiptText } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getBalanceSettlementHistory } from "../lib/balanceSettlement";
import { useCoupleStore } from "../../../store/coupleStore";

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
};

export const BalanceHistoryPage = () => {
  const activeCouple = useCoupleStore((state) => state.activeCouple);

  const records = useMemo(() => (
    activeCouple?.id ? getBalanceSettlementHistory(activeCouple.id) : []
  ), [activeCouple?.id]);

  return (
    <section className="space-y-4">
      <header className="flex items-start gap-3 pt-2">
        <Link className="theme-outline-button inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:border-teal hover:text-teal" to="/balance">
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <div>
          <h1 className="phone-title">Historial</h1>
          <p className="phone-subtitle">Liquidaciones marcadas dentro del balance compartido.</p>
        </div>
      </header>

      <article className="phone-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="theme-muted text-[11px] uppercase tracking-[0.18em]">Movimientos guardados</p>
            <p className="theme-heading mt-2 text-2xl font-bold">{records.length}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(242,138,104,0.12)] text-[#f28a68]">
            <Clock3 className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
      </article>

      {records.length > 0 ? records.map((record) => (
        <article key={record.id} className="phone-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(20,166,150,0.12)] text-teal">
                <ReceiptText className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="theme-heading font-semibold">{record.payerName} pagó a {record.receiverName}</p>
                <p className="theme-muted mt-1 text-sm">{new Date(record.settledAt).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
            <p className="text-right text-lg font-bold text-teal">{formatMoney(record.amount)}</p>
          </div>
        </article>
      )) : (
        <article className="phone-card p-5 text-center">
          <p className="theme-heading text-lg font-semibold">Todavía no hay liquidaciones guardadas.</p>
          <p className="theme-muted mt-2 text-sm">Cuando uses Marcar pagado, el movimiento aparecerá aquí para que lleven control de quién liquidó a quién.</p>
        </article>
      )}
    </section>
  );
};