import { defineCheck } from "@/lib/checks/helpers";

export const ogImageCheck = defineCheck({
  id: "og_image",
  title: "Open Graph image",
  weight: 4,
  run(page) {
    if (!page.ogImage) {
      return {
        id: "og_image",
        title: "Open Graph image",
        weight: 4,
        status: "warn",
        message: "Missing og:image. Add a share preview image.",
      };
    }
    return {
      id: "og_image",
      title: "Open Graph image",
      weight: 4,
      status: "pass",
      message: "Open Graph image is set.",
      evidence: page.ogImage,
    };
  },
});
