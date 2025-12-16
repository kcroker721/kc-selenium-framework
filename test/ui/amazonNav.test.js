const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA / EXPECTATIONS
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";
const SEARCH_TEXT = "wireless mouse";
const EXPECTED_TITLE_KEYWORD = "amazon";
const EXPECTED_PRODUCT_KEYWORD = "mouse";

describe('[AMAZON] Amazon navigation smoke', function () {
  this.timeout(90000);

  let kc;
  let actualProductTitle = "";

  /**
   * ============================
   * SETUP / TEARDOWN
   * ============================
   */
  before(async () => {
    kc = await KCDriver.build({ headed: true });
    await kc.KCGoTo(AMAZON_URL);

    try {
      await kc.KCClick("id", "sp-cc-accept", { timeout: 5000 });
    } catch {
      // ignore if not present
    }
  });

  after(async () => {
    await kc.KCQuit();
  });

  /**
   * ============================
   * NAVIGATION & ACTIONS
   * ============================
   */
  describe("Navigation and user actions", () => {
    it("searches for a product and opens the first result", async () => {
      // Assert homepage loaded
      const pageTitle = await kc.driver.getTitle();
      expect(pageTitle.toLowerCase()).to.include(EXPECTED_TITLE_KEYWORD);

      // Perform search
      await kc.KCWait("id", "twotabsearchtextbox");
      await kc.KCType("id", "twotabsearchtextbox", SEARCH_TEXT);
      await kc.KCClick("id", "nav-search-submit-button");

      // Wait for results
      await kc.KCWait("css", "div.s-main-slot", { timeout: 30000 });

      const results = await kc.driver.findElements(
        By.css("div.s-main-slot div[data-component-type='s-search-result']")
      );
      expect(results.length).to.be.greaterThan(0);

      // Open first product
      const firstResult = await kc.KCFindVisible(
        By.css("div.s-main-slot a.a-link-normal.s-no-outline"),
        30000
      );
      await firstResult.click();

      // Capture product title for assertions
      await kc.KCWait("id", "productTitle", { timeout: 30000 });
      const productTitleEl = await kc.KCFindVisible(By.id("productTitle"));
      actualProductTitle = (await productTitleEl.getText()).trim();
    });
  });

  /**
   * ============================
   * ASSERTIONS
   * ============================
   */
  describe("Product page assertions", () => {
    it("has a non-empty product title", () => {
      expect(actualProductTitle.length).to.be.greaterThan(0);
    });

    it("product title contains the expected keyword", () => {
      expect(actualProductTitle.toLowerCase()).to.include(EXPECTED_PRODUCT_KEYWORD);
    });
  });
});
