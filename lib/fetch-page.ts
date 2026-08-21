import {
  browserFetchHeaders,
  getConfig,
  retryUserAgent,
} from "@/lib/config";

export type FetchPageSuccess = {
  ok: true;
  finalUrl: string;
  status: number;
  headers: Headers;
  html: string;
  timingMs: number;
};

export type FetchPageFailure = {
  ok: false;
  error: string;
  timingMs: number;
};

export type FetchPageResult = FetchPageSuccess | FetchPageFailure;

export function looksLikeBotChallenge(html: string, status: number): boolean {
  const lower = html.slice(0, 8000).toLowerCase();
  if (status === 403 || status === 503) {
    if (
      lower.includes("just a moment") ||
      lower.includes("cf-browser-verification") ||
      lower.includes("cf-challenge") ||
      lower.includes("challenge-platform") ||
      lower.includes("attention required") ||
      lower.includes("enable javascript and cookies") ||
      lower.includes("checking your browser")
    ) {
      return true;
    }
  }
  if (
    lower.includes("just a moment...") &&
    lower.includes("cloudflare")
  ) {
    return true;
  }
  return false;
}

export function describeFetchBlock(
  status: number,
  finalUrl: string,
  html: string,
): string {
  if (looksLikeBotChallenge(html, status)) {
    return `This shop blocks automated scanners (bot protection / Cloudflare) at ${finalUrl}. Try another storefront, or audit a less protected demo URL.`;
  }
  if (status >= 400) {
    return `HTTP ${status} from ${finalUrl}. The server refused the homepage request.`;
  }
  return `Could not fetch ${finalUrl}.`;
}

async function readBody(
  response: Response,
  maxBodyBytes: number,
  controller: AbortController,
  started: number,
): Promise<{ ok: true; html: string } | FetchPageFailure> {
  const reader = response.body?.getReader();
  if (!reader) {
    const html = await response.text();
    if (html.length > maxBodyBytes) {
      return {
        ok: false,
        error: "Response body too large.",
        timingMs: Date.now() - started,
      };
    }
    return { ok: true, html };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBodyBytes) {
      controller.abort();
      return {
        ok: false,
        error: "Response body too large.",
        timingMs: Date.now() - started,
      };
    }
    chunks.push(value);
  }

  return { ok: true, html: Buffer.concat(chunks).toString("utf8") };
}

async function attemptFetch(
  url: string,
  userAgent: string,
  timeoutMs: number,
  maxBodyBytes: number,
): Promise<FetchPageResult> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: browserFetchHeaders(userAgent, url),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml") &&
      response.ok
    ) {
      return {
        ok: false,
        error: `Unexpected content type: ${contentType}`,
        timingMs: Date.now() - started,
      };
    }

    const body = await readBody(response, maxBodyBytes, controller, started);
    if (!body.ok) return body;

    return {
      ok: true,
      finalUrl: response.url || url,
      status: response.status,
      headers: response.headers,
      html: body.html,
      timingMs: Date.now() - started,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? `Timed out after ${timeoutMs}ms.`
        : err instanceof Error
          ? err.message
          : "Failed to fetch page.";
    return { ok: false, error: message, timingMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function isBlocked(result: FetchPageResult): boolean {
  if (!result.ok) return true;
  if (result.status >= 400) return true;
  if (looksLikeBotChallenge(result.html, result.status)) return true;
  return false;
}

function altWwwUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.startsWith("www.")) {
      u.hostname = u.hostname.slice(4);
    } else {
      u.hostname = `www.${u.hostname}`;
    }
    return u.toString();
  } catch {
    return null;
  }
}

export async function fetchPage(url: string): Promise<FetchPageResult> {
  const { timeoutMs, userAgent, maxBodyBytes } = getConfig();
  const attempts: { url: string; ua: string }[] = [
    { url, ua: userAgent },
    { url, ua: retryUserAgent() },
  ];
  const www = altWwwUrl(url);
  if (www) {
    attempts.push({ url: www, ua: userAgent });
  }

  let last: FetchPageResult | null = null;
  for (const attempt of attempts) {
    const result = await attemptFetch(
      attempt.url,
      attempt.ua,
      timeoutMs,
      maxBodyBytes,
    );
    last = result;
    if (!isBlocked(result)) return result;
  }

  return last as FetchPageResult;
}
