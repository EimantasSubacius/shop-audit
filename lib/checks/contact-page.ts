import { defineCheck, linkMatches } from "@/lib/checks/helpers";

const CONTACT_PATTERNS = [
  /\/contact\b/i,
  /kontaktai/i,
  /kontakt/i,
  /\bcontact\b/i,
  /susisiek/i,
];

export const contactPageCheck = defineCheck({
  id: "contact_page",
  title: "Contact page",
  weight: 5,
  run(page) {
    const hit = linkMatches(page.links, CONTACT_PATTERNS);
    if (!hit) {
      return {
        id: "contact_page",
        title: "Contact page",
        weight: 5,
        status: "fail",
        message: "No contact page link found. Add an obvious contact entry point.",
      };
    }
    return {
      id: "contact_page",
      title: "Contact page",
      weight: 5,
      status: "pass",
      message: "Contact page link detected.",
      evidence: `${hit.text || "(no text)"} → ${hit.href}`,
    };
  },
});
