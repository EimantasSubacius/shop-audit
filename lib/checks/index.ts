import type { CheckModule } from "@/lib/types";
import { httpsCheck } from "@/lib/checks/https";
import { titleCheck } from "@/lib/checks/title";
import { metaDescriptionCheck } from "@/lib/checks/meta-description";
import { h1Check } from "@/lib/checks/h1";
import { ogImageCheck } from "@/lib/checks/og-image";
import { viewportCheck } from "@/lib/checks/viewport";
import { imgAltCheck } from "@/lib/checks/img-alt";
import { cartLinkCheck } from "@/lib/checks/cart-link";
import { checkoutSignalCheck } from "@/lib/checks/checkout-signal";
import { contactPageCheck } from "@/lib/checks/contact-page";
import { policyPagesCheck } from "@/lib/checks/policy-pages";
import { footerContactCheck } from "@/lib/checks/footer-contact";

export const allChecks: CheckModule[] = [
  httpsCheck,
  titleCheck,
  metaDescriptionCheck,
  h1Check,
  ogImageCheck,
  viewportCheck,
  imgAltCheck,
  cartLinkCheck,
  checkoutSignalCheck,
  contactPageCheck,
  policyPagesCheck,
  footerContactCheck,
];
