import { z } from "zod";

// Validar formato YYYY-MM para parámetro de mes
const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, "Formato de mes debe ser YYYY-MM").optional();

export const dashboardGetSummarySchema = z.object({
  query: z.object({
    month: monthSchema
  }),
  params: z.object({}),
  body: z.object({})
});
