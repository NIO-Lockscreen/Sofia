import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const appUrl = pathToFileURL(path.resolve(process.cwd(), "index.html")).href;

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test("loads with the right title and all six game modes", async ({ page }) => {
  await expect(page).toHaveTitle(/MiniMemory/);
  await expect(page.locator("#modeGrid .mode-card")).toHaveCount(6);
});

test("first boot shows the optional name dialog and lets you skip it", async ({ page }) => {
  await expect(page.locator("#nameDialog")).toBeVisible();
  await page.locator("#nameDialogSkip").click();
  await expect(page.locator("#nameDialog")).toBeHidden();
});

test("a saved name is used in the memory celebration", async ({ page }) => {
  await page.locator("#nameDialogInput").fill("Ada");
  await page.locator("#nameDialogSave").click();
  // Win a 3-pair round by matching every pair via the card data.
  await page.locator(".mode-card[data-mode='picture']").click();
  await solveMemoryBoard(page);
  await expect(page.locator("#completeText")).toContainText("Ada");
});

test("the expanded word list contains 44 words", async ({ page }) => {
  await expect(page.locator("#wordList .word-chip")).toHaveCount(44);
});

test("default word mode renders memory cards", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await expect(page.locator("#board .card")).toHaveCount(6); // 3 pairs
});

test("spelling mode can be completed and shows success", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await page.locator(".mode-card[data-mode='spell']").click();
  const target = (await page.locator(".spell-word").innerText()).replace(/\s+/g, "");
  expect(target.length).toBeGreaterThan(0);
  for (const ch of target.split("")) {
    await page
      .locator(".letter-choice:not(.used)", { hasText: new RegExp(`^${ch}$`) })
      .first()
      .click();
  }
  await expect(page.locator("#message")).toContainText("Riktig");
});

test("parental gate guards the adult menu", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await page.locator("#adultBtn").click();
  await expect(page.locator("#gateDialog")).toBeVisible();
  const question = await page.locator("#gateQuestion").innerText();
  const [a, b] = question.match(/\d+/g).map(Number);
  await page
    .locator(".gate-option", { hasText: new RegExp(`^${a + b}$`) })
    .first()
    .click();
  await expect(page.locator("#adultPanel")).toHaveClass(/open/);
});

// Repeatedly flip matching pairs until the win overlay appears.
async function solveMemoryBoard(page) {
  for (let guard = 0; guard < 12; guard++) {
    const pairId = await page.evaluate(() => {
      const remaining = cards.filter((c) => !matched.has(c.uid));
      return remaining.length ? remaining[0].pairId : null;
    });
    if (pairId === null) break;
    const uids = await page.evaluate(
      (pid) => cards.filter((c) => c.pairId === pid).map((c) => c.uid),
      pairId
    );
    for (const uid of uids) {
      await page.locator(`.card[data-uid="${uid}"]`).click();
    }
    await page.waitForTimeout(450); // let the match animation settle
  }
  await expect(page.locator("#completeOverlay")).toHaveClass(/show/);
}
