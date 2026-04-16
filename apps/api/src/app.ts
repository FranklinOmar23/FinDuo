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
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://finduo-front.onrender.com",
  env.CLIENT_URL,
  ...env.CLIENT_URLS
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requerir Origin header por seguridad (prevenir CSRF)
      if (!origin) {
        console.warn("[CORS] Solicitud sin header Origin rechazada");
        callback(new Error("Origin header requerido"));
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`[CORS] Origen rechazado: ${origin}`);
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
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
