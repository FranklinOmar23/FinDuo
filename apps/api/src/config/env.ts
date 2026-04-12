import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

const envPath = resolve(process.cwd(), ".env");
const clientUrlsSchema = z
  .string()
  .optional()
  .transform((value) => value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [])
  .pipe(z.array(z.string().url()));

if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url(),
  CLIENT_URLS: clientUrlsSchema,
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(32),
  AUTH_ACCESS_TOKEN_MINUTES: z.coerce.number().int().positive().default(60),
  AUTH_REFRESH_TOKEN_DAYS: z.coerce.number().int().positive().default(30)
});

export const env = envSchema.parse(process.env);
