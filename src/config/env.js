require("dotenv").config({ quiet: true });

module.exports = {
  baseUrl: process.env.BASE_URL,
  browser: process.env.BROWSER || "chrome",
  headless: (process.env.HEADLESS || "true").toLowerCase() === "true",
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};
