import { Router, type Router as ExpressRouter } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { dashboardController } from "./dashboard.controller.js";

export const dashboardRouter: ExpressRouter = Router();

dashboardRouter.get("/", asyncHandler(dashboardController.getSummary.bind(dashboardController)));

export default dashboardRouter;
