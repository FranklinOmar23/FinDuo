import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { expensesController } from "./expenses.controller.js";
import { createExpenseSchema, deleteExpenseSchema, listExpensesSchema } from "./expenses.schema.js";

export const expensesRouter: ExpressRouter = Router();

expensesRouter.get("/", validate(listExpensesSchema), asyncHandler(expensesController.list.bind(expensesController)));
expensesRouter.post("/", validate(createExpenseSchema), asyncHandler(expensesController.create.bind(expensesController)));
expensesRouter.delete("/:id", validate(deleteExpenseSchema), asyncHandler(expensesController.remove.bind(expensesController)));

export default expensesRouter;
