import { defineCheck } from "@/lib/checks/helpers";

const POLICY_GROUPS: { name: string; patterns: RegExp[] }[] = [
  {
    name: "shipping",
    patterns: [/shipping/i, /pristatym/i, /delivery/i, /siuntim/i],
  },
  {
    name: "returns",
    patterns: [/return/i, /refund/i, /grąžin/i, /grazin/i, /exchange/i],
  },
  {
    name: "privacy",
    patterns: [/privacy/i, /privat/i, /gdpr/i, /duomenų apsaug/i],
  },
];

export const policyPagesCheck = defineCheck({
  id: "policy_pages",
  title: "Policy pages",
  weight: 8,
  run(page) {
    const found: string[] = [];
    for (const group of POLICY_GROUPS) {
      const hit = page.links.some((link) => {
        const hay = `${link.href} ${link.text}`;
        return group.patterns.some((re) => re.test(hay));
      });
      if (hit) found.push(group.name);
    }

    if (found.length >= 3) {
      return {
        id: "policy_pages",
        title: "Policy pages",
        weight: 8,
        status: "pass",
        message: "Shipping, returns, and privacy signals found.",
        evidence: found.join(", "),
      };
    }
    if (found.length >= 1) {
      return {
        id: "policy_pages",
        title: "Policy pages",
        weight: 8,
        status: "warn",
        message: `Only found: ${found.join(", ")}. Add missing trust/policy pages.`,
        evidence: found.join(", "),
      };
    }
    return {
      id: "policy_pages",
      title: "Policy pages",
      weight: 8,
      status: "fail",
      message:
        "No shipping/returns/privacy links found. These reduce checkout anxiety.",
    };
  },
});
