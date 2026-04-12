import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../shared/errors/AppError.js";
import { verifyToken } from "../shared/utils/tokens.js";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Token no proporcionado", 401));
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token, env.SUPABASE_JWT_SECRET, "access");

    req.authUser = {
      id: payload.sub,
      email: payload.email
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Token inválido", 401));
  }
};
