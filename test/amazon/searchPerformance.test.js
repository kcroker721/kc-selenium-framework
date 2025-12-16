const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";
const SEARCH_TERM = "laptop";

describe('Amazon - Product Search Performance', function () {
  this.timeout(60000);

  let kc;
  let searchStartTime;
  let searchEndTime;

  before(async () => {
    console.log("[TEST] Starting Amazon search performance test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(AMAZON_URL);

    // Handle cookie consent
    try {
      await kc.KCClick({ locator: 'id', value: 'sp-cc-accept', timeout: 5000 });
    } catch {
      console.log("[TEST] No cookie banner");
    }
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should measure search response time', async () => {
    console.log("[TEST] Measuring search performance");

    // Start timer
    searchStartTime = Date.now();

    // Perform search
    await kc.KCType({ 
      locator: 'id', 
      value: 'twotabsearchtextbox', 
      text: SEARCH_TERM 
    });
    await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });

    // Wait for results
    await kc.KCWait({ locator: 'css', value: 'div.s-main-slot', timeout: 30000 });

    // End timer
    searchEndTime = Date.now();
    const responseTime = searchEndTime - searchStartTime;

    console.log(`[TEST] Search response time: ${responseTime}ms`);

    // Assert performance is acceptable (under 5 seconds)
    expect(responseTime).to.be.lessThan(5000);
  });

  it('should verify all search results loaded', async () => {
    const results = await kc.driver.findElements(
      By.css("div[data-component-type='s-search-result']")
    );

    console.log(`[TEST] Loaded ${results.length} search results`);
    
    // Should have at least 12 results on first page
    expect(results.length).to.be.greaterThan(12);
  });

  it('should measure page load time', async () => {
    console.log("[TEST] Measuring page load performance");
    
    const startTime = Date.now();
    await kc.KCGoTo(AMAZON_URL);
    
    // Wait for page to be fully loaded
    await kc.KCWait({ locator: 'id', value: 'nav-logo-sprites' });
    
    const loadTime = Date.now() - startTime;
    console.log(`[TEST] Page load time: ${loadTime}ms`);
    
    // Page should load in under 5 seconds
    expect(loadTime).to.be.lessThan(5000);
  });
});
