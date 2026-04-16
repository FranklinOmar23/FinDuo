import type { NextFunction, Request, Response } from "express";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// Store para rate limiting: clave = IP:email, valor = { count, resetTime }
const rateLimitStore = new Map<string, RateLimitStore>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5; // máximo 5 intentos por IP:email

const getRateLimitKey = (req: Request, email?: string): string => {
  const ip = req.ip || "unknown";
  return email ? `${ip}:${email}` : ip;
};

export const authRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body?.email?.toLowerCase() || "";
  const key = getRateLimitKey(req, email);
  const now = Date.now();

  let limitData = rateLimitStore.get(key);

  // Si la ventana expiró, resetear
  if (!limitData || now >= limitData.resetTime) {
    limitData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(key, limitData);
  }

  limitData.count++;

  // Si excede el límite
  if (limitData.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((limitData.resetTime - now) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({
      success: false,
      message: `Demasiados intentos. Intenta nuevamente en ${retryAfter} segundos.`,
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter
    });
  }

  // Log de intentos para monitoreo de seguridad
  if (limitData.count === MAX_ATTEMPTS) {
    console.warn(`[SECURITY] Máximo de intentos alcanzado para ${key}`);
  }

  next();
};

// Cleanup de entradas antiguas cada 1 hora
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, data] of rateLimitStore.entries()) {
    if (now >= data.resetTime + RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[RATELIMIT] Limpieza: ${cleaned} entradas antiguas removidas`);
  }
}, 60 * 60 * 1000); // Cada hora
