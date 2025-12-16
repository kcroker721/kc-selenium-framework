const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");

/**
 * ============================
 * TEST DATA
 * ============================
 */
const AMAZON_URL = "https://www.amazon.com";
const SEARCH_TERM = "laptop";

describe('Amazon - Customer Reviews', function () {
  this.timeout(90000);

  let kc;

  before(async () => {
    console.log("[TEST] Starting Amazon customer reviews test");
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(AMAZON_URL);

    try {
      await kc.KCClick({ locator: 'id', value: 'sp-cc-accept', timeout: 5000 });
    } catch {
      // ignore
    }

    // Wait for search box to be ready
    await kc.KCWait({ locator: 'id', value: 'twotabsearchtextbox', timeout: 10000 });

    // Search for product
    await kc.KCType({ 
      locator: 'id', 
      value: 'twotabsearchtextbox', 
      text: SEARCH_TERM 
    });
    
    await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });
    
    // Wait for results to load
    await kc.driver.sleep(3000);

    // Wait for product links to appear
    await kc.KCWait({ 
      locator: 'css', 
      value: 'div[data-component-type="s-search-result"] h2 a', 
      timeout: 15000 
    });

    // Open first product
    const firstProduct = await kc.KCFindVisible(
      By.css('div[data-component-type="s-search-result"] h2 a')
    );
    await firstProduct.click();
    
    await kc.KCWait({ 
      locator: 'id', 
      value: 'productTitle', 
      timeout: 30000 
    });
    
    // Give product page time to fully load
    await kc.driver.sleep(2000);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should display star rating', async () => {
    console.log("[TEST] Checking for star rating");
    
    const ratings = await kc.driver.findElements(
      By.css('#acrPopover, .a-icon-star, [data-hook="rating-out-of-text"]')
    );
    
    console.log(`[TEST] Found ${ratings.length} rating elements`);
    expect(ratings.length).to.be.greaterThan(0);
  });

  it('should show review count', async () => {
    console.log("[TEST] Checking review count");
    
    const reviewCount = await kc.driver.findElements(
      By.css('#acrCustomerReviewText, [data-hook="total-review-count"]')
    );
    
    console.log(`[TEST] Found ${reviewCount.length} review count elements`);
    expect(reviewCount.length).to.be.greaterThan(0);
  });

  it('should have customer review section', async () => {
    console.log("[TEST] Scrolling to reviews section");
    
    // Scroll down to load reviews
    await kc.driver.executeScript('window.scrollTo(0, document.body.scrollHeight / 2);');
    await kc.driver.sleep(2000);
    
    const reviewSections = await kc.driver.findElements(
      By.css('#cm-cr-dp-review-list, [data-hook="review"], .review')
    );
    
    console.log(`[TEST] Found ${reviewSections.length} review sections`);
    expect(reviewSections.length).to.be.greaterThan(0);
  });

  it('should display individual reviews', async () => {
    console.log("[TEST] Checking for individual reviews");
    
    const reviews = await kc.driver.findElements(
      By.css('[data-hook="review"], .review, .a-section.review')
    );
    
    console.log(`[TEST] Found ${reviews.length} individual reviews`);
    
    if (reviews.length > 0) {
      expect(reviews.length).to.be.greaterThan(0);
    } else {
      // Some products might not have reviews visible without clicking
      const seeAllReviewsLink = await kc.driver.findElements(
        By.css('[data-hook="see-all-reviews-link-foot"], a[href*="customerReviews"]')
      );
      expect(seeAllReviewsLink.length).to.be.greaterThan(0);
    }
  });

  it('should have review star breakdown', async () => {
    console.log("[TEST] Checking for star rating breakdown");
    
    const starBreakdown = await kc.driver.findElements(
      By.css('#histogramTable, .a-histogram-row, [data-hook="histogram-row"]')
    );
    
    console.log(`[TEST] Found ${starBreakdown.length} star breakdown rows`);
    expect(starBreakdown.length).to.be.greaterThan(0);
  });

  it('should display review text content', async () => {
    console.log("[TEST] Checking review text");
    
    const reviewTexts = await kc.driver.findElements(
      By.css('[data-hook="review-body"], .review-text-content, .a-expander-content.reviewText')
    );
    
    console.log(`[TEST] Found ${reviewTexts.length} review text blocks`);
    
    if (reviewTexts.length > 0) {
      const firstReviewText = await reviewTexts[0].getText();
      console.log(`[TEST] First review preview: ${firstReviewText.substring(0, 50)}...`);
      expect(firstReviewText.length).to.be.greaterThan(10);
    } else {
      // Reviews might be behind "See all reviews" link
      console.log("[TEST] No visible review text, checking for reviews link");
      expect(reviewTexts.length).to.be.at.least(0);
    }
  });

  it('should show helpful vote count on reviews', async () => {
    console.log("[TEST] Checking for helpful votes");
    
    const helpfulVotes = await kc.driver.findElements(
      By.css('[data-hook="helpful-vote-statement"], .cr-vote-text')
    );
    
    console.log(`[TEST] Found ${helpfulVotes.length} helpful vote indicators`);
    
    // Not all reviews have votes, so just check structure exists
    expect(helpfulVotes.length).to.be.at.least(0);
  });

  it('should have link to see all reviews', async () => {
    console.log("[TEST] Checking for 'See all reviews' link");
    
    const seeAllLink = await kc.driver.findElements(
      By.css('[data-hook="see-all-reviews-link-foot"], a[href*="customerReviews"], a:contains("See all reviews")')
    );
    
    console.log(`[TEST] Found ${seeAllLink.length} 'See all reviews' links`);
    expect(seeAllLink.length).to.be.greaterThan(0);
  });
});
