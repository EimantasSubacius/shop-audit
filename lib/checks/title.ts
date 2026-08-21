import { defineCheck } from "@/lib/checks/helpers";

export const titleCheck = defineCheck({
  id: "title",
  title: "Page title",
  weight: 8,
  run(page) {
    const title = page.title;
    if (!title) {
      return {
        id: "title",
        title: "Page title",
        weight: 8,
        status: "fail",
        message: "Missing <title>. Add a clear product/brand title.",
      };
    }
    const len = title.length;
    if (len < 20 || len > 70) {
      return {
        id: "title",
        title: "Page title",
        weight: 8,
        status: "warn",
        message: `Title length is ${len} chars (aim ~30-60).`,
        evidence: title,
      };
    }
    return {
      id: "title",
      title: "Page title",
      weight: 8,
      status: "pass",
      message: "Title looks present and reasonably sized.",
      evidence: title,
    };
  },
});
