import { z } from "zod";

export const listSavingsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({})
});

export const createSavingsSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    targetAmount: z.number().positive(),
    currentAmount: z.number().min(0).default(0),
    deadline: z.string().datetime().optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateSavingsAmountSchema = z.object({
  body: z.object({
    currentAmount: z.number().min(0)
  }),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
});

export const deleteSavingsSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
});
