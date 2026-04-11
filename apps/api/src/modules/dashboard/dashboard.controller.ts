import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.js";
import { dashboardService } from "./dashboard.service.js";

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const data = await dashboardService.getMonthlySummary(req.authUser!.id, month);
    return sendSuccess(res, data, "Resumen mensual obtenido");
  }
}

export const dashboardController = new DashboardController();
