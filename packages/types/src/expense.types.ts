export type ExpenseCategory =
  | "entretenimiento"
  | "salidas"
  | "supermercado"
  | "transporte"
  | "servicios"
  | "salud"
  | "imprevistos"
  | "otros";

export interface Expense {
  id: string;
  coupleId: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  createdAt: string;
}

export interface ExpenseFilters {
  month?: string;
  category?: ExpenseCategory;
}
