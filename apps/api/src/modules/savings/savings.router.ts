import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { savingsController } from "./savings.controller.js";
import {
  createSavingsSchema,
  deleteSavingsSchema,
  listSavingsSchema,
  updateSavingsAmountSchema
} from "./savings.schema.js";

export const savingsRouter: ExpressRouter = Router();

savingsRouter.get("/", validate(listSavingsSchema), asyncHandler(savingsController.list.bind(savingsController)));
savingsRouter.post("/", validate(createSavingsSchema), asyncHandler(savingsController.create.bind(savingsController)));
savingsRouter.patch(
  "/:id/amount",
  validate(updateSavingsAmountSchema),
  asyncHandler(savingsController.updateAmount.bind(savingsController))
);
savingsRouter.delete("/:id", validate(deleteSavingsSchema), asyncHandler(savingsController.remove.bind(savingsController)));

export default savingsRouter;
