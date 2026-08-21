import { AuditForm } from "@/components/AuditForm";
import { DM_Sans, Fraunces } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Home() {
  return (
    <main
      className={`${display.variable} ${sans.variable} relative min-h-screen overflow-hidden`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e0f2fe_0%,_#fafaf9_45%,_#f5f5f4_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="font-[family-name:var(--font-sans)] text-sm font-medium tracking-wide text-sky-800">
          Shop Audit
        </p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-tight text-stone-900 sm:text-5xl">
          Paste a shop URL. Get a homepage health score.
        </h1>
        <p className="mt-4 max-w-xl font-[family-name:var(--font-sans)] text-base text-stone-600 sm:text-lg">
          Checks HTTPS, SEO basics, mobile viewport, cart/checkout signals, and
          trust pages — then ranks the top fixes.
        </p>

        <div className="mt-10 font-[family-name:var(--font-sans)]">
          <AuditForm />
        </div>

        <p className="mt-16 max-w-2xl text-xs leading-relaxed text-stone-500">
          Heuristic homepage scan only — not a full crawl, security audit, or
          legal advice. Not affiliated with audited shops.
        </p>
      </div>
    </main>
  );
}
