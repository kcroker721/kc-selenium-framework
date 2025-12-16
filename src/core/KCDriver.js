const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const env = require("../config/env");

/**
 * KCDriver
 * A lightweight “framework wrapper” around Selenium WebDriver.
 *
 * Why it exists:
 * - Centralize waits/timeouts (reduce flakiness)
 * - Keep tests readable (KCClick/KCType conventions)
 * - Support multiple locator strategies with one API
 */
class KCDriver {
  constructor(driver) {
    this.driver = driver;
    this.defaultTimeout = 10000; // default wait timeout in ms
    this.enableLogging = process.env.KC_LOGGING !== "false"; // Enable by default
  }

  /**
   * KCLog(message, data?)
   * Internal logging method that adds timestamps and context
   */
  KCLog(message, data = null) {
    if (!this.enableLogging) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `[KC ${timestamp}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  // ---------- BUILD / TEARDOWN ----------

  /**
   * KCDriver.build()
   * Creates a browser session (Chrome/Firefox) using values from .env.
   *
   * When to use:
   * - In your Mocha beforeEach/before hooks to start a fresh browser session.
   *
   * Example:
   *   let kc;
   *   beforeEach(async () => { kc = await KCDriver.build(); });
   */
    static async build(options = {}) {
    console.log(`[KC] Building browser session...`);
    console.log(`[KC] Browser: ${env.browser}, Headless: ${env.headless}`);
    
    // Allow "headed: true" as a friendly alias
    if (options.headed === true) {
        options.headless = false;
    }

    // Determine headless mode:
    // 1) per-test options override
    // 2) fallback to .env
    const isHeadless =
        options.headless !== undefined
        ? options.headless
        : env.headless;

    let builder = new Builder().forBrowser(env.browser);

    if (env.browser === "chrome") {
        const options = new chrome.Options();

        if (env.headless) options.addArguments("--headless=new");
        options.addArguments("--window-size=1280,800");

        // ✅ reduce Chrome noise
        options.addArguments("--disable-logging");
        options.excludeSwitches(["enable-logging"]);

        builder.setChromeOptions(options);
    }


    if (env.browser === "firefox") {
        const firefoxOptions = new firefox.Options();

        if (isHeadless) {
        firefoxOptions.addArguments("-headless");
        }

        builder.setFirefoxOptions(firefoxOptions);
    }

    const driver = await builder.build();
    await driver.manage().window().maximize();
    console.log(`[KC] Browser session started successfully`);
    return new KCDriver(driver);
    }


  /**
   * KCQuit()
   * Closes the browser session.
   *
   * When to use:
   * - In your Mocha afterEach/after hooks so you don’t leak sessions.
   *
   * Example:
   *   afterEach(async () => { await kc.KCQuit(); });
   */
  async KCQuit() {
    if (this.driver) await this.driver.quit();
  }

  // ---------- NAVIGATION ----------

  /**
   * KCGoTo(url)
   * Navigates to a URL.
   *
   * When to use:
   * - Opening a page (login, dashboard, etc.)
   *
   * Example:
   *   await kc.KCGoTo("https://example.com/login");
   */
  async KCGoTo(url) {
    this.KCLog(`Navigating to: ${url}`);
    await this.driver.get(url);
    this.KCLog(`Successfully navigated to: ${url}`);
  }

  // ---------- INTERNAL HELPERS (LOCATORS + WAITS) ----------

  /**
   * KCBuildLocator(locatorType, locatorValue, options?)
   *
   * Supports two patterns:
   * 1) Explicit locator strategies:
   *    - "css", "id", "className", "xpath", "name", "linkText", "partialLinkText"
   *
   *    Examples:
   *      KCBuildLocator("css", "#saveBtn")
   *      KCBuildLocator("id", "username")
   *
   * 2) Tag + visible text convention (your in-house style):
   *    - locatorType is treated as an HTML tag
   *    - locatorValue is treated as VISIBLE TEXT
   *
   *    Examples:
   *      KCBuildLocator("span", "Hello, world")
   *      KCBuildLocator("h1", "Dashboard")
   *
   * Options:
   *  - contains: true  -> uses "contains(text)" instead of exact text match (tag+text mode only)
   */
  KCBuildLocator(locatorType, locatorValue, { contains = false } = {}) {
    switch (locatorType) {
      case "css":
        return By.css(locatorValue);
      case "id":
        return By.id(locatorValue);
      case "className":
      case "class":
        return By.className(locatorValue);
      case "xpath":
        return By.xpath(locatorValue);
      case "name":
        return By.name(locatorValue);
      case "linkText":
        return By.linkText(locatorValue);
      case "partialLinkText":
        return By.partialLinkText(locatorValue);

      default: {
        // Default: treat locatorType as TAG and locatorValue as VISIBLE TEXT
        const tag = locatorType;
        const text = locatorValue;

        const xpath = contains
          ? `//${tag}[contains(normalize-space(.), "${text}")]`
          : `//${tag}[normalize-space(.)="${text}"]`;

        return By.xpath(xpath);
      }
    }
  }

  /**
   * KCFindPresent(locator, timeout?)
   * Waits until the element is located in the DOM (present), but not necessarily visible.
   *
   * When to use:
   * - You need the element handle for staleness checks (DOM replacement)
   * - You want “present” instead of “visible”
   *
   * Example:
   *   const el = await kc.KCFindPresent(By.css(".loading"));
   */
  async KCFindPresent(locator, timeout = this.defaultTimeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  /**
   * KCFindVisible(locator, timeout?)
   * Waits until the element exists AND is visible.
   *
   * When to use:
   * - Most UI interactions: click/type should usually start from visible elements.
   *
   * Example:
   *   const header = await kc.KCFindVisible(By.css("h1"));
   */
  async KCFindVisible(locator, timeout = this.defaultTimeout) {
    const el = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  /**
   * KCWaitClickable(locator, timeout?)
   * Waits until the element is visible AND enabled (clickable).
   *
   * When to use:
   * - Before clicking buttons/links that sometimes render disabled for a moment.
   *
   * Example:
   *   const btn = await kc.KCWaitClickable(By.css("button[type='submit']"));
   */
  async KCWaitClickable(locator, timeout = this.defaultTimeout) {
    const el = await this.KCFindVisible(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(el), timeout);
    return el;
  }

  /**
   * KCWait(locatorType, locatorValue, options?)
   *
   * This is your “dynamic wait” that matches your KC conventions.
   *
   * Common usage:
   * - Wait for a tag + text to APPEAR:
   *     await kc.KCWait("h1", "Dashboard");
   *
   * - Wait for a spinner to DISAPPEAR (css):
   *     await kc.KCWait("css", ".spinner", { waitUntilType: "Disappeared", timeout: 20000 });
   *
   * - Wait for a toast to become STALE (DOM replaced):
   *     await kc.KCWait("span", "Saving...", { waitUntilStale: true });
   *
   * Options:
   *  - timeout: number (ms)
   *  - contains: boolean (tag+text mode only)
   *
   * Behavior controls (choose ONE):
   *  - waitUntilType: "Appeared" | "Disappeared" | "Stale"
   *  - waitUntilStale: true  (alias -> forces waitUntilType = "Stale")
   *
   * Notes:
   * - Appeared: element exists + visible
   * - Disappeared: element not present OR not visible (good for loaders/spinners)
   * - Stale: element was found, then detached from DOM (good for re-rendering)
   */
  async KCWait(locatorType, locatorValue, options = {}) {
    // Support named parameters (new syntax)
    if (typeof locatorType === 'object' && locatorType !== null) {
      const params = locatorType;
      locatorType = params.locator;
      locatorValue = params.value;
      options = { ...params }; // Spread remaining options
      delete options.locator;
      delete options.value;
    }

    const timeout = options.timeout ?? this.defaultTimeout;

    // Allow the alias you asked for:
    // KCWait("span","Kevin Croker",{ waitUntilStale: true })
    const waitUntilType =
      options.waitUntilStale === true
        ? "Stale"
        : options.waitUntilType ?? "Appeared";

    this.KCLog(`Waiting for element ${waitUntilType}: ${locatorType}="${locatorValue}" (timeout: ${timeout}ms)`);
    
    const locator = this.KCBuildLocator(locatorType, locatorValue, options);

    try {
      if (waitUntilType === "Appeared") {
        await this.KCFindVisible(locator, timeout);
        this.KCLog(`Element appeared: ${locatorType}="${locatorValue}"`);
        return;
      }

      if (waitUntilType === "Disappeared") {
      await this.driver.wait(async () => {
        const els = await this.driver.findElements(locator);
        if (els.length === 0) return true;

        try {
          const displayed = await els[0].isDisplayed();
          return !displayed;
        } catch {
          // If element reference went stale / detached, treat as disappeared
          return true;
        }
      }, timeout);
      return;
    }

      if (waitUntilType === "Stale") {
        // Find element first, then wait until it becomes stale (detached)
        const el = await this.KCFindPresent(locator, timeout);
        await this.driver.wait(until.stalenessOf(el), timeout);
        this.KCLog(`Element became stale: ${locatorType}="${locatorValue}"`);
        return;
      }

      throw new Error(`KCWait: Unknown waitUntilType "${waitUntilType}"`);
    } catch (error) {
      this.KCLog(`ERROR: Wait failed for ${locatorType}="${locatorValue}" (${waitUntilType}, timeout: ${timeout}ms)`);
      throw new Error(`KCWait failed for ${locatorType}="${locatorValue}" (${waitUntilType}): ${error.message}`);
    }
  }

  // ---------- ACTIONS ----------

  /**
   * KCType(locatorType, locatorValue, text, options?)
   * KCType({ locator, value, text, ...options })
   *
   * When to use:
   * - Entering text into inputs/fields (username/password/search bars)
   *
   * Examples (Old Syntax - still works):
   *   await kc.KCType("css", "#username", "tomsmith");
   *   await kc.KCType("id", "password", "SuperSecretPassword!");
   *
   * Examples (New Syntax - named parameters):
   *   await kc.KCType({ locator: 'id', value: 'username', text: 'tomsmith' });
   *   await kc.KCType({ locator: 'css', value: '#password', text: 'secret123' });
   *
   * Options:
   *  - timeout: number (ms)
   *  - contains: boolean (only relevant if using tag+text mode, not typical for typing)
   */
  async KCType(locatorType, locatorValue, text, options = {}) {
    // Support named parameters (new syntax)
    if (typeof locatorType === 'object' && locatorType !== null) {
      const params = locatorType;
      locatorType = params.locator;
      locatorValue = params.value;
      text = params.text;
      options = { ...params }; // Spread remaining options
      delete options.locator;
      delete options.value;
      delete options.text;
    }

    this.KCLog(`Typing into element: ${locatorType}="${locatorValue}"`);
    const timeout = options.timeout ?? this.defaultTimeout;
    const locator = this.KCBuildLocator(locatorType, locatorValue, options);
    const el = await this.KCFindVisible(locator, timeout);
    await el.clear();
    await el.sendKeys(text);
    this.KCLog(`Successfully typed into: ${locatorType}="${locatorValue}"`);
  }

  /**
   * KCClick(locatorType, locatorValue, options?)
   * KCClick({ locator, value, ...options })
   *
   * Supports:
   * - tag + visible text:
   *     await kc.KCClick("span", "Hello, world");
   *     await kc.KCClick("h1", "Dashboard");
   *     await kc.KCClick("button", "Save");
   *
   * - explicit locator strategies:
   *     await kc.KCClick("css", "#saveBtn");
   *     await kc.KCClick("className", "submit-button");
   *     await kc.KCClick("id", "loginBtn");
   *     await kc.KCClick("xpath", "//div[@role='button']");
   *
   * Examples (New Syntax - named parameters):
   *   await kc.KCClick({ locator: 'id', value: 'loginBtn' });
   *   await kc.KCClick({ locator: 'button', value: 'Login' });
   *   await kc.KCClick({ locator: 'css', value: '#submit', timeout: 5000 });
   *
   * Options:
   *  - timeout: number (ms)
   *  - contains: boolean (tag+text mode only; use if text is partial or dynamic)
   *
   * When to use:
   * - Clicking anything clickable (buttons, links, menu items)
   * - Keeps your tests readable and hides XPath/CSS complexity
   */
  async KCClick(locatorType, locatorValue, options = {}) {
    // Support named parameters (new syntax)
    if (typeof locatorType === 'object' && locatorType !== null) {
      const params = locatorType;
      locatorType = params.locator;
      locatorValue = params.value;
      options = { ...params }; // Spread remaining options
      delete options.locator;
      delete options.value;
    }

    this.KCLog(`Clicking element: ${locatorType}="${locatorValue}"`);
    const timeout = options.timeout ?? this.defaultTimeout;
    const locator = this.KCBuildLocator(locatorType, locatorValue, options);
    const el = await this.KCWaitClickable(locator, timeout);
    await el.click();
    this.KCLog(`Successfully clicked: ${locatorType}="${locatorValue}"`);
  }
}

module.exports = KCDriver;
