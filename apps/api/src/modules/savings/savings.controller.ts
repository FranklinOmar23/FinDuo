import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.js";
import { savingsService } from "./savings.service.js";

export class SavingsController {
  async list(req: Request, res: Response) {
    const data = await savingsService.listGoals(req.authUser!.id);
    return sendSuccess(res, data, "Metas obtenidas");
  }

  async create(req: Request, res: Response) {
    const data = await savingsService.createGoal(req.body, req.authUser!.id);
    return sendSuccess(res, data, "Meta creada", 201);
  }

  async updateAmount(req: Request, res: Response) {
    const data = await savingsService.updateAmount(req.authUser!.id, String(req.params.id), req.body);
    return sendSuccess(res, data, "Monto actual actualizado");
  }

  async remove(req: Request, res: Response) {
    const data = await savingsService.deleteGoal(req.authUser!.id, String(req.params.id));
    return sendSuccess(res, data, "Meta eliminada");
  }
}

export const savingsController = new SavingsController();
