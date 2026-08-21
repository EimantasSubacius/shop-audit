import { defineCheck } from "@/lib/checks/helpers";

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;

export const footerContactCheck = defineCheck({
  id: "footer_contact",
  title: "Contact signals",
  weight: 4,
  run(page) {
    const email = page.html.match(EMAIL_RE)?.[0];
    const phone = page.html.match(PHONE_RE)?.[0];

    if (email || phone) {
      return {
        id: "footer_contact",
        title: "Contact signals",
        weight: 4,
        status: "pass",
        message: "Email or phone contact signal found in page HTML.",
        evidence: [email, phone].filter(Boolean).join(" · "),
      };
    }

    return {
      id: "footer_contact",
      title: "Contact signals",
      weight: 4,
      status: "warn",
      message: "No obvious email/phone found. Add visible contact details.",
    };
  },
});
