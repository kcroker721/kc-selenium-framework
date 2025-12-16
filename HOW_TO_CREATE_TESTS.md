# 📝 How to Create New Tests

## Method 1: Copy the Template File (Recommended)

1. **Copy the template:**
   ```bash
   cp test/TEST_TEMPLATE.js test/yourNewTest.test.js
   ```

2. **Edit your new test file:**
   - Replace `TEST_URL` with your target URL
   - Update `describe('Your Test Suite Name')` with a descriptive name
   - Add your test data constants
   - Write your test cases in the `it()` blocks

3. **Run your test:**
   ```bash
   npm test test/yourNewTest.test.js
   ```

## Method 2: Use VS Code Snippet

1. **Create a new file** in the `test/` directory (e.g., `test/login.test.js`)

2. **Type `kctemplate`** and press **Tab** or **Enter**

3. **Fill in the placeholders:**
   - Import path (usually `../src/core/KCDriver`)
   - Test URL
   - Test suite name
   - Timeout value
   - Headed mode (false for headless, true for visible browser)
   - Test group name
   - Test case description

4. **Your cursor will be positioned** where you need to write your test logic

## Quick Start Example

```javascript
const { expect } = require("chai");
const { By } = require("selenium-webdriver");
const KCDriver = require("../src/core/KCDriver");

const LOGIN_URL = "https://example.com/login";
const TEST_USERNAME = "testuser";
const TEST_PASSWORD = "password123";

describe('Login Functionality', function () {
  this.timeout(40000);

  let kc;

  before(async () => {
    kc = await KCDriver.build({ headed: false });
    await kc.KCGoTo(LOGIN_URL);
  });

  after(async () => {
    await kc.KCQuit();
  });

  it('should login successfully', async () => {
    await kc.KCType({ locator: 'id', value: 'username', text: TEST_USERNAME });
    await kc.KCType({ locator: 'id', value: 'password', text: TEST_PASSWORD });
    await kc.KCClick({ locator: 'button', value: 'Login' });
    
    await kc.KCWait({ locator: 'css', value: '.welcome-message' });
    
    const welcomeMsg = await kc.KCFindVisible(By.css('.welcome-message'));
    const text = await welcomeMsg.getText();
    
    expect(text).to.include('Welcome');
  });
});
```

## File Naming Convention

- **Test files:** `descriptiveName.test.js`
  - Examples: `login.test.js`, `checkout.test.js`, `userRegistration.test.js`
  
- **Test location:** Organize by feature or suite
  - `test/smoke/` - Fast, critical tests
  - `test/regression/` - Full test coverage
  - `test/feature-name/` - Feature-specific tests

## Running Your Tests

```bash
# Run specific test file
npm test test/yourTest.test.js

# Run all tests in a folder
npm run test:smoke
npm run test:amazon

# Run all tests
npm test
```

## Tips

1. **Start with the template** - It includes all necessary imports and structure
2. **Use descriptive test names** - `'should login with valid credentials'` not `'test1'`
3. **Add console.log statements** - Helps debug when tests fail
4. **Use `headed: true` during development** - See what the test is doing
5. **Switch to `headed: false` when done** - Faster execution
6. **Group related tests** - Use nested `describe()` blocks
7. **Keep test data at the top** - Easy to find and modify

## Common Patterns

### Handling Optional Elements
```javascript
try {
  await kc.KCClick({ locator: 'id', value: 'cookie-accept', timeout: 5000 });
} catch {
  console.log('[TEST] No cookie banner found');
}
```

### Waiting for Spinners to Disappear
```javascript
await kc.KCWait({ 
  locator: 'css', 
  value: '.loading-spinner', 
  waitUntilType: 'Disappeared',
  timeout: 20000 
});
```

### Verifying Multiple Elements
```javascript
const results = await kc.driver.findElements(By.css('.result-item'));
expect(results.length).to.be.greaterThan(0);
```

### Taking Screenshots on Failure
```javascript
after(async function () {
  if (this.currentTest && this.currentTest.state === 'failed') {
    const screenshot = await kc.driver.takeScreenshot();
    fs.writeFileSync(
      `reports/screenshots/${this.currentTest.title}.png`,
      screenshot,
      'base64'
    );
  }
  await kc.KCQuit();
});
```

## See Also

- **TEST_TEMPLATE.js** - Full template with detailed examples
- **SNIPPETS_AND_NAMED_PARAMETERS.md** - Complete API reference
- **test/smoke/login.test.js** - Real example
- **test/amazon/navigation.test.js** - Complex example

---

**Need help?** Check the existing test files for real-world examples!
