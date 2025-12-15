const env = require("../config/env");

module.exports = async function signOn(kc) {
  await kc.KCGoTo(`${env.baseUrl}/login`);

  await kc.KCType("css", "#username", env.username);
  await kc.KCType("css", "#password", env.password);

  // Demo site button text is "Login"
  await kc.KCClick("button", "Login");
};
