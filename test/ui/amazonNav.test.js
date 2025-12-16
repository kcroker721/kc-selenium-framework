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
    console.log("[TEST] Starting Amazon navigation test setup");
    kc = await KCDriver.build({ headed: true });
    console.log("[TEST] Navigating to Amazon homepage");
    await kc.KCGoTo(AMAZON_URL);

    console.log("[TEST] Checking for cookie consent banner");
    try {
      await kc.KCClick("id", "sp-cc-accept", { timeout: 5000 });
      console.log("[TEST] Cookie consent accepted");
    } catch {
      console.log("[TEST] No cookie consent banner found (continuing)");
      // ignore if not present
    }
    console.log("[TEST] Setup complete");
  });

  after(async () => {
    console.log("[TEST] Cleaning up and closing browser");
    await kc.KCQuit();
  });

  /**
   * ============================
   * NAVIGATION & ACTIONS
   * ============================
   */
  describe("Navigation and user actions", () => {
    it("searches for a product and opens the first result", async () => {
      console.log("[TEST] Step 1: Verifying homepage loaded");
      // Assert homepage loaded
      const pageTitle = await kc.driver.getTitle();
      console.log(`[TEST] Page title: "${pageTitle}"`);
      expect(pageTitle.toLowerCase()).to.include(EXPECTED_TITLE_KEYWORD);

      console.log(`[TEST] Step 2: Searching for "${SEARCH_TEXT}"`);
      // Perform search
      await kc.KCWait("id", "twotabsearchtextbox");
      await kc.KCType("id", "twotabsearchtextbox", SEARCH_TEXT);
      await kc.KCClick("id", "nav-search-submit-button");

      console.log("[TEST] Step 3: Waiting for search results");
      // Wait for results
      await kc.KCWait("css", "div.s-main-slot", { timeout: 30000 });

      console.log("[TEST] Step 4: Verifying search results exist");
      const results = await kc.driver.findElements(
        By.css("div.s-main-slot div[data-component-type='s-search-result']")
      );
      console.log(`[TEST] Found ${results.length} search results`);
      expect(results.length).to.be.greaterThan(0);

      console.log("[TEST] Step 5: Opening first product");
      // Open first product
      const firstResult = await kc.KCFindVisible(
        By.css("div.s-main-slot a.a-link-normal.s-no-outline"),
        30000
      );
      await firstResult.click();

      console.log("[TEST] Step 6: Capturing product title");
      // Capture product title for assertions
      await kc.KCWait("id", "productTitle", { timeout: 30000 });
      const productTitleEl = await kc.KCFindVisible(By.id("productTitle"));
      actualProductTitle = (await productTitleEl.getText()).trim();
      console.log(`[TEST] Product title captured: "${actualProductTitle}"`);
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
