import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_URL || "https://shop-audit-beta.vercel.app";
const outDir = path.join(__dirname, "..", "public", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log("wrote", file);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

await page.goto(BASE, { waitUntil: "networkidle" });
await shot(page, "home.png");

await page.fill('input[type="text"]', "https://www.apple.com");
await page.click('button[type="submit"]');
await page.waitForSelector("text=Checklist", { timeout: 60000 });
await page.waitForTimeout(800);
await shot(page, "results-high.png");

await page.goto(BASE, { waitUntil: "networkidle" });
await page.fill('input[type="text"]', "https://example.com");
await page.click('button[type="submit"]');
await page.waitForSelector("text=Checklist", { timeout: 60000 });
await page.waitForTimeout(800);
await shot(page, "results-low.png");

const res = await page.request.post(`${BASE}/api/audit`, {
  data: { url: "https://www.apple.com" },
});
const json = await res.json();
const examplesDir = path.join(__dirname, "..", "examples");
fs.mkdirSync(examplesDir, { recursive: true });
fs.writeFileSync(
  path.join(examplesDir, "sample-report.json"),
  JSON.stringify(json, null, 2),
);
console.log("wrote examples/sample-report.json");

await browser.close();
