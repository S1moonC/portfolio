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
    // Verify branding, language selector and 3-column hero layout.
    assert.equal(await page.locator(".site__header .navbar-brand").innerText(), "ŠIMON ČADA");
    assert.equal(await page.locator(".language-switch").textContent().then(text => text.replace(/\s+/g, "")), "CZ↔EN");
    assert.equal(await page.locator("body").innerText().then(text => text.includes("\\n")), false, "Literal backslash-n must not be visible");
    async function assertButtonsInRow() {
      const rects = await page.locator(".intro_btn-action > a").evaluateAll(
        (elements) => elements.map(element => {
          const b = element.getBoundingClientRect();
          return { top: b.top, right: b.right, left: b.left, width: b.width };
        })
      );
      assert.equal(rects.length, 3);
      assert(rects.every(r => r.width > 20), "Buttons must have visible widths");
      assert(rects.every(r => Math.abs(r.top - rects[0].top) < 2), "All 3 buttons must be in one row");
      assert(rects[0].right <= rects[1].left + 1 && rects[1].right <= rects[2].left + 1, "Buttons must not overlap");
    }
    await assertButtonsInRow();
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
    await assertButtonsInRow();
    assert.equal(await page.locator(".language-switch").textContent().then(text => text.replace(/\s+/g, "")), "CZ↔EN");
    assert.equal(await page.locator(".site__header .navbar-brand").innerText(), "ŠIMON ČADA");
    const brandRect = await page.locator(".site__header .navbar-brand").boundingBox();
    const menuRect = await page.locator(".menu__button").boundingBox();
    assert(brandRect && menuRect && brandRect.x + brandRect.width < menuRect.x, "Header items should fit on mobile");
    await page.locator(".language-switch").click();
    await page.waitForTimeout(700); // language changes also use the 400ms route animation
    await nav("Contact");
    assert.match(page.url(), /\/contact\?lang=en$/);
    assert.equal(await heading("Contact").count(), 1);
    await page.screenshot({ path: "preview-screenshots/04-contact-mobile-en.png", fullPage: true });


    // Responsive checks on the CSS viewport of an iPhone 16 Pro and smaller phones.
    for (const size of [{width:402,height:874},{width:375,height:812},{width:320,height:700},{width:768,height:1024}]) {
      await page.setViewportSize(size);
      for (const path of ["/", "/about", "/portfolio", "/contact"]) {
        await goto(path);
        await page.waitForTimeout(550);
        const metrics = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth
        }));
        assert(metrics.scrollWidth <= metrics.viewport + 2, `Horizontal overflow at ${size.width}px on ${path}: ${JSON.stringify(metrics)}`);
        assert(metrics.bodyWidth <= metrics.viewport + 2, `Body overflow at ${size.width}px on ${path}`);
        if (size.width === 402) {
          const file = path === "/" ? "home" : path.slice(1);
          await page.screenshot({ path: `preview-screenshots/iphone16pro-${file}.png`, fullPage: true });
        }
        if (size.width <= 402 && path === "/") {
          const buttons = await page.locator(".intro_btn-action > a").evaluateAll(els => els.map(el => {
            const r=el.getBoundingClientRect();return {top:r.top,right:r.right,left:r.left,width:r.width};
          }));
          assert.equal(buttons.length,3);
          assert(buttons.every(b=>b.width >= 50), "Hero links must remain tappable");
          assert(buttons.every(b=>Math.abs(b.top-buttons[0].top)<2), "Hero buttons must stay in one row");
        }
        if (size.width === 402 && path === "/portfolio") {
          const overlay = page.locator(".po_item .content").first();
          assert.equal(await overlay.evaluate(e => getComputedStyle(e).opacity), "1", "Photo link must be visible without hover");
        }
      }
      if (size.width === 402) {
        await goto("/");
        await page.locator(".menu__button").click();
        await page.screenshot({ path: "preview-screenshots/iphone16pro-menu.png", fullPage: true });
        await page.locator(".menu__button").click();
      }
    }


    // Compact cinematic variant must retain a short photo, readable copy and three links.
    for (const viewport of [{ width: 402, height: 874 }, { width: 375, height: 812 }, { width: 320, height: 700 }]) {
      await page.setViewportSize(viewport);
      for (const lang of ["cs", "en"]) {
        await goto(lang === "en" ? "/?lang=en" : "/");
        await page.waitForTimeout(600);
        const cinematic = page.locator(".cinematic-mobile-copy");
        assert(await cinematic.isVisible(), "Cinematic mobile content must be visible");
        assert.equal(await page.locator(".cinematic-name").innerText().then(x => x.replace(/\s+/g, "")), "ŠimonČada.");
        const role = await page.locator(".cinematic-role").innerText();
        assert(role.includes(lang === "en" ? "Sound engineer" : "Zvukař"), "Mobile role should be localized");
        const hero = await page.locator("#home .intro_sec").boundingBox();
        const image = await page.locator("#home .h_bg-image").boundingBox();
        assert(hero && image && image.height <= 362, "Photo must be compact, not full height");
        assert(hero.height < viewport.height - 100, "Entire compact hero should fit comfortably in the mobile viewport");
        const cta = await page.locator("#home .intro_btn-action").boundingBox();
        assert(cta && cta.y + cta.height < viewport.height - 20, "Hero actions should be visible without scrolling");
        const linkRects = await page.locator("#home .intro_btn-action > a").evaluateAll(els => els.map(el => {
          const r = el.getBoundingClientRect(); return { top:r.top, left:r.left, right:r.right, width:r.width };
        }));
        assert.equal(linkRects.length, 3);
        assert(linkRects.every(r => Math.abs(r.top - linkRects[0].top) < 2), "All three CTAs must be in a row");
        assert(linkRects.every(r => r.width > 50), "CTAs must remain usable");
        assert(linkRects[0].right <= linkRects[1].left + 1 && linkRects[1].right <= linkRects[2].left + 1, "CTAs should not overlap");
        const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        assert(docWidth <= viewport.width + 2, "No horizontal overflow for cinematic hero");
        if (viewport.width === 402) {
          await page.screenshot({
            path: `preview-screenshots/cinematic-iphone16pro-${lang}.png`,
            fullPage: true
          });
        }
      }
    }
    // Keep the existing desktop homepage, including its animated title.
    await page.setViewportSize({ width: 1440, height: 900 });
    await goto("/");
    assert(await page.locator(".desktop-intro-typewriter").isVisible(), "Desktop typewriter should remain visible");
    assert(!(await page.locator(".cinematic-mobile-copy").isVisible()), "Mobile cinematic copy should be hidden on desktop");

    assert.deepEqual(errors, [], "Unexpected browser JavaScript errors");
    console.log("PASS: bilingual pages, navigation, interview, social links, mobile menu, mocked contact form.");
  } finally {
    await browser.close();
  }
}
run().catch((error) => { console.error(error); process.exit(1); });
