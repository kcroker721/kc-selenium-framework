/**
 * ========================================
 * KC SELENIUM FRAMEWORK - TEST TEMPLATE
 * ========================================
 * 
 * Copy this template to create new test files.
 * Replace placeholders with your actual test data and logic.
 * 
 * File naming convention: descriptiveName.test.js
 * Example: userRegistration.test.js, checkout.test.js
 */

const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../src/core/KCDriver");

/**
 * ============================
 * TEST DATA / CONSTANTS
 * ============================
 * Define your URLs, test data, and expected values here
 */
const TEST_URL = "https://example.com";
const TEST_USERNAME = "testuser";
const EXPECTED_TITLE = "Example Domain";

/**
 * ============================
 * MAIN TEST SUITE
 * ============================
 */
describe('Your Test Suite Name', function () {
  // Set timeout for the entire suite (default: 2000ms, increase for slow tests)
  this.timeout(40000);

  let kc;  // KCDriver instance

  /**
   * ============================
   * SETUP - Runs before all tests
   * ============================
   */
  before(async () => {
    console.log("[TEST] Starting test setup");
    
    // Build browser session
    // headed: false = headless (no visible browser)
    // headed: true = headed (visible browser - useful for debugging)
    kc = await KCDriver.build({ headed: false });
    
    console.log("[TEST] Navigating to test URL");
    await kc.KCGoTo(TEST_URL);
    
    console.log("[TEST] Setup complete");
  });

  /**
   * ============================
   * TEARDOWN - Runs after all tests
   * ============================
   */
  after(async () => {
    console.log("[TEST] Cleaning up and closing browser");
    await kc.KCQuit();
  });

  /**
   * ============================
   * OPTIONAL: beforeEach / afterEach
   * ============================
   * Use these if you need to reset state between individual tests
   */
  // beforeEach(async () => {
  //   console.log("[TEST] Running before each test");
  // });

  // afterEach(async () => {
  //   console.log("[TEST] Running after each test");
  // });

  /**
   * ============================
   * TEST CASES
   * ============================
   */
  
  describe('Example Test Group 1', () => {
    it('should verify page loads correctly', async () => {
      console.log("[TEST] Verifying page title");
      
      const pageTitle = await kc.driver.getTitle();
      console.log(`[TEST] Page title: "${pageTitle}"`);
      
      expect(pageTitle).to.include(EXPECTED_TITLE);
    });

    it('should interact with elements using named parameters', async () => {
      console.log("[TEST] Testing element interactions");
      
      // Wait for element to appear
      await kc.KCWait({ locator: 'id', value: 'elementId' });
      
      // Type into input field
      await kc.KCType({ 
        locator: 'id', 
        value: 'username', 
        text: TEST_USERNAME 
      });
      
      // Click a button
      await kc.KCClick({ locator: 'button', value: 'Submit' });
      
      // Wait for result with custom timeout
      await kc.KCWait({ 
        locator: 'css', 
        value: '.success-message', 
        timeout: 15000 
      });
    });

    it('should handle optional elements (try-catch)', async () => {
      console.log("[TEST] Handling optional cookie banner");
      
      // Try to click optional element (e.g., cookie consent)
      try {
        await kc.KCClick({ 
          locator: 'id', 
          value: 'cookie-accept', 
          timeout: 5000 
        });
        console.log("[TEST] Cookie banner accepted");
      } catch {
        console.log("[TEST] No cookie banner found (continuing)");
      }
    });
  });

  describe('Example Test Group 2 - Assertions', () => {
    it('should verify text content', async () => {
      // Find element and get text
      const element = await kc.KCFindVisible(By.css('.message'));
      const text = await element.getText();
      
      // Chai assertions
      expect(text).to.equal('Expected exact text');
      expect(text).to.include('partial text');
      expect(text.length).to.be.greaterThan(0);
    });

    it('should verify multiple elements exist', async () => {
      // Find multiple elements
      const results = await kc.driver.findElements(By.css('.result-item'));
      
      console.log(`[TEST] Found ${results.length} results`);
      expect(results.length).to.be.greaterThan(0);
    });

    it('should wait for element to disappear', async () => {
      // Wait for loading spinner to disappear
      await kc.KCWait({ 
        locator: 'css', 
        value: '.loading-spinner', 
        waitUntilType: 'Disappeared',
        timeout: 20000 
      });
      
      console.log("[TEST] Loading complete");
    });
  });

  /**
   * ============================
   * EXAMPLE: Using Tag + Text
   * ============================
   * KC methods support finding elements by tag and visible text
   */
  describe('Example - Tag + Text Locators', () => {
    it('should click elements by visible text', async () => {
      // Click button with text "Login"
      await kc.KCClick({ locator: 'button', value: 'Login' });
      
      // Click span with text "Welcome"
      await kc.KCClick({ locator: 'span', value: 'Welcome' });
      
      // Wait for h1 heading with specific text
      await kc.KCWait({ locator: 'h1', value: 'Dashboard' });
    });

    it('should use partial text matching', async () => {
      // Click element containing partial text
      await kc.KCClick({ 
        locator: 'button', 
        value: 'Submit', 
        contains: true  // Matches "Submit Form", "Submit Now", etc.
      });
    });
  });

  /**
   * ============================
   * EXAMPLE: Advanced Selenium
   * ============================
   * Direct Selenium WebDriver access when needed
   */
  describe('Example - Advanced Selenium Features', () => {
    it('should use raw Selenium WebDriver', async () => {
      // Access driver directly for advanced operations
      const currentUrl = await kc.driver.getCurrentUrl();
      console.log(`[TEST] Current URL: ${currentUrl}`);
      
      // Execute JavaScript
      const result = await kc.driver.executeScript('return document.title;');
      console.log(`[TEST] JS Result: ${result}`);
      
      // Get element attribute
      const element = await kc.KCFindVisible(By.id('myElement'));
      const className = await element.getAttribute('class');
      console.log(`[TEST] Class: ${className}`);
    });

    it('should take screenshot on failure', async function () {
      // In afterEach or after, check if test failed
      if (this.currentTest && this.currentTest.state === 'failed') {
        const screenshot = await kc.driver.takeScreenshot();
        require('fs').writeFileSync(
          `reports/screenshots/${this.currentTest.title}.png`,
          screenshot,
          'base64'
        );
      }
    });
  });
});

