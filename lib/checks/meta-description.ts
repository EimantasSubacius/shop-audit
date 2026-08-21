import { defineCheck } from "@/lib/checks/helpers";

export const metaDescriptionCheck = defineCheck({
  id: "meta_description",
  title: "Meta description",
  weight: 6,
  run(page) {
    const desc = page.metaDescription;
    if (!desc) {
      return {
        id: "meta_description",
        title: "Meta description",
        weight: 6,
        status: "fail",
        message: "Missing meta description. Add a concise SEO summary.",
      };
    }
    const len = desc.length;
    if (len < 50 || len > 160) {
      return {
        id: "meta_description",
        title: "Meta description",
        weight: 6,
        status: "warn",
        message: `Meta description length is ${len} chars (aim ~50-160).`,
        evidence: desc.slice(0, 120),
      };
    }
    return {
      id: "meta_description",
      title: "Meta description",
      weight: 6,
      status: "pass",
      message: "Meta description looks present and sized well.",
      evidence: desc.slice(0, 120),
    };
  },
});
