export function getConfig() {
  return {
    timeoutMs: Number(process.env.AUDIT_TIMEOUT_MS ?? 10000),
    maxRedirects: Number(process.env.AUDIT_MAX_REDIRECTS ?? 5),
    userAgent:
      process.env.AUDIT_USER_AGENT ??
      "ShopAuditBot/1.0 (+https://github.com/EimantasSubacius/shop-audit)",
    maxBodyBytes: Number(process.env.AUDIT_MAX_BODY_BYTES ?? 1_500_000),
    rateLimitPerMinute: Number(process.env.AUDIT_RATE_LIMIT_PER_MINUTE ?? 5),
  };
}
