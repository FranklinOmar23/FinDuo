import cors from "cors";
import express, { type Express } from "express";
import { env } from "./config/env.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.router.js";
import contributionsRouter from "./modules/contributions/contributions.router.js";
import couplesRouter from "./modules/couples/couples.router.js";
import dashboardRouter from "./modules/dashboard/dashboard.router.js";
import expensesRouter from "./modules/expenses/expenses.router.js";
import savingsRouter from "./modules/savings/savings.router.js";
import { sendSuccess } from "./shared/utils/response.js";

export const app: Express = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => sendSuccess(res, { status: "ok" }, "API operativa"));
app.use("/api/auth", authRouter);
app.use("/api/couples", authMiddleware, couplesRouter);
app.use("/api/contributions", authMiddleware, contributionsRouter);
app.use("/api/expenses", authMiddleware, expensesRouter);
app.use("/api/savings", authMiddleware, savingsRouter);
app.use("/api/dashboard", authMiddleware, dashboardRouter);
app.use(errorMiddleware);
