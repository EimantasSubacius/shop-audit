import type { CheckResult, TopFix } from "@/lib/types";

export function scoreChecks(checks: CheckResult[]): {
  totalScore: number;
  maxScore: number;
  percent: number;
} {
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.weight, 0);
  const percent =
    maxScore === 0 ? 0 : Math.round((100 * totalScore) / maxScore);
  return { totalScore, maxScore, percent };
}

export function deriveTopFixes(checks: CheckResult[], limit = 3): TopFix[] {
  const ranked = checks
    .filter((c) => c.status === "fail" || c.status === "warn")
    .sort((a, b) => {
      const sev = (s: CheckResult["status"]) => (s === "fail" ? 2 : 1);
      const bySev = sev(b.status) - sev(a.status);
      if (bySev !== 0) return bySev;
      return b.weight - a.weight;
    })
    .slice(0, limit);

  return ranked.map((c) => ({
    id: c.id,
    title: c.title,
    message: c.message,
  }));
}
