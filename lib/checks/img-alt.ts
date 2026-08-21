import { defineCheck } from "@/lib/checks/helpers";

export const imgAltCheck = defineCheck({
  id: "img_alt",
  title: "Image alt text",
  weight: 5,
  run(page) {
    const images = page.images;
    if (images.length === 0) {
      return {
        id: "img_alt",
        title: "Image alt text",
        weight: 5,
        status: "pass",
        message: "No images found on the homepage.",
      };
    }

    const missing = images.filter(
      (img) => img.alt === undefined || img.alt.trim() === "",
    ).length;
    const pct = Math.round((missing / images.length) * 100);

    if (pct > 40) {
      return {
        id: "img_alt",
        title: "Image alt text",
        weight: 5,
        status: "fail",
        message: `${pct}% of images missing alt text (${missing}/${images.length}).`,
      };
    }
    if (pct > 15) {
      return {
        id: "img_alt",
        title: "Image alt text",
        weight: 5,
        status: "warn",
        message: `${pct}% of images missing alt text (${missing}/${images.length}).`,
      };
    }
    return {
      id: "img_alt",
      title: "Image alt text",
      weight: 5,
      status: "pass",
      message: `Most images have alt text (${images.length - missing}/${images.length}).`,
    };
  },
});
