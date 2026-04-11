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
    return sendError(res, "Datos inválidos", 422, error.flatten());
  }

  return sendError(res, "Error interno del servidor", 500, null);
};
