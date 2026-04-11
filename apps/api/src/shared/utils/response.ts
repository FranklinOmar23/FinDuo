import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Operación completada",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  data: unknown = null
) => {
  return res.status(statusCode).json({
    success: false,
    data,
    message
  });
};
