import { runAudit } from "@/lib/audit/run-audit";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ApiErrorBody } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    const body: ApiErrorBody = {
      error: "Rate limit exceeded. Try again in a minute.",
      code: "rate_limited",
    };
    return NextResponse.json(body, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    const body: ApiErrorBody = { error: "Invalid JSON body.", code: "bad_json" };
    return NextResponse.json(body, { status: 400 });
  }

  const url =
    typeof payload === "object" &&
    payload !== null &&
    "url" in payload &&
    typeof (payload as { url: unknown }).url === "string"
      ? (payload as { url: string }).url
      : null;

  if (!url) {
    const body: ApiErrorBody = {
      error: "Body must include a string `url` field.",
      code: "validation",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const result = await runAudit(url);
  if (!result.ok) {
    const body: ApiErrorBody = { error: result.error, code: "validation" };
    return NextResponse.json(body, { status: 400 });
  }

  return NextResponse.json(result.report);
}
