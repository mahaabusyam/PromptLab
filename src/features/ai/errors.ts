import { isAxiosError } from "axios";
import i18n from "i18next";
import "@/i18n"; // يضمن تهيئة الترجمة حتى لو الملف انستورد لحاله (مثلًا بالاختبارات)
import { formatNumber } from "@/i18n/format";
import { errorBodySchema } from "./schemas";
import { MAX_AI_PROMPT_CHARS } from "./types";
import type { AiErrorCode } from "./types";

export class AiError extends Error {
  readonly code: AiErrorCode;
  readonly retryAfterSeconds?: number;

  constructor(code: AiErrorCode, message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function readRetryAfter(value: unknown): number | undefined {
  const seconds = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined;
}

function codeFromStatus(status: number): AiErrorCode {
  if (status === 429) return "rate_limited";
  if (status === 400 || status === 422) return "bad_request";
  if (status === 404 || status === 503) return "unavailable";
  return "upstream_error";
}

/** Turns anything thrown by the request into one predictable error type. */
export function toAiError(error: unknown): AiError {
  if (error instanceof AiError) return error;

  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new AiError("timeout", "The request took too long.");
    }
    if (!error.response) {
      return new AiError("network", "Could not reach the AI service.");
    }

    const { status, data, headers } = error.response;
    const body = errorBodySchema.safeParse(data);
    const message = body.success
      ? body.data.error.message
      : `Request failed (${status}).`;
    return new AiError(
      codeFromStatus(status),
      message,
      readRetryAfter(headers["retry-after"]),
    );
  }

  return new AiError("upstream_error", "Something went wrong.");
}

/** نص مفهوم للمستخدم، بلغة الواجهة الحالية. (error.message نفسه للمطوّرين فقط) */
export function getAiErrorMessage(error: AiError): string {
  switch (error.code) {
    case "rate_limited":
      return error.retryAfterSeconds
        ? i18n.t("ai.errors.rateLimitedIn", {
            seconds: error.retryAfterSeconds,
          })
        : i18n.t("ai.errors.rateLimited");
    case "bad_request":
      return i18n.t("ai.errors.badRequest", {
        limit: formatNumber(MAX_AI_PROMPT_CHARS),
      });
    case "unavailable":
      return i18n.t("ai.errors.unavailable");
    case "timeout":
      return i18n.t("ai.errors.timeout");
    case "network":
      return i18n.t("ai.errors.network");
    case "invalid_response":
      return i18n.t("ai.errors.invalidResponse");
    case "upstream_error":
      return i18n.t("ai.errors.upstream");
  }
}
