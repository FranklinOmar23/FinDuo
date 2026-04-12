import { createHmac, timingSafeEqual } from "node:crypto";
import type { AuthSession } from "@finduo/types";
import { AppError } from "../errors/AppError.js";

type TokenType = "access" | "refresh";

interface TokenPayload {
  sub: string;
  email: string;
  type: TokenType;
  iat: number;
  exp: number;
}

const toBase64Url = (value: Buffer | string) => {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64");
};

const sign = (input: string, secret: string) => {
  return toBase64Url(createHmac("sha256", secret).update(input).digest());
};

const createToken = (payload: TokenPayload, secret: string) => {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`, secret);
  return `${header}.${body}.${signature}`;
};

const verifySignature = (header: string, body: string, signature: string, secret: string) => {
  const expected = Buffer.from(sign(`${header}.${body}`, secret));
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
};

export const createAuthSession = (
  user: { id: string; email: string },
  secret: string,
  accessTokenMinutes: number,
  refreshTokenDays: number
): AuthSession => {
  const now = Math.floor(Date.now() / 1000);
  const accessExp = now + accessTokenMinutes * 60;
  const refreshExp = now + refreshTokenDays * 24 * 60 * 60;

  return {
    accessToken: createToken(
      {
        sub: user.id,
        email: user.email,
        type: "access",
        iat: now,
        exp: accessExp
      },
      secret
    ),
    refreshToken: createToken(
      {
        sub: user.id,
        email: user.email,
        type: "refresh",
        iat: now,
        exp: refreshExp
      },
      secret
    ),
    expiresAt: accessExp
  };
};

export const verifyToken = (token: string, secret: string, expectedType: TokenType) => {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    throw new AppError("Token inválido", 401);
  }

  if (!verifySignature(header, body, signature, secret)) {
    throw new AppError("Token inválido", 401);
  }

  let payload: TokenPayload;

  try {
    payload = JSON.parse(fromBase64Url(body).toString("utf8")) as TokenPayload;
  } catch {
    throw new AppError("Token inválido", 401);
  }

  const now = Math.floor(Date.now() / 1000);

  if (payload.type !== expectedType || payload.exp <= now) {
    throw new AppError("Token inválido o expirado", 401);
  }

  return payload;
};