import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { contributionsController } from "./contributions.controller.js";
import {
  createContributionSchema,
  deleteContributionSchema,
  listContributionSchema
} from "./contributions.schema.js";

export const contributionsRouter: ExpressRouter = Router();

contributionsRouter.get("/", validate(listContributionSchema), asyncHandler(contributionsController.list.bind(contributionsController)));
contributionsRouter.post("/", validate(createContributionSchema), asyncHandler(contributionsController.create.bind(contributionsController)));
contributionsRouter.delete(
  "/:id",
  validate(deleteContributionSchema),
  asyncHandler(contributionsController.remove.bind(contributionsController))
);

export default contributionsRouter;
