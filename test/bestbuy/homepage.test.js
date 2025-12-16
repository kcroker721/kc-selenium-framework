const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const BESTBUY_URL = "https://www.bestbuy.com";

describe('Best Buy - Homepage Validation', function () {
  this.timeout(60000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Best Buy homepage test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(BESTBUY_URL);
    await kc.driver.sleep(3000);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should display Best Buy logo', async () => {
    const logo = await kc.driver.findElements(
      By.css('.logo, [href="/"]')
    );
    
    console.log(`[TEST] Found ${logo.length} logo elements`);
    expect(logo.length).to.be.greaterThan(0);
  });

  it('should have search functionality', async () => {
    const searchBox = await kc.driver.findElements(
      By.css('input[type="search"]')
    );
    
    expect(searchBox.length).to.be.greaterThan(0);
  });

  it('should display navigation menu', async () => {
    const nav = await kc.driver.findElements(
      By.css('nav, header')
    );
    
    console.log(`[TEST] Found ${nav.length} navigation elements`);
    expect(nav.length).to.be.greaterThan(0);
  });

  it('should have cart icon', async () => {
    const cart = await kc.driver.findElements(
      By.css('[aria-label*="Cart"], .cart-icon')
    );
    
    console.log(`[TEST] Found ${cart.length} cart elements`);
    expect(cart.length).to.be.greaterThan(0);
  });
});
