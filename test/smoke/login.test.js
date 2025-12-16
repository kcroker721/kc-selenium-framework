const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../../src/core/KCDriver");
const signOn = require("../../src/flows/signOn");
const addContext = require("mochawesome/addContext");
const fs = require("fs");


describe('KC Framework - Login Test', function () {
  this.timeout(40000);

  let kc;

  before(async () => {
    kc = await KCDriver.build();
  });

  after(async function () {
  if (this.currentTest.state === "failed") {
    const safeTitle = this.currentTest.title.replace(/[^\w\d-]+/g, "_");
    const fileName = `${safeTitle}.png`;

    // Save screenshot into reports/screenshots
    const screenshotPath = `reports/screenshots/${fileName}`;
    const screenshot = await kc.driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, "base64");

    // Attach to Mochawesome report (use path relative to reports/)
    addContext(this, {
      title: "Screenshot",
      value: `screenshots/${fileName}`,
    });
  }

  await kc.KCQuit();
});



  it("logs in successfully", async () => {
    await signOn(kc);

    const flashEl = await kc.KCFindVisible(By.css("#flash"));
    const flashText = await flashEl.getText();

    expect(flashText).to.include("You logged into a secure area!");
  });
});
