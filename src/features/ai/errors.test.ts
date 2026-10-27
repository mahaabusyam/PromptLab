import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { AiError, getAiErrorMessage, toAiError } from "./errors";

function httpFailure(
  status: number,
  data: unknown,
  headers: Record<string, string> = {},
) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("failed", AxiosError.ERR_BAD_RESPONSE, config, null, {
    status,
    statusText: "",
    data,
    headers,
    config,
  });
}

describe("toAiError", () => {
  it("maps 429 to rate_limited and reads Retry-After", () => {
    const body = { error: { code: "rate_limited", message: "Slow down" } };
    const error = toAiError(httpFailure(429, body, { "retry-after": "30" }));
    expect(error.code).toBe("rate_limited");
    expect(error.retryAfterSeconds).toBe(30);
    expect(error.message).toBe("Slow down");
  });

  it("maps 400 to bad_request", () => {
    expect(toAiError(httpFailure(400, {})).code).toBe("bad_request");
  });

  it("maps 404 and 503 to unavailable (no AI service configured)", () => {
    expect(toAiError(httpFailure(404, "")).code).toBe("unavailable");
    expect(toAiError(httpFailure(503, {})).code).toBe("unavailable");
  });

  it("maps other server errors to upstream_error", () => {
    expect(toAiError(httpFailure(502, {})).code).toBe("upstream_error");
    expect(toAiError(httpFailure(500, null)).code).toBe("upstream_error");
  });

  it("maps a timeout", () => {
    expect(toAiError(new AxiosError("timeout", "ECONNABORTED")).code).toBe(
      "timeout",
    );
  });

  it("maps a request that never got a response to network", () => {
    expect(toAiError(new AxiosError("Network Error", "ERR_NETWORK")).code).toBe(
      "network",
    );
  });

  it("wraps unknown errors and keeps AiError as-is", () => {
    expect(toAiError(new Error("boom")).code).toBe("upstream_error");
    const original = new AiError("timeout", "x");
    expect(toAiError(original)).toBe(original);
  });
});

describe("getAiErrorMessage", () => {
  it("includes the wait time for rate limits", () => {
    const message = getAiErrorMessage(new AiError("rate_limited", "x", 30));
    expect(message).toContain("30 seconds");
  });

  it("tells the user prompts still work offline when AI is unavailable", () => {
    expect(getAiErrorMessage(new AiError("unavailable", "x"))).toContain(
      "offline",
    );
  });
});
