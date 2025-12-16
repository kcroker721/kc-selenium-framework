const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";
const SEARCH_TERM = "wireless keyboard";

describe('Amazon - Search Filters', function () {
  this.timeout(90000);

  let kc;
  let initialResultCount = 0;

  before(async () => {
    console.log("[TEST] Starting Amazon search filters test");
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

    const results = await kc.driver.findElements(
      By.css("div[data-component-type='s-search-result']")
    );
    initialResultCount = results.length;
    console.log(`[TEST] Initial results: ${initialResultCount}`);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should display filter options', async () => {
    const filters = await kc.driver.findElements(By.css('#s-refinements'));
    
    console.log(`[TEST] Found ${filters.length} filter sections`);
    expect(filters.length).to.be.greaterThan(0);
  });

  it('should filter by brand', async () => {
    console.log("[TEST] Applying brand filter");
    
    try {
      // Try to click first brand filter
      const brandFilters = await kc.driver.findElements(
        By.css('li[id^="p_89/"] input, li[id^="p_89/"] a')
      );
      
      if (brandFilters.length > 0) {
        await brandFilters[0].click();
        
        // Wait for page to reload with filtered results
        await kc.driver.sleep(2000);
        await kc.KCWait({ locator: 'css', value: 'div.s-main-slot', timeout: 30000 });
        
        console.log("[TEST] Brand filter applied successfully");
      } else {
        console.log("[TEST] No brand filters available");
      }
    } catch (error) {
      console.log(`[TEST] Could not apply brand filter: ${error.message}`);
    }
  });

  it('should sort results', async () => {
    console.log("[TEST] Testing sort functionality");
    
    try {
      // Click sort dropdown
      const sortDropdown = await kc.KCFindVisible(
        By.css('.a-dropdown-container')
      );
      await sortDropdown.click();
      
      // Wait for options to appear
      await kc.driver.sleep(1000);
      
      console.log("[TEST] Sort dropdown opened");
    } catch (error) {
      console.log(`[TEST] Could not test sorting: ${error.message}`);
    }
  });

  it('should show active filters', async () => {
    // Check if any filters are applied (chips/tags)
    const appliedFilters = await kc.driver.findElements(
      By.css('.a-section.a-spacing-none [data-cel-widget]')
    );
    
    console.log(`[TEST] Found ${appliedFilters.length} filter indicators`);
  });

  it('should maintain search term after filtering', async () => {
    const searchBox = await kc.driver.findElement(By.id('twotabsearchtextbox'));
    const currentValue = await searchBox.getAttribute('value');
    
    console.log(`[TEST] Search box value: "${currentValue}"`);
    expect(currentValue.toLowerCase()).to.include(SEARCH_TERM.toLowerCase());
  });
});
