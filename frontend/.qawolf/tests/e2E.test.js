const { launch } = require("qawolf");
const selectors = require("../selectors/e2E");

describe('e2E', () => {
  let browser;

  beforeAll(async () => {
    browser = await launch({ url: "http://localhost:1234/" });
  });

  afterAll(() => browser.close());

  it('can click div', async () => {
    await browser.click(selectors[0]);
  });

  it('can type into "Search NPM Packages" input', async () => {
    await browser.type(selectors[1], "react");
  });

  it('can Enter', async () => {
    await browser.type(selectors[2], "↓Enter↑Enter");
  });

  it('can type into "Search NPM Packages" input', async () => {
    await browser.type(selectors[3], "↓Backspace↑Backspace↓Backspace↑Backspace↓Backspace↑Backspace↓Backspace↑Backspace↓Backspace↑Backspace↓@↑@↓KeyT↑KeyT↓KeyY↑KeyY↓KeyP↑KeyP↓KeyE↑KeyE↓KeyS↑KeyS↓NumpadDivide↑NumpadDivide↓KeyR↑KeyR↓KeyE↑KeyE↓KeyA↑KeyA↓KeyC↑KeyC↓KeyT↑KeyT");
  });

  it('can Enter', async () => {
    const page = await browser.page();
    await page.waitFor(5000);
    await browser.type(selectors[4], "↓Enter↑Enter");
  });

  it('can click path', async () => {
    //await browser.click(selectors[5]);
    const page = await browser.page();
    await page.waitForSelector('#app > div > div:nth-child(3) > div > div > div:nth-child(1) > svg').catch(
      e => console.log(e)
    );
    await page.waitFor(10000);
    await page.click('#app > div > div:nth-child(3) > div > div > div:nth-child(1) > svg');
    await page.waitFor(5000);
  });
});