import { defineCheck } from "@/lib/checks/helpers";

export const h1Check = defineCheck({
  id: "h1",
  title: "H1 heading",
  weight: 6,
  run(page) {
    const count = page.h1Texts.length;
    if (count === 0) {
      return {
        id: "h1",
        title: "H1 heading",
        weight: 6,
        status: "fail",
        message: "No H1 found. Add one primary heading for the homepage.",
      };
    }
    if (count > 1) {
      return {
        id: "h1",
        title: "H1 heading",
        weight: 6,
        status: "warn",
        message: `Found ${count} H1 tags. Prefer a single clear H1.`,
        evidence: page.h1Texts.slice(0, 3).join(" | "),
      };
    }
    return {
      id: "h1",
      title: "H1 heading",
      weight: 6,
      status: "pass",
      message: "Exactly one H1 found.",
      evidence: page.h1Texts[0],
    };
  },
});
