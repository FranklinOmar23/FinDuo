import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/AppError.js";
import { sendError } from "../shared/utils/response.js";

const isAppErrorLike = (
  error: unknown
): error is { message: string; statusCode: number; details?: unknown } => {
  return typeof error === "object" && error !== null && "message" in error && "statusCode" in error;
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return sendError(res, error.message, error.statusCode, error.details ?? null);
  }

  if (isAppErrorLike(error)) {
    return sendError(res, error.message, error.statusCode, error.details ?? null);
  }

  if (error instanceof ZodError) {
    // En producción, no exponer detalles internos de validación
    if (process.env.NODE_ENV === "production") {
      return sendError(res, "Datos inválidos", 422, null);
    }
    // En desarrollo, mostrar detalles para debugging
    return sendError(res, "Datos inválidos", 422, error.flatten());
  }

  console.error("[ERROR] Error no manejado:", error);
  return sendError(res, "Error interno del servidor", 500, null);
};
