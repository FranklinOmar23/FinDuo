import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { couplesController } from "./couples.controller.js";
import {
  createCoupleSchema,
  joinCoupleSchema,
  updateSavingsPercentSchema
} from "./couples.schema.js";

export const couplesRouter: ExpressRouter = Router();

couplesRouter.post("/", validate(createCoupleSchema), asyncHandler(couplesController.createCouple.bind(couplesController)));
couplesRouter.get("/me", asyncHandler(couplesController.getMyCouple.bind(couplesController)));
couplesRouter.post("/join", validate(joinCoupleSchema), asyncHandler(couplesController.joinCouple.bind(couplesController)));
couplesRouter.patch(
  "/:id/savings-percent",
  validate(updateSavingsPercentSchema),
  asyncHandler(couplesController.updateSavingsPercent.bind(couplesController))
);

export default couplesRouter;