/**
 * ============================
 * QUICK REFERENCE
 * ============================
 * 
 * KC Methods (Named Parameters):
 * -------------------------------
 * await kc.KCGoTo(url)
 * await kc.KCClick({ locator, value, timeout?, contains? })
 * await kc.KCType({ locator, value, text, timeout? })
 * await kc.KCWait({ locator, value, timeout?, waitUntilType?, contains? })
 * await kc.KCFindVisible(By.locator, timeout?)
 * await kc.KCWaitClickable(By.locator, timeout?)
 * await kc.KCQuit()
 * 
 * Locator Types:
 * --------------
 * 'id'        - By ID attribute
 * 'css'       - CSS selector
 * 'xpath'     - XPath expression
 * 'name'      - By name attribute
 * 'button'    - Button by visible text
 * 'span'      - Span by visible text
 * 'a'         - Link by visible text
 * 'h1'        - Heading by visible text
 * 
 * Chai Assertions:
 * ----------------
 * expect(value).to.equal(expected)
 * expect(value).to.include(substring)
 * expect(value).to.be.greaterThan(number)
 * expect(value).to.be.lessThan(number)
 * expect(array).to.have.lengthOf(number)
 * expect(value).to.be.true / .to.be.false
 * 
 * Console Logging:
 * ----------------
 * console.log("[TEST] Your message here")
 * kc.KCLog("Your message")  // Internal KC logging with timestamp
 * 
 * waitUntilType Options:
 * ----------------------
 * 'Appeared'    - Element exists and is visible (default)
 * 'Disappeared' - Element not present or not visible
 * 'Stale'       - Element detached from DOM (for re-renders)
 */
