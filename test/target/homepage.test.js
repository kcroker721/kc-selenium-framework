const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const TARGET_URL = "https://www.target.com";

describe('Target - Homepage Validation', function () {
  this.timeout(60000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Target homepage test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(TARGET_URL);
    await kc.driver.sleep(3000);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should display Target logo', async () => {
    const logo = await kc.driver.findElements(
      By.css('a[aria-label*="Target"], [data-test*="Logo"], svg, img[alt*="Target"]')
    );
    
    console.log(`[TEST] Found ${logo.length} logo elements`);
    expect(logo.length).to.be.greaterThan(0);
  });

  it('should have navigation menu', async () => {
    const nav = await kc.driver.findElements(
      By.css('nav, header, [role="navigation"], [data-test*="navigation"], a[href*="/c/"]')
    );
    
    console.log(`[TEST] Found ${nav.length} navigation elements`);
    expect(nav.length).to.be.greaterThan(0);
  });

  it('should display search functionality', async () => {
    const searchInput = await kc.driver.findElements(
      By.css('input[type="search"], input[placeholder*="search"]')
    );
    
    console.log(`[TEST] Found ${searchInput.length} search inputs`);
    expect(searchInput.length).to.be.greaterThan(0);
  });

  it('should have cart icon', async () => {
    const cart = await kc.driver.findElements(
      By.css('[data-test*="cart"], [aria-label*="cart"]')
    );
    
    console.log(`[TEST] Found ${cart.length} cart elements`);
    expect(cart.length).to.be.greaterThan(0);
  });
});
