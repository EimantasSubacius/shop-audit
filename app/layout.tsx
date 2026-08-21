import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shop Audit — ecommerce homepage health check",
  description:
    "Paste a shop URL and get a scored checklist for SEO, checkout friction, and trust signals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-stone-900">{children}</body>
    </html>
  );
}
