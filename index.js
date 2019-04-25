const puppeteer = require('puppeteer');
const fs = require('fs');

const brokenPayload = fs.readFileSync('./payloads/broken.html', 'utf-8');
const workingPayload = fs.readFileSync('./payloads/working.html', 'utf-8');

let html = brokenPayload;

(async () => {
  console.log('launch browser');
  const browser = await puppeteer.launch({
    headless: false,
  });

  console.log('create page');
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', request => {
    console.log(request.url());

    request.continue();
  });

  console.log('set content');
  await page.setContent(html, { waitUntil: 'load', timeout: 30000 });

  console.log('taking screenshot');
  const screenshot = await page.screenshot({
    fullPage: true,
    type: 'png'
  });

  console.log('writing screenshot');
  fs.writeFileSync(`./test${new Date().getTime()}.png`, screenshot);

  console.log('screenshot complete');

  await browser.close();
})();