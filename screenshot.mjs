import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 414, height: 896 } });

await page.goto('file://' + process.cwd() + '/dist/index.html');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);

const screenshot = await page.screenshot({ fullPage: true });
await writeFile('screenshot.png', screenshot);
console.log('Screenshot saved to screenshot.png');

await browser.close();
