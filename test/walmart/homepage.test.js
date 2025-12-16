const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const WALMART_URL = "https://www.walmart.com";

describe('Walmart - Homepage Elements', function () {
  this.timeout(60000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Walmart homepage test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(WALMART_URL);
    await kc.driver.sleep(3000);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should display Walmart logo', async () => {
    const logo = await kc.driver.findElements(
      By.css('[aria-label*="Walmart"], img[alt*="Walmart"]')
    );
    
    console.log(`[TEST] Found ${logo.length} logo elements`);
    expect(logo.length).to.be.greaterThan(0);
  });

  it('should have search box', async () => {
    const searchBox = await kc.driver.findElements(
      By.css('input[type="search"]')
    );
    
    expect(searchBox.length).to.be.greaterThan(0);
  });

  it('should display navigation header', async () => {
    const header = await kc.driver.findElements(
      By.css('header, nav')
    );
    
    console.log(`[TEST] Found ${header.length} header/nav elements`);
    expect(header.length).to.be.greaterThan(0);
  });

  it('should have cart functionality', async () => {
    const cart = await kc.driver.findElements(
      By.css('[data-automation-id*="cart"], [aria-label*="cart"]')
    );
    
    console.log(`[TEST] Found ${cart.length} cart elements`);
    expect(cart.length).to.be.greaterThan(0);
  });
});
