const { chromium } = require("playwright");
const fs = require("fs");

const zxingUmd = fs.readFileSync(
  "node_modules/@zxing/library/umd/index.min.js",
  "utf8",
);

// fake camera that shows a real EAN-13 for the given isbn
const fakeCamera = (isbn) => `
(function () {
  function makeStream() {
    const ZX = window.ZXing;
    const canvas = document.createElement("canvas");
    canvas.width = 1280; canvas.height = 720;
    const ctx = canvas.getContext("2d");
    const m = new ZX.MultiFormatWriter().encode("${isbn}", ZX.BarcodeFormat.EAN_13, 760, 320);
    function draw() {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      const ox = (canvas.width - m.getWidth()) / 2;
      const oy = (canvas.height - m.getHeight()) / 2;
      for (let y = 0; y < m.getHeight(); y++)
        for (let x = 0; x < m.getWidth(); x++)
          if (m.get(x, y)) ctx.fillRect(ox + x, oy + y, 1, 1);
      requestAnimationFrame(draw);
    }
    draw();
    return canvas.captureStream(30);
  }
  let s = null;
  navigator.mediaDevices.getUserMedia = async () => (s = s || makeStream());
})();
`;

(async () => {
  const browser = await chromium.launch();

  // 9780132350884 = Clean Code -> details had NO authors, this is the regression case
  // 9780134092669 = Computer Systems -> two authors
  for (const isbn of ["9780132350884", "9780134092669"]) {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 900 },
      permissions: ["camera"],
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => console.log("[pageerror]", e.message));

    await page.addInitScript({ content: zxingUmd + "\n" + fakeCamera(isbn) });

    // start from a clean inventory so every isbn is "unknown" and the form shows
    await page.goto("http://localhost:5183/");
    await page.evaluate(() => {
      localStorage.setItem("books", "[]");
    });
    await page.goto("http://localhost:5183/");
    await page.waitForTimeout(1200);

    await page.click('button:has-text("Scanner Mode")');

    console.log(`\n=== ${isbn} ===`);
    try {
      await page.waitForSelector("text=Gescannt:", { timeout: 25000 });
      await page.waitForTimeout(2500); // let the api call resolve
      console.log("  title :", await page.inputValue("#scan-title"));
      console.log("  author:", await page.inputValue("#scan-author"));
      console.log("  year  :", await page.inputValue("#scan-year"));
      const img = await page
        .locator('[data-slot="dialog-content"] img')
        .getAttribute("src");
      console.log("  cover :", img);
      await page.screenshot({ path: `/tmp/scan-${isbn}.png` });
    } catch (e) {
      console.log("  NO SCAN:", String(e).slice(0, 90));
    }
    await context.close();
  }

  await browser.close();
})();
