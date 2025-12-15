require("dotenv").config();

module.exports = {
  baseUrl: process.env.BASE_URL,
  browser: process.env.BROWSER || "chrome",
  headless: (process.env.HEADLESS || "true").toLowerCase() === "true",
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};
