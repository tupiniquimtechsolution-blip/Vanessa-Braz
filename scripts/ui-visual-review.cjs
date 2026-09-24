const fs = require('fs');
const { chromium } = require('playwright');

const routes = {
  home: '/',
  servicos: '/servicos',
  galeria: '/galeria',
  agendar: '/agendar',
  contato: '/contato',
};

const modes = {
  desktop: { width: 1440, height: 1100 },
  mobile: { width: 390, height: 844 },
};

const baseUrl = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173';
const outputRoot = 'visual-review';

async function warmLazyContent(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(420, Math.floor(window.innerHeight * 0.7));
    const max = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await sleep(140);
    }

    window.scrollTo(0, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    await sleep(700);
  });
}

async function waitForImages(page) {
  await page
    .waitForFunction(
      () => Array.from(document.images).every((img) => img.complete),
      undefined,
      { timeout: 10000 },
    )
    .catch(() => {});

  return page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt || '',
        loading: img.loading || '',
      })),
  );
}

(async () => {
  fs.mkdirSync(outputRoot, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const unresolved = [];

  try {
    for (const [mode, viewport] of Object.entries(modes)) {
      const modeDir = `${outputRoot}/${mode}`;
      fs.mkdirSync(modeDir, { recursive: true });

      const context = await browser.newContext({ viewport });
      const page = await context.newPage();

      for (const [name, route] of Object.entries(routes)) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
        await warmLazyContent(page);
        const badImages = await waitForImages(page);

        if (badImages.length) {
          unresolved.push({ mode, route: name, images: badImages });
        }

        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(350);
        await page.screenshot({ path: `${modeDir}/${name}.png`, fullPage: true });
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    `${outputRoot}/image-load-report.json`,
    `${JSON.stringify({ unresolved }, null, 2)}\n`,
    'utf8',
  );

  if (unresolved.length) {
    console.warn(`Visual review completed with unresolved images on ${unresolved.length} page(s).`);
  } else {
    console.log('Visual review completed with all discovered images loaded.');
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
