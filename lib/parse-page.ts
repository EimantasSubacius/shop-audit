import * as cheerio from "cheerio";
import type { PageImage, PageLink, ParsedPage } from "@/lib/types";

function absoluteUrl(base: string, href: string | undefined): string {
  if (!href) return "";
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function parsePage(html: string, finalUrl: string): ParsedPage {
  const $ = cheerio.load(html);

  const title = ($("title").first().text() || "").trim();
  const metaDescription = (
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    ""
  ).trim();
  const ogImage = absoluteUrl(
    finalUrl,
    $('meta[property="og:image"]').attr("content"),
  );
  const h1Texts = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const hasViewport = $('meta[name="viewport"]').length > 0;

  const images: PageImage[] = $("img")
    .map((_, el) => {
      const src = absoluteUrl(finalUrl, $(el).attr("src"));
      return {
        src,
        alt: $(el).attr("alt"),
        width: $(el).attr("width"),
        height: $(el).attr("height"),
      };
    })
    .get()
    .filter((img) => Boolean(img.src));

  const links: PageLink[] = $("a[href]")
    .map((_, el) => ({
      href: absoluteUrl(finalUrl, $(el).attr("href")),
      text: $(el).text().replace(/\s+/g, " ").trim(),
    }))
    .get()
    .filter((link) => Boolean(link.href));

  return {
    finalUrl,
    title,
    metaDescription,
    ogImage,
    h1Texts,
    hasViewport,
    images,
    links,
    html,
  };
}
