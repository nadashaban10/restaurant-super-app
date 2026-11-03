import { chromium } from "playwright-core";
import assert from "node:assert/strict";

const base = "http://localhost:3001";
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "ar-EG" });
await context.addCookies([{ name: "NEXT_LOCALE", value: "ar", url: base }]);
const page = await context.newPage();
page.setDefaultTimeout(25000);

try {
  await page.goto(`${base}/menu/baladi-kofta`, { waitUntil: "networkidle" });
  await page.getByRole("region", { name: "يتظبط معاها" }).waitFor();
  await page.getByRole("region", { name: "يتظبط معاها" }).getByText("سلطة طحينة").waitFor();

  await page.goto(`${base}/menu`, { waitUntil: "networkidle" });
  const card = page.locator("article").filter({ hasText: "كفته بلدي" }).first();
  await card.getByRole("button", { name: "أضف للسلة" }).click();
  const tray = page.getByRole("region", { name: "ينفع معاها" });
  await tray.waitFor();
  await tray.getByText("سلطة طحينة").waitFor();
  await tray.getByRole("button", { name: "أضف" }).first().click();
  await page.getByRole("link", { name: "السلة" }).first().locator("span").filter({ hasText: "2" }).waitFor();

  await page.getByRole("link", { name: "السلة" }).first().click();
  await page.getByRole("heading", { name: "السلة" }).waitFor();
  await page.getByText("سلطة طحينة").first().waitFor();
  const meal = page.getByRole("region", { name: "كمّل الوجبة" });
  await meal.waitFor();
  assert.equal(await meal.getByText("سلطة طحينة").count(), 0);
  await meal.getByRole("button", { name: "أضف" }).first().click();
  await page.getByRole("link", { name: "السلة" }).first().locator("span").filter({ hasText: "3" }).waitFor();

  await page.getByRole("link", { name: "إتمام الطلب" }).click();
  await page.getByRole("region", { name: "حابب تضيف حاجة؟" }).waitFor();
  const before = await page.getByText("الإجمالي").locator("xpath=following-sibling::*[1]").first().innerText();
  await page.getByRole("region", { name: "حابب تضيف حاجة؟" }).getByRole("button", { name: "أضف" }).first().click();
  await page.getByRole("link", { name: "السلة" }).first().locator("span").filter({ hasText: "4" }).waitFor();
  const after = await page.getByText("الإجمالي").locator("xpath=following-sibling::*[1]").first().innerText();
  assert.notEqual(before, after);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  const desktopMeal = page.getByRole("region", { name: "كمّل الوجبة" });
  await desktopMeal.waitFor();
  const box = await desktopMeal.boundingBox();
  assert.ok(box && box.width > 400);

  console.log("recommendation flow passed");
  console.log({ before, after });
} catch (error) {
  console.error("URL", page.url());
  console.error(await page.locator("body").innerText());
  throw error;
} finally {
  await browser.close();
}
