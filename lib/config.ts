export function getConfig() {
  return {
    timeoutMs: Number(process.env.AUDIT_TIMEOUT_MS ?? 15000),
    maxRedirects: Number(process.env.AUDIT_MAX_REDIRECTS ?? 5),
    userAgent:
      process.env.AUDIT_USER_AGENT ??
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    maxBodyBytes: Number(process.env.AUDIT_MAX_BODY_BYTES ?? 1_500_000),
    rateLimitPerMinute: Number(process.env.AUDIT_RATE_LIMIT_PER_MINUTE ?? 5),
  };
}

/** Browser-like headers so fewer shops WAF-block the request. */
export function browserFetchHeaders(userAgent: string, _url: string): Record<string, string> {
  return {
    "User-Agent": userAgent,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "lt-LT,lt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"macOS"',
    Referer: "https://www.google.com/",
    Priority: "u=0, i",
  };
}

export function retryUserAgent(): string {
  return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
}
