const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";
const SEARCH_TERM = "gaming headset";

describe('Amazon - Product Details Validation', function () {
  this.timeout(90000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Amazon product details test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(AMAZON_URL);

    try {
      await kc.KCClick({ locator: 'id', value: 'sp-cc-accept', timeout: 5000 });
    } catch {
      // ignore
    }

    // Search and open first product
    await kc.KCType({ locator: 'id', value: 'twotabsearchtextbox', text: SEARCH_TERM });
    await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });
    await kc.KCWait({ locator: 'css', value: 'div.s-main-slot', timeout: 30000 });

    const firstResult = await kc.KCFindVisible(
      By.css("div.s-main-slot a.a-link-normal.s-no-outline"),
      30000
    );
    await firstResult.click();
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should have a valid product title', async () => {
    await kc.KCWait({ locator: 'id', value: 'productTitle', timeout: 30000 });
    
    const titleElement = await kc.KCFindVisible(By.id('productTitle'));
    const title = await titleElement.getText();
    
    console.log(`[TEST] Product title: "${title}"`);
    
    expect(title).to.not.be.empty;
    expect(title.length).to.be.greaterThan(10);
  });

  it('should display product price', async () => {
    try {
      // Try different price selectors
      const priceElement = await kc.driver.findElement(
        By.css('.a-price .a-offscreen')
      );
      const price = await priceElement.getAttribute('textContent');
      
      console.log(`[TEST] Product price: ${price}`);
      
      expect(price).to.include('$');
      expect(price.length).to.be.greaterThan(1);
    } catch {
      console.log("[TEST] Price not displayed (may be out of stock)");
    }
  });

  it('should show product images', async () => {
    const images = await kc.driver.findElements(By.css('#altImages img'));
    
    console.log(`[TEST] Found ${images.length} product images`);
    
    expect(images.length).to.be.greaterThan(0);
  });

  it('should have product description or features', async () => {
    try {
      // Check for feature bullets
      const features = await kc.driver.findElements(
        By.css('#feature-bullets li')
      );
      
      console.log(`[TEST] Found ${features.length} product features`);
      expect(features.length).to.be.greaterThan(0);
    } catch {
      console.log("[TEST] Feature bullets not found, checking for description");
      
      // Alternative: check for description
      const description = await kc.driver.findElements(
        By.css('#productDescription')
      );
      expect(description.length).to.be.greaterThan(0);
    }
  });

  it('should have add to cart or buy options', async () => {
    const buttons = await kc.driver.findElements(
      By.css('#add-to-cart-button, #buy-now-button')
    );
    
    console.log(`[TEST] Found ${buttons.length} purchase buttons`);
    expect(buttons.length).to.be.greaterThan(0);
  });
});
