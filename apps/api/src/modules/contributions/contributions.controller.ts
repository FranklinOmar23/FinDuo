import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.js";
import { contributionsService } from "./contributions.service.js";

export class ContributionsController {
  async list(req: Request, res: Response) {
    const data = await contributionsService.listContributions(req.authUser!.id, req.query as { month?: string });
    return sendSuccess(res, data, "Aportes obtenidos");
  }

  async create(req: Request, res: Response) {
    const data = await contributionsService.createContribution(req.authUser!.id, req.body);
    return sendSuccess(res, data, "Aporte registrado", 201);
  }

  async remove(req: Request, res: Response) {
    const data = await contributionsService.deleteContribution(req.authUser!.id, String(req.params.id));
    return sendSuccess(res, data, "Aporte eliminado");
  }
}

export const contributionsController = new ContributionsController();
