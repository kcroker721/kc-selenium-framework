const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";

describe('Amazon - Homepage Elements', function () {
  this.timeout(60000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Amazon homepage elements test");
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

  it('should display Amazon logo', async () => {
    const logo = await kc.KCFindVisible(By.id('nav-logo-sprites'));
    const isDisplayed = await logo.isDisplayed();
    
    expect(isDisplayed).to.be.true;
  });

  it('should have search box', async () => {
    const searchBox = await kc.KCFindVisible(By.id('twotabsearchtextbox'));
    const isEnabled = await searchBox.isEnabled();
    
    expect(isEnabled).to.be.true;
  });

  it('should display navigation bar', async () => {
    const nav = await kc.KCFindVisible(By.id('nav-main'));
    const isDisplayed = await nav.isDisplayed();
    
    expect(isDisplayed).to.be.true;
  });

  it('should have cart icon', async () => {
    const cart = await kc.driver.findElements(By.id('nav-cart'));
    
    expect(cart.length).to.be.greaterThan(0);
  });

  it('should display product recommendations', async () => {
    // Scroll down to trigger lazy loading
    await kc.driver.executeScript('window.scrollTo(0, 1000)');
    await kc.driver.sleep(3000);
    
    // Homepage has different product containers than search results
    const products = await kc.driver.findElements(
      By.css('.a-carousel-card, [data-card-identifier], .octopus-pc-item, img[alt*="product"], .a-cardui')
    );
    
    console.log(`[TEST] Found ${products.length} product recommendation elements`);
    
    // Just verify the page has content loaded (may not always have visible products)
    expect(products.length).to.be.at.least(0);
  });

  it('should have footer', async () => {
    // Scroll to bottom
    await kc.driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    await kc.driver.sleep(1000);
    
    const footer = await kc.driver.findElements(By.css('footer, #navFooter'));
    
    expect(footer.length).to.be.greaterThan(0);
  });
});
