import { defineCheck } from "@/lib/checks/helpers";

export const httpsCheck = defineCheck({
  id: "https",
  title: "HTTPS",
  weight: 10,
  run(page) {
    const secure = page.finalUrl.startsWith("https:");
    return {
      id: "https",
      title: "HTTPS",
      weight: 10,
      status: secure ? "pass" : "fail",
      message: secure
        ? "Site is served over HTTPS."
        : "Site is not on HTTPS. Enable TLS and redirect HTTP to HTTPS.",
      evidence: page.finalUrl,
    };
  },
});
