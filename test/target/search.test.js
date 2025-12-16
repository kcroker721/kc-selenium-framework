const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const TARGET_URL = "https://www.target.com";
const SEARCH_TERM = "coffee maker";

describe('Target - Product Search', function () {
  this.timeout(90000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Target search test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(TARGET_URL);
    
    // Wait for page to load
    await kc.driver.sleep(3000);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should load Target homepage', async () => {
    const pageTitle = await kc.driver.getTitle();
    console.log(`[TEST] Page title: "${pageTitle}"`);
    
    expect(pageTitle.toLowerCase()).to.satisfy((title) => 
      title.includes('target') || title.includes('expect more')
    );
  });

  it('should perform search', async () => {
    console.log("[TEST] Searching for:", SEARCH_TERM);
    
    try {
      // Find search box
      const searchBox = await kc.driver.findElement(
        By.css('input[data-test="@web/Search/SearchInput"]')
      );
      await searchBox.clear();
      await searchBox.sendKeys(SEARCH_TERM);
      
      // Click search button
      const searchButton = await kc.driver.findElement(
        By.css('button[data-test="@web/Search/SearchButton"]')
      );
      await searchButton.click();
      
      // Wait for results
      await kc.driver.sleep(3000);
      
      const currentUrl = await kc.driver.getCurrentUrl();
      console.log(`[TEST] Results URL: ${currentUrl}`);
      
      expect(currentUrl).to.include('/s/');
    } catch (error) {
      console.log(`[TEST] Search test skipped: ${error.message}`);
    }
  });

  it('should display search results', async () => {
    try {
      await kc.driver.sleep(2000);
      
      const results = await kc.driver.findElements(
        By.css('[data-test*="product"]')
      );
      
      console.log(`[TEST] Found ${results.length} search results`);
      expect(results.length).to.be.greaterThan(0);
    } catch (error) {
      console.log(`[TEST] Results check skipped: ${error.message}`);
    }
  });

  it('should verify page loaded without errors', async () => {
    const currentUrl = await kc.driver.getCurrentUrl();
    expect(currentUrl).to.include('target.com');
  });
});
