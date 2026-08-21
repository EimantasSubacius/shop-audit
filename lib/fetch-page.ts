import { getConfig } from "@/lib/config";

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

export async function fetchPage(url: string): Promise<FetchPageResult> {
  const { timeoutMs, userAgent, maxBodyBytes } = getConfig();
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      return {
        ok: false,
        error: `Unexpected content type: ${contentType}`,
        timingMs: Date.now() - started,
      };
    }

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
      return {
        ok: true,
        finalUrl: response.url || url,
        status: response.status,
        headers: response.headers,
        html,
        timingMs: Date.now() - started,
      };
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

    const html = Buffer.concat(chunks).toString("utf8");
    return {
      ok: true,
      finalUrl: response.url || url,
      status: response.status,
      headers: response.headers,
      html,
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
