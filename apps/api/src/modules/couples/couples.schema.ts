import { z } from "zod";

export const createCoupleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    savingsPercent: z.number().min(0).max(100).default(10)
  }),
  params: z.object({}),
  query: z.object({})
});

export const joinCoupleSchema = z.object({
  body: z.object({
    inviteCode: z.string().length(8)
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateSavingsPercentSchema = z.object({
  body: z.object({
    savingsPercent: z.number().min(0).max(100)
  }),
  params: z.object({
    id: z.string().uuid()
  }),
  query: z.object({})
});
