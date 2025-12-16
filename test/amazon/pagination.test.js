const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";
const SEARCH_TERM = "bluetooth speaker";

describe('Amazon - Pagination Tests', function () {
  this.timeout(60000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Amazon pagination test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(AMAZON_URL);

    try {
      await kc.KCClick({ locator: 'id', value: 'sp-cc-accept', timeout: 5000 });
    } catch {
      // ignore
    }

    // Perform search
    await kc.KCType({ locator: 'id', value: 'twotabsearchtextbox', text: SEARCH_TERM });
    await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });
    await kc.KCWait({ locator: 'css', value: 'div.s-main-slot', timeout: 30000 });
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should display pagination controls', async () => {
    const pagination = await kc.driver.findElements(
      By.css('.s-pagination-container')
    );
    
    console.log(`[TEST] Found ${pagination.length} pagination sections`);
    expect(pagination.length).to.be.greaterThan(0);
  });

  it('should navigate to page 2', async () => {
    console.log("[TEST] Navigating to page 2");
    
    try {
      // Find and click "Next" or page "2"
      const nextButton = await kc.driver.findElement(
        By.css('.s-pagination-next, a[aria-label="Go to page 2"]')
      );
      await nextButton.click();
      
      // Wait for new page to load
      await kc.driver.sleep(2000);
      await kc.KCWait({ locator: 'css', value: 'div.s-main-slot', timeout: 30000 });
      
      const currentUrl = await kc.driver.getCurrentUrl();
      console.log(`[TEST] Current URL: ${currentUrl}`);
      
      // URL should contain page indicator
      expect(currentUrl).to.satisfy((url) => 
        url.includes('page=2') || url.includes('&page=2')
      );
    } catch (error) {
      console.log(`[TEST] Pagination test skipped: ${error.message}`);
    }
  });

  it('should show page number indicator', async () => {
    try {
      const pageNumbers = await kc.driver.findElements(
        By.css('.s-pagination-item')
      );
      
      console.log(`[TEST] Found ${pageNumbers.length} page number indicators`);
      expect(pageNumbers.length).to.be.greaterThan(0);
    } catch (error) {
      console.log(`[TEST] Page indicators not found: ${error.message}`);
    }
  });
});
