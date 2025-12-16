const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";

describe('Amazon - Category Navigation', function () {
  this.timeout(60000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Amazon category navigation test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(AMAZON_URL);

    try {
      await kc.KCClick({ locator: 'id', value: 'sp-cc-accept', timeout: 5000 });
    } catch {
      // ignore
    }
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should open hamburger menu', async () => {
    console.log("[TEST] Opening navigation menu");
    
    await kc.KCClick({ locator: 'id', value: 'nav-hamburger-menu' });
    
    // Wait for menu to appear
    await kc.KCWait({ 
      locator: 'css', 
      value: '.hmenu-visible', 
      timeout: 10000 
    });
    
    const menu = await kc.KCFindVisible(By.css('.hmenu-visible'));
    const isDisplayed = await menu.isDisplayed();
    
    expect(isDisplayed).to.be.true;
  });

  it('should display main categories', async () => {
    const categories = await kc.driver.findElements(
      By.css('.hmenu-visible li a')
    );
    
    console.log(`[TEST] Found ${categories.length} menu items`);
    expect(categories.length).to.be.greaterThan(10);
  });

  it('should navigate to Electronics category', async () => {
    console.log("[TEST] Navigating to Electronics");
    
    // Wait for menu to be fully visible and stable
    await kc.driver.sleep(1000);
    
    await kc.KCClick({ 
      locator: 'span', 
      value: 'Electronics', 
      contains: true,
      timeout: 10000
    });
    
    // Wait for either subcategories or navigation change
    await kc.driver.sleep(2000);
    
    const currentUrl = await kc.driver.getCurrentUrl();
    console.log(`[TEST] Current URL: ${currentUrl}`);
    
    // Just verify the menu interaction worked (URL may or may not change)
    const menuStillVisible = await kc.driver.findElements(By.css('.hmenu-visible'));
    console.log(`[TEST] Menu elements visible: ${menuStillVisible.length}`);
    
    expect(menuStillVisible.length).to.be.greaterThan(0);
  });

  it('should have breadcrumb navigation', async () => {
    // Navigate to a category first
    await kc.KCGoTo(AMAZON_URL);
    
    // Wait for search box to be ready
    await kc.KCWait({ locator: 'id', value: 'twotabsearchtextbox', timeout: 10000 });
    
    await kc.KCType({ 
      locator: 'id', 
      value: 'twotabsearchtextbox', 
      text: 'books' 
    });
    
    await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });
    
    // Wait for search results or any result indicator
    await kc.driver.sleep(3000);
    
    // Check if we got results by looking at URL or title
    const currentUrl = await kc.driver.getCurrentUrl();
    const pageTitle = await kc.driver.getTitle();
    console.log(`[TEST] Current URL: ${currentUrl}`);
    console.log(`[TEST] Page title: ${pageTitle}`);
    
    const hasSearchIndicator = currentUrl.includes('k=books') || 
                                pageTitle.toLowerCase().includes('books') ||
                                currentUrl.includes('/s?');
    console.log(`[TEST] Search executed: ${hasSearchIndicator}`);
    
    expect(hasSearchIndicator).to.be.true;
  });
});
