import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeAuditUrl } from "../lib/url";
import { parsePage } from "../lib/parse-page";
import { runAuditOnHtml } from "../lib/audit/run-audit";
import { allChecks } from "../lib/checks";
import { looksLikeBotChallenge } from "../lib/fetch-page";

const fixtures = join(__dirname, "fixtures");

function load(name: string) {
  return readFileSync(join(fixtures, name), "utf8");
}

describe("normalizeAuditUrl", () => {
  it("adds https when missing", () => {
    const r = normalizeAuditUrl("example.com");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.url).toBe("https://example.com/");
  });

  it("rejects empty", () => {
    expect(normalizeAuditUrl("").ok).toBe(false);
  });

  it("rejects ftp", () => {
    expect(normalizeAuditUrl("ftp://example.com").ok).toBe(false);
  });

  it("rejects localhost", () => {
    expect(normalizeAuditUrl("http://localhost:3000").ok).toBe(false);
  });
});

describe("parsePage", () => {
  it("reads good shop signals", () => {
    const page = parsePage(load("good-shop.html"), "https://example.com/");
    expect(page.title).toContain("Nordic Outdoor");
    expect(page.hasViewport).toBe(true);
    expect(page.h1Texts).toHaveLength(1);
    expect(page.links.some((l) => /cart/i.test(l.href))).toBe(true);
  });
});

describe("runAuditOnHtml", () => {
  it("scores good shop high", () => {
    const report = runAuditOnHtml(
      "https://example.com/",
      "https://example.com/",
      load("good-shop.html"),
    );
    expect(report.percent).toBeGreaterThanOrEqual(80);
    expect(report.fetchOk).toBe(true);
  });

  it("scores bad shop low", () => {
    const report = runAuditOnHtml(
      "http://example.com/",
      "http://example.com/",
      load("bad-shop.html"),
    );
    expect(report.percent).toBeLessThanOrEqual(40);
    expect(report.topFixes.length).toBeGreaterThan(0);
  });
});

describe("registry", () => {
  it("has at least 8 checks", () => {
    expect(allChecks.length).toBeGreaterThanOrEqual(8);
  });
});

describe("looksLikeBotChallenge", () => {
  it("detects cloudflare interstitial", () => {
    expect(
      looksLikeBotChallenge(
        "<html><title>Just a moment...</title><body>cloudflare challenge-platform</body></html>",
        403,
      ),
    ).toBe(true);
  });
});
