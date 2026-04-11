import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.js";
import { couplesService } from "./couples.service.js";

export class CouplesController {
  async createCouple(req: Request, res: Response) {
    const data = await couplesService.createCouple(req.authUser!.id, req.body);
    return sendSuccess(res, data, "Pareja creada", 201);
  }

  async getMyCouple(req: Request, res: Response) {
    const data = await couplesService.getMyCouple(req.authUser!.id);
    return sendSuccess(res, data, "Pareja actual obtenida");
  }

  async joinCouple(req: Request, res: Response) {
    const data = await couplesService.joinCouple(req.authUser!.id, req.body);
    return sendSuccess(res, data, "Te uniste a la pareja");
  }

  async updateSavingsPercent(req: Request, res: Response) {
    const data = await couplesService.updateSavingsPercent(String(req.params.id), req.body);
    return sendSuccess(res, data, "Porcentaje de ahorro actualizado");
  }
}

export const couplesController = new CouplesController();
