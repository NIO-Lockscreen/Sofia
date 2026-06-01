// Regenerate PNG app icons from the SVG sources by rendering them in Chromium.
// Usage: npm run icons   (requires `npx playwright install chromium` once)
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const targets = [
  { svg: "icon.svg", size: 192, out: "icon-192.png", transparent: true },
  { svg: "icon.svg", size: 512, out: "icon-512.png", transparent: true },
  { svg: "icon-square.svg", size: 512, out: "icon-maskable-512.png", transparent: false },
  { svg: "icon-square.svg", size: 180, out: "apple-touch-icon.png", transparent: false },
];

const browser = await chromium.launch();
for (const t of targets) {
  const svg = fs.readFileSync(path.join(root, t.svg), "utf8");
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  await page.setContent(
    `<!doctype html><html><head><style>*{margin:0;padding:0}html,body{width:${t.size}px;height:${t.size}px}svg{display:block;width:${t.size}px;height:${t.size}px}</style></head><body>${svg}</body></html>`
  );
  await page.screenshot({ path: path.join(root, t.out), omitBackground: t.transparent });
  await page.close();
  console.log("wrote", t.out);
}
await browser.close();
