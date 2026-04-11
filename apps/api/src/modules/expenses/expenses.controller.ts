import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.js";
import { expensesService } from "./expenses.service.js";

export class ExpensesController {
  async list(req: Request, res: Response) {
    const data = await expensesService.listExpenses(req.authUser!.id, req.query as { month?: string; category?: string });
    return sendSuccess(res, data, "Gastos obtenidos");
  }

  async create(req: Request, res: Response) {
    const data = await expensesService.createExpense(req.authUser!.id, req.body);
    return sendSuccess(res, data, "Gasto registrado", 201);
  }

  async remove(req: Request, res: Response) {
    const data = await expensesService.deleteExpense(req.authUser!.id, String(req.params.id));
    return sendSuccess(res, data, "Gasto eliminado");
  }
}

export const expensesController = new ExpensesController();
