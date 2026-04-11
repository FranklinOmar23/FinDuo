import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.js";
import { authService } from "./auth.service.js";

export class AuthController {
  async register(req: Request, res: Response) {
    const data = await authService.register(req.body);
    return sendSuccess(res, data, "Usuario registrado", 201);
  }

  async login(req: Request, res: Response) {
    const data = await authService.login(req.body);
    return sendSuccess(res, data, "Sesión iniciada");
  }

  async refresh(req: Request, res: Response) {
    const data = await authService.refreshSession(req.body);
    return sendSuccess(res, data, "Sesión renovada");
  }

  async logout(req: Request, res: Response) {
    const data = await authService.logout(req.body);
    return sendSuccess(res, data, "Sesión cerrada");
  }
}

export const authController = new AuthController();
