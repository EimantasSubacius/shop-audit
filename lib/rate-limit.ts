import { getConfig } from "@/lib/config";

type Bucket = number[];

const hits = new Map<string, Bucket>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
} {
  const { rateLimitPerMinute } = getConfig();
  const now = Date.now();
  const windowMs = 60_000;
  const prev = hits.get(ip) ?? [];
  const recent = prev.filter((t) => now - t < windowMs);

  if (recent.length >= rateLimitPerMinute) {
    hits.set(ip, recent);
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  hits.set(ip, recent);
  return {
    allowed: true,
    remaining: Math.max(0, rateLimitPerMinute - recent.length),
  };
}
