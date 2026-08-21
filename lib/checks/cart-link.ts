import { defineCheck, linkMatches } from "@/lib/checks/helpers";

const CART_PATTERNS = [
  /\/cart\b/i,
  /\/basket\b/i,
  /krepšel/i,
  /krepsel/i,
  /\bcart\b/i,
  /\bbasket\b/i,
];

export const cartLinkCheck = defineCheck({
  id: "cart_link",
  title: "Cart link",
  weight: 10,
  run(page) {
    const hit = linkMatches(page.links, CART_PATTERNS);
    if (!hit) {
      return {
        id: "cart_link",
        title: "Cart link",
        weight: 10,
        status: "fail",
        message:
          "No obvious cart/basket link found. Shoppers need a clear path to cart.",
      };
    }
    return {
      id: "cart_link",
      title: "Cart link",
      weight: 10,
      status: "pass",
      message: "Cart/basket link detected.",
      evidence: `${hit.text || "(no text)"} → ${hit.href}`,
    };
  },
});
