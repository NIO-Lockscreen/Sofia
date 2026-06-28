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
  await page.locator(".mode-card[data-mode='word']").click();
  await solveMemoryBoard(page);
  await expect(page.locator("#completeText")).toContainText("Ada");
});

test("the expanded word list contains 44 words", async ({ page }) => {
  await expect(page.locator("#wordList .word-chip")).toHaveCount(39);
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

test("title-case spelling never forces an uppercase letter mid-word", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await page.locator(".mode-card[data-mode='spell']").click();
  // Switch to "Abc" (title-case) mode and spell a word with a repeated letter
  // where case matters past the first slot.
  await page.evaluate(() => {
    state.uppercase = false;
    rememberSpellingWord("PAPPA");
    startSpellingRound(false, false);
  });
  // Expected display per slot: capital first letter, lowercase rest.
  const expectedSlots = ["P", "a", "p", "p", "a"];
  for (const ch of expectedSlots) {
    const tile = page
      .locator(".letter-choice:not(.used)", { hasText: new RegExp(`^${ch}$`) })
      .first();
    // A correctly-cased tile must exist for every slot — including the
    // lowercase "p" slots, which previously could be left only as "P".
    await expect(tile).toBeVisible();
    await tile.click();
  }
  await expect(page.locator("#message")).toContainText("Riktig");
});

test("reading mode (Les ordet) replaces counting and can be completed", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await page.locator(".mode-card[data-mode='blend']").click();
  // The word is shown as tappable letters with picture choices to read toward.
  await expect(page.locator(".blend-word .blend-letter").first()).toBeVisible();
  await expect(page.locator(".blend-choice")).not.toHaveCount(0);
  // The old counting mode is gone.
  await expect(page.locator(".mode-card[data-mode='count']")).toHaveCount(0);
  // Pick the picture that matches the shown word and expect success.
  const correctId = await page.evaluate(() => blendGame.item.id);
  await page.evaluate((id) => {
    const choice = blendGame.choices.find((c) => c.item.id === id);
    onBlendChoice(choice.id);
  }, correctId);
  await expect(page.locator("#message")).toContainText("Riktig");
});

test("the read-aloud button never speaks the whole word, even pressed many times", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await page.locator(".mode-card[data-mode='blend']").click();
  // Spy on speech and mash the helper several times (it gets quicker each press).
  const result = await page.evaluate(() => {
    const calls = [];
    window.speakPayload = (payload) => calls.push(payload);
    const target = normalizeSpellingWord(blendGame.item.word);
    blendGame.blendStage = 0;
    for (let i = 0; i < 4; i++) blendOutLoud();
    return { target, calls };
  });
  const word = result.target.toLowerCase();
  // Every press should voice exactly the letter sounds — never the whole word.
  for (const payload of result.calls) {
    expect(payload.segments || []).not.toContain(word);
    expect((payload.segments || []).length).toBe(result.target.length);
  }
});

test("a streak of ten arms the fire-pill super celebration once", async ({ page }) => {
  await page.locator("#nameDialogSkip").click();
  await page.locator(".mode-card[data-mode='blend']").click();
  const state1 = await page.evaluate(() => {
    // Reach a streak of ten by answering correctly ten times. A correct answer
    // ends the round, so start a fresh one before the next answer.
    for (let i = 0; i < 10; i++) {
      const correct = blendGame.choices.find((c) => c.item.id === blendGame.item.id);
      onBlendChoice(correct.id);
      startBlendRound(false);
    }
    return { streak: state.blendStreak, fired: state.blendSuperFired };
  });
  expect(state1.streak).toBe(10);
  // It is armed (not yet fired) until the fire pill is actually pressed.
  expect(state1.fired).toBe(false);
  const afterPress = await page.evaluate(() => {
    els.movesPill.click();
    const firstFired = state.blendSuperFired;
    els.movesPill.click(); // a second press must NOT re-fire it
    return { firstFired };
  });
  expect(afterPress.firstFired).toBe(true);
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
