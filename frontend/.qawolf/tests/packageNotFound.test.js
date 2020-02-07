const { launch } = require("qawolf");
const selectors = require("../selectors/packageNotFound");

describe('packageNotFound', () => {
  let browser;

  beforeAll(async () => {
    browser = await launch({ url: "http://localhost:1234/" });
  });

  afterAll(() => browser.close());

  it('can click "Search NPM Packages" input', async () => {
    await browser.click(selectors[0]);
  });

  it('can type into "Search NPM Packages" input', async () => {
    await browser.type(selectors[1], "hogehogefugafuga");
  });

  it('can Enter', async () => {
    await browser.type(selectors[2], "↓Enter↑Enter");
  });

  it('can click svg', async () => {
    //await browser.click(selectors[3]);
    const page = await browser.page();
    await page.waitForSelector('#app > div > div:nth-child(2) > div > div > div > svg').catch(
      e => console.log(e)
    );
    await page.waitFor(5000);
    await page.click('#app > div > div:nth-child(2) > div > div > div > svg');
    await page.waitFor(5000);
  });
});