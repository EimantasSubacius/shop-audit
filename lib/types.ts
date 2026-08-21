export type CheckStatus = "pass" | "warn" | "fail";

export type CheckId =
  | "https"
  | "title"
  | "meta_description"
  | "h1"
  | "og_image"
  | "viewport"
  | "img_alt"
  | "cart_link"
  | "checkout_signal"
  | "contact_page"
  | "policy_pages"
  | "footer_contact";

export type CheckResult = {
  id: CheckId;
  title: string;
  status: CheckStatus;
  weight: number;
  score: number;
  message: string;
  evidence?: string;
};

export type TopFix = {
  id: CheckId;
  title: string;
  message: string;
};

export type AuditReport = {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  durationMs: number;
  totalScore: number;
  maxScore: number;
  percent: number;
  checks: CheckResult[];
  topFixes: TopFix[];
  fetchOk: boolean;
  fetchError?: string;
};

export type PageImage = {
  src: string;
  alt: string | undefined;
  width?: string;
  height?: string;
};

export type PageLink = {
  href: string;
  text: string;
};

export type ParsedPage = {
  finalUrl: string;
  title: string;
  metaDescription: string;
  ogImage: string;
  h1Texts: string[];
  hasViewport: boolean;
  images: PageImage[];
  links: PageLink[];
  html: string;
};

export type CheckModule = {
  id: CheckId;
  title: string;
  weight: number;
  run: (page: ParsedPage) => Omit<CheckResult, "score">;
};

export type ApiErrorBody = {
  error: string;
  code?: string;
};
