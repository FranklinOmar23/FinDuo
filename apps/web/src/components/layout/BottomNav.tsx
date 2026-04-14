import { HandCoins, Home, PiggyBank, ReceiptText, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { id: "home", to: "/", label: "Inicio", icon: Home },
  { id: "expenses", to: "/expenses", label: "Gastos", icon: ReceiptText },
  { id: "balance", to: "/balance", label: "Balance", icon: HandCoins },
  { id: "savings", to: "/savings", label: "Ahorro", icon: PiggyBank },
  { id: "profile", to: "/profile", label: "Perfil", icon: UserRound }
];

export const BottomNav = () => {
  return (
    <nav className="bottom-nav fixed bottom-0 z-40 flex w-full border-t px-2 pb-3 pt-2" data-tour="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          data-tour={`nav-${item.id}`}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold transition ${isActive ? "text-teal" : "text-[#8a9896]"}`
          }
        >
          <item.icon className="h-5 w-5" strokeWidth={1.9} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
