import { z } from "zod";

const categoryEnum = z.enum([
  "entretenimiento",
  "salidas",
  "supermercado",
  "transporte",
  "servicios",
  "salud",
  "imprevistos",
  "otros"
]);

export const listExpensesSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    month: z.string().optional(),
    category: categoryEnum.optional()
  })
});

export const createExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    amount: z.number().positive(),
    category: categoryEnum,
    expenseDate: z.string().datetime()
  }),
  params: z.object({}),
  query: z.object({})
});

export const deleteExpenseSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
});
