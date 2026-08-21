import { allChecks } from "@/lib/checks";
import { withScore } from "@/lib/checks/helpers";
import {
  describeFetchBlock,
  fetchPage,
  looksLikeBotChallenge,
} from "@/lib/fetch-page";
import { parsePage } from "@/lib/parse-page";
import { deriveTopFixes, scoreChecks } from "@/lib/score/calculate-score";
import type { AuditReport, CheckResult, ParsedPage } from "@/lib/types";
import { normalizeAuditUrl } from "@/lib/url";

function runChecks(page: ParsedPage): CheckResult[] {
  return allChecks.map((check) => withScore(check.run(page)));
}

export function runAuditOnHtml(
  url: string,
  finalUrl: string,
  html: string,
  durationMs = 0,
): AuditReport {
  const page = parsePage(html, finalUrl);
  const checks = runChecks(page);
  const { totalScore, maxScore, percent } = scoreChecks(checks);

  return {
    url,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    durationMs,
    totalScore,
    maxScore,
    percent,
    checks,
    topFixes: deriveTopFixes(checks),
    fetchOk: true,
  };
}

export function buildFetchFailedReport(
  url: string,
  error: string,
  durationMs: number,
): AuditReport {
  const check: CheckResult = {
    id: "https",
    title: "Fetch homepage",
    status: "fail",
    weight: 100,
    score: 0,
    message: error,
  };

  return {
    url,
    finalUrl: url,
    fetchedAt: new Date().toISOString(),
    durationMs,
    totalScore: 0,
    maxScore: 100,
    percent: 0,
    checks: [check],
    topFixes: [
      {
        id: "https",
        title: "Fetch homepage",
        message: error,
      },
    ],
    fetchOk: false,
    fetchError: error,
  };
}

export async function runAudit(rawUrl: string): Promise<
  | { ok: true; report: AuditReport }
  | { ok: false; error: string }
> {
  const normalized = normalizeAuditUrl(rawUrl);
  if (!normalized.ok) {
    return { ok: false, error: normalized.error };
  }

  const fetched = await fetchPage(normalized.url);
  if (!fetched.ok) {
    return {
      ok: true,
      report: buildFetchFailedReport(
        normalized.url,
        fetched.error,
        fetched.timingMs,
      ),
    };
  }

  if (
    fetched.status >= 400 ||
    looksLikeBotChallenge(fetched.html, fetched.status)
  ) {
    return {
      ok: true,
      report: buildFetchFailedReport(
        normalized.url,
        describeFetchBlock(fetched.status, fetched.finalUrl, fetched.html),
        fetched.timingMs,
      ),
    };
  }

  return {
    ok: true,
    report: runAuditOnHtml(
      normalized.url,
      fetched.finalUrl,
      fetched.html,
      fetched.timingMs,
    ),
  };
}
