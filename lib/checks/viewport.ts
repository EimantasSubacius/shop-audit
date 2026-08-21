import { defineCheck } from "@/lib/checks/helpers";

export const viewportCheck = defineCheck({
  id: "viewport",
  title: "Mobile viewport",
  weight: 8,
  run(page) {
    if (!page.hasViewport) {
      return {
        id: "viewport",
        title: "Mobile viewport",
        weight: 8,
        status: "fail",
        message: "Missing meta viewport. Mobile layout will suffer.",
      };
    }
    return {
      id: "viewport",
      title: "Mobile viewport",
      weight: 8,
      status: "pass",
      message: "Viewport meta tag is present.",
    };
  },
});
