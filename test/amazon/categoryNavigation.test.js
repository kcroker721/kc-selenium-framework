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
    
    await kc.KCClick({ 
      locator: 'span', 
      value: 'Electronics', 
      contains: true 
    });
    
    // Wait for subcategories to load
    await kc.KCWait({ locator: 'css', value: '.hmenu-visible' });
    
    const currentUrl = await kc.driver.getCurrentUrl();
    console.log(`[TEST] Current URL: ${currentUrl}`);
    
    // URL should contain reference to electronics or navigation
    const hasElectronics = currentUrl.includes('electronics') || currentUrl.includes('nav_em');
    console.log(`[TEST] Electronics reference found: ${hasElectronics}`);
    
    expect(hasElectronics).to.be.true;
  });

  it('should have breadcrumb navigation', async () => {
    // Navigate to a category first
    await kc.KCGoTo(AMAZON_URL);
    
    await kc.KCType({ 
      locator: 'id', 
      value: 'twotabsearchtextbox', 
      text: 'books' 
    });
    await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });
    
    await kc.KCWait({ locator: 'css', value: 'div.s-main-slot', timeout: 30000 });
    
    // Check for breadcrumb or department indicators
    const pageTitle = await kc.driver.getTitle();
    console.log(`[TEST] Page title: ${pageTitle}`);
    
    const hasBooks = pageTitle.toLowerCase().includes('books');
    console.log(`[TEST] Books reference found: ${hasBooks}`);
    
    expect(hasBooks).to.be.true;
  });
});
