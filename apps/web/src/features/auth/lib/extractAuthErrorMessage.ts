import axios from "axios";

interface ApiErrorPayload {
  message?: string;
  data?: unknown;
}

const flattenValidationData = (data: unknown) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const fieldErrors = "fieldErrors" in data ? data.fieldErrors : null;

  if (!fieldErrors || typeof fieldErrors !== "object") {
    return null;
  }

  const messages = Object.values(fieldErrors)
    .flatMap((value) => (Array.isArray(value) ? value : []))
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  return messages[0] ?? null;
};

export const extractAuthErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return fallback;
  }

  const payload = error.response?.data;

  if (typeof payload?.data === "string" && payload.data.trim().length > 0) {
    return payload.data;
  }

  const validationMessage = flattenValidationData(payload?.data);

  if (validationMessage) {
    return validationMessage;
  }

  if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
    return payload.message;
  }

  return fallback;
};