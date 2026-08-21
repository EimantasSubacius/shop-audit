import type { CheckModule, CheckResult, CheckStatus } from "@/lib/types";

export function withScore(
  partial: Omit<CheckResult, "score">,
): CheckResult {
  const score =
    partial.status === "pass"
      ? partial.weight
      : partial.status === "warn"
        ? Math.round(partial.weight * 0.5)
        : 0;
  return { ...partial, score };
}

export function statusFromCount(
  count: number,
  { passAt, warnAt }: { passAt: number; warnAt: number },
): CheckStatus {
  if (count >= passAt) return "pass";
  if (count >= warnAt) return "warn";
  return "fail";
}

export function linkMatches(
  links: { href: string; text: string }[],
  patterns: RegExp[],
): { href: string; text: string } | undefined {
  return links.find((link) => {
    const hay = `${link.href} ${link.text}`.toLowerCase();
    return patterns.some((re) => re.test(hay));
  });
}

export function defineCheck(mod: CheckModule): CheckModule {
  return mod;
}
