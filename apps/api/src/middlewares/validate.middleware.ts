import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../shared/errors/AppError.js";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(new AppError("Datos inválidos", 422, result.error.flatten()));
    }

    req.body = result.data.body;
    req.params = result.data.params as Request["params"];
    req.query = result.data.query as Request["query"];
    next();
  };
};
