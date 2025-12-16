const env = require("../config/env");

module.exports = async function signOn(kc) {
  await kc.KCGoTo(`${env.baseUrl}/login`);

  // Using new named parameter syntax for clarity
  await kc.KCType({ locator: 'css', value: '#username', text: env.username });
  await kc.KCType({ locator: 'css', value: '#password', text: env.password });

  // Demo site button text is "Login"
  await kc.KCClick({ locator: 'button', value: 'Login' });
};
