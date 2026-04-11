import { z } from "zod";

export const createContributionSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    contributionDate: z.string().datetime(),
    note: z.string().max(250).optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const deleteContributionSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
});

export const listContributionSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    month: z.string().optional()
  })
});
