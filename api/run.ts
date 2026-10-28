import { z } from "zod";
import { fail, guardRequest, json } from "./_lib/guard.js";

const MAX_PROMPT_CHARS = 8000;
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

const bodySchema = z.object({
  prompt: z.string().trim().min(1).max(MAX_PROMPT_CHARS),
  maxTokens: z.number().int().min(256).max(4096).default(1024),
});

interface GeminiResponse {
  steps?: { type?: string; content?: { type?: string; text?: string }[] }[];
  usage?: { total_input_tokens?: number; total_output_tokens?: number };
}

export async function POST(request: Request): Promise<Response> {
  const blocked = guardRequest(request, { name: "run", limit: 10 });
  if (blocked) return blocked;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return fail(503, "not_configured", "AI service is not configured.");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail(400, "bad_request", "Request body must be valid JSON.");
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return fail(
      400,
      "bad_request",
      `Invalid input. Prompt must be 1–${MAX_PROMPT_CHARS} characters.`,
    );
  }
  const { prompt, maxTokens } = parsed.data;
  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const started = Date.now();

  try {
    const upstream = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        model,
        input: prompt,
        generation_config: { max_output_tokens: maxTokens },
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (upstream.status === 429) {
      return fail(
        429,
        "rate_limited",
        "The AI provider is busy. Try again shortly.",
        { "Retry-After": "30" },
      );
    }
    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 300);
      console.error("Gemini error:", upstream.status, detail);
      return fail(502, "upstream_error", "The AI provider returned an error.");
    }

    const data = (await upstream.json()) as GeminiResponse;
    const output = (data.steps ?? [])
      .filter((step) => step.type === "model_output")
      .flatMap((step) => step.content ?? [])
      .filter((part) => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("")
      .trim();

    if (!output) {
      console.error("Gemini empty answer:", JSON.stringify(data).slice(0, 300));
      return fail(
        502,
        "upstream_error",
        "The AI provider returned an empty answer.",
      );
    }

    return json(200, {
      output,
      model,
      latencyMs: Date.now() - started,
      inputTokens: data.usage?.total_input_tokens,
      outputTokens: data.usage?.total_output_tokens,
    });
  } catch (error) {
    console.error(
      "Run failed:",
      error instanceof Error ? error.name : "unknown",
    );
    return fail(502, "upstream_error", "Could not reach the AI provider.");
  }
}