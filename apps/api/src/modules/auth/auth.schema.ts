import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string()
      .min(10, "Contraseña debe tener al menos 10 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[!@#$%^&*]/, "Debe contener al menos un símbolo (!@#$%^&*)"),
    fullName: z.string().min(2).max(120)
  }),
  params: z.object({}),
  query: z.object({})
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  params: z.object({}),
  query: z.object({})
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1).optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1)
  }),
  params: z.object({}),
  query: z.object({})
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type LogoutInput = z.infer<typeof logoutSchema>["body"];
export type RefreshInput = z.infer<typeof refreshSchema>["body"];
