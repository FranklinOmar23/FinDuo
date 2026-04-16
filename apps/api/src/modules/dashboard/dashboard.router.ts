import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { dashboardController } from "./dashboard.controller.js";
import { dashboardGetSummarySchema } from "./dashboard.schema.js";

export const dashboardRouter: ExpressRouter = Router();

dashboardRouter.get("/", validate(dashboardGetSummarySchema), asyncHandler(dashboardController.getSummary.bind(dashboardController)));

export default dashboardRouter;
