export type ErrorCode =
  | "bad_request"
  | "rate_limited"
  | "not_configured"
  | "upstream_error";

export function json(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function fail(
  status: number,
  code: ErrorCode,
  message: string,
  headers?: Record<string, string>,
): Response {
  return json(status, { error: { code, message } }, headers);
}

// ---------- الإعدادات ----------
const WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 40_000; // 8000 حرف عربي ≈ 24KB + هامش JSON
const GLOBAL_LIMIT = 60; // سقف كل الطلبات لكل دالة بالدقيقة
const MAX_TRACKED_KEYS = 5_000;

// ---------- حدّ المعدّل (best effort: الذاكرة تتصفّر مع cold start) ----------
const hits = new Map<string, number[]>();

/** يسجّل طلبًا جديدًا ويرجع false لو تجاوز الحدّ */
function allow(key: string, limit: number, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** يمنع تضخّم الذاكرة: يمسح المفاتيح القديمة لما يكثر عددها */
function purge(now: number): void {
  if (hits.size <= MAX_TRACKED_KEYS) return;
  for (const [key, times] of hits) {
    const last = times[times.length - 1] ?? 0;
    if (now - last >= WINDOW_MS) hits.delete(key);
  }
}

function clientIp(request: Request): string {
  const h = request.headers;
  const raw =
    h.get("x-vercel-forwarded-for") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for") ??
    "";
  return raw.split(",")[0]?.trim() || "unknown";
}

/** يسمح فقط بطلبات من نفس الموقع (أو localhost أثناء التطوير) */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // أدوات مثل curl ما بتبعت Origin، الحدّ يحميها
  try {
    const url = new URL(origin);
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return (
      url.host === host ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

interface GuardOptions {
  /** اسم الدالة، يفصل العدّادات بين الدوال */
  name: string;
  /** أقصى عدد طلبات لكل IP بالدقيقة */
  limit: number;
}

/**
 * يرجع Response جاهز (رفض) أو null لو الطلب سليم.
 * الاستخدام: const blocked = guardRequest(request, {...}); if (blocked) return blocked;
 */
export function guardRequest(
  request: Request,
  { name, limit }: GuardOptions,
): Response | null {
  if (!isAllowedOrigin(request)) {
    return fail(403, "bad_request", "Origin not allowed.");
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
    return fail(413, "bad_request", "Request body is too large.");
  }

  const now = Date.now();
  purge(now);

  const tooMany = () =>
    fail(429, "rate_limited", "Too many requests. Try again in a minute.", {
      "Retry-After": "60",
    });

  if (!allow(`${name}:*`, GLOBAL_LIMIT, now)) return tooMany();
  if (!allow(`${name}:${clientIp(request)}`, limit, now)) return tooMany();

  return null;
}