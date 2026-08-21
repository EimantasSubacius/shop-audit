import { defineCheck, linkMatches } from "@/lib/checks/helpers";

const CHECKOUT_PATTERNS = [
  /\/checkout\b/i,
  /\/checkouts\b/i,
  /apmok/i,
  /\bcheckout\b/i,
];

const CART_PATTERNS = [
  /\/cart\b/i,
  /\/basket\b/i,
  /krepšel/i,
  /krepsel/i,
  /\bcart\b/i,
];

export const checkoutSignalCheck = defineCheck({
  id: "checkout_signal",
  title: "Checkout signal",
  weight: 8,
  run(page) {
    const checkout = linkMatches(page.links, CHECKOUT_PATTERNS);
    if (checkout) {
      return {
        id: "checkout_signal",
        title: "Checkout signal",
        weight: 8,
        status: "pass",
        message: "Checkout path signal found on the homepage.",
        evidence: `${checkout.text || "(no text)"} → ${checkout.href}`,
      };
    }

    const cart = linkMatches(page.links, CART_PATTERNS);
    if (cart) {
      return {
        id: "checkout_signal",
        title: "Checkout signal",
        weight: 8,
        status: "warn",
        message:
          "No direct checkout link; cart exists (common). Confirm checkout UX is short.",
        evidence: `cart → ${cart.href}`,
      };
    }

    return {
      id: "checkout_signal",
      title: "Checkout signal",
      weight: 8,
      status: "fail",
      message: "No checkout or cart signals found on the homepage.",
    };
  },
});
