const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");

const base = "http://127.0.0.1:4173";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(base, (res) => { res.resume(); res.on("end", resolve); });
        req.on("error", reject);
        req.setTimeout(1000, () => req.destroy(new Error("Timed out")));
      });
      return;
    } catch (_) { await sleep(500); }
  }
  throw new Error("Preview server did not start");
}
async function run() {
  await waitForServer();
  fs.mkdirSync("preview-screenshots", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const goto = (url) => page.goto(base + url, { waitUntil: "networkidle" });
    const heading = (text) => page.getByRole("heading", { level: 1, name: text });
    const openMenu = async () => page.locator(".menu__button").click();
    const nav = async (text) => {
      await openMenu();
      await page.locator(".site__navigation .the_menu").getByRole("link", { name: text }).click();
      await page.waitForTimeout(700); // allow the 400ms route-exit animation to unmount
    };

    await goto("/");
    await heading("Šimon Čada").count().then((n) => assert.equal(n, 0)); // home name is an H2, not an H1
    assert.equal(await page.locator("html").getAttribute("lang"), "cs");
    assert.equal(await page.getByText("Moje portfolio", { exact: true }).count(), 1);
    assert.equal(await page.locator('a[href*="dQw4w9WgXcQ"]').count(), 0);
    await page.screenshot({ path: "preview-screenshots/01-home-cs.png", fullPage: true });

    await page.locator(".language-switch").click();
    await page.waitForTimeout(700); // language changes also use the 400ms route animation
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(await page.getByText("My Portfolio", { exact: true }).count(), 1);
    assert.match(page.url(), /lang=en/);
    await nav("About");
    assert.match(page.url(), /\/about\?lang=en$/);
    assert.equal(await heading("About Me").count(), 1);
    assert.equal(await page.getByText("Interviews", { exact: true }).count(), 1);
    assert.equal(await page.locator("table tr").count(), 7);
    const interviewRow = page.locator("table tr").filter({ hasText: "Kryštof" });
    assert.equal(await interviewRow.count(), 1);
    assert.equal(await interviewRow.locator('a[href="https://youtu.be/rOGvU3MOeIE"]').count(), 1);
    await page.screenshot({ path: "preview-screenshots/02-about-en.png", fullPage: true });

    await nav("Portfolio");
    assert.match(page.url(), /\/portfolio\?lang=en$/);
    assert.equal(await page.getByText("View photo").count(), 18);
    await nav("Contact");
    assert.match(page.url(), /\/contact\?lang=en$/);
    assert.equal(await heading("Contact").count(), 1);
    assert.equal(await page.locator('input[name="name"]').getAttribute("placeholder"), "Name");
    assert.equal(await page.locator('textarea[name="message"]').getAttribute("placeholder"), "Message");

    // Simulate the email service response without sending a real message.
    await page.route("**/api/v1.0/email/send", async (route) => route.fulfill({
      status: 200, headers: { "access-control-allow-origin": "*", "content-type": "text/plain" }, body: "OK"
    }));
    await page.locator('input[name="name"]').fill("Preview Test");
    await page.locator('input[name="email"]').fill("preview@example.org");
    await page.locator('textarea[name="message"]').fill("Browser smoke test");
    await page.getByRole("button", { name: "Send" }).click();
    await page.getByText("Your message has been sent successfully.", { exact: true }).waitFor();

    await page.locator(".language-switch").click();
    await page.waitForTimeout(700); // language changes also use the 400ms route animation
    assert.equal(await heading("Kontakt").count(), 1);
    assert.equal(await page.locator("html").getAttribute("lang"), "cs");
    assert.equal(await page.locator('input[name="name"]').getAttribute("placeholder"), "Jméno");
    assert.equal(await page.locator('textarea[name="message"]').getAttribute("placeholder"), "Zpráva");
    await nav("O mně");
    assert.equal(await heading("O mně").count(), 1);
    assert.equal(await page.getByText("Rozhovory", { exact: true }).count(), 1);
    assert.equal(await page.getByText("Dovednosti", { exact: true }).count(), 1);
    assert.equal(await page.getByText("Služby", { exact: true }).count(), 1);
    await page.screenshot({ path: "preview-screenshots/03-about-cs.png", fullPage: true });

    // Mobile navigation and language-switch regression.
    await page.setViewportSize({ width: 390, height: 844 });
    await goto("/");
    await page.locator(".language-switch").click();
    await page.waitForTimeout(700); // language changes also use the 400ms route animation
    await nav("Contact");
    assert.match(page.url(), /\/contact\?lang=en$/);
    assert.equal(await heading("Contact").count(), 1);
    await page.screenshot({ path: "preview-screenshots/04-contact-mobile-en.png", fullPage: true });

    assert.deepEqual(errors, [], "Unexpected browser JavaScript errors");
    console.log("PASS: bilingual pages, navigation, interview, social links, mobile menu, mocked contact form.");
  } finally {
    await browser.close();
  }
}
run().catch((error) => { console.error(error); process.exit(1); });
