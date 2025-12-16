# 🚀 Named Parameters & VS Code Snippets Guide

## Overview

The KC Selenium Framework now supports **named parameters** for better code readability and IDE autocomplete. This guide explains the new syntax and available VS Code snippets.

---

## 📝 Named Parameters

### Why Named Parameters?

Named parameters make your tests more readable and self-documenting:

**Old Syntax (still works):**
```javascript
await kc.KCClick("id", "loginBtn");
await kc.KCType("css", "#username", "tomsmith");
await kc.KCWait("id", "productTitle", { timeout: 30000 });
```

**New Syntax (recommended):**
```javascript
await kc.KCClick({ locator: 'id', value: 'loginBtn' });
await kc.KCType({ locator: 'css', value: '#username', text: 'tomsmith' });
await kc.KCWait({ locator: 'id', value: 'productTitle', timeout: 30000 });
```

### Benefits

✅ **Clarity** - No guessing what each parameter means  
✅ **IDE Support** - Better autocomplete with named properties  
✅ **Options** - Easier to see timeout, contains, and other options  
✅ **Backward Compatible** - Old syntax still works  

---

## 🎯 Method Syntax Reference

### KCClick

**Named Parameters:**
```javascript
await kc.KCClick({ 
  locator: 'id',           // Required: 'id', 'css', 'xpath', 'button', 'span', etc.
  value: 'loginBtn',       // Required: element identifier or text
  timeout: 5000,           // Optional: custom timeout in ms (default: 10000)
  contains: true           // Optional: partial text match (for tag+text mode)
});
```

**Examples:**
```javascript
// Click by ID
await kc.KCClick({ locator: 'id', value: 'submit' });

// Click button by visible text
await kc.KCClick({ locator: 'button', value: 'Login' });

// Click with custom timeout
await kc.KCClick({ locator: 'css', value: '.submit-btn', timeout: 15000 });

// Click by partial text
await kc.KCClick({ locator: 'span', value: 'Hello', contains: true });
```

---

### KCType

**Named Parameters:**
```javascript
await kc.KCType({ 
  locator: 'id',           // Required: 'id', 'css', 'xpath', 'name', etc.
  value: 'username',       // Required: element identifier
  text: 'tomsmith',        // Required: text to type
  timeout: 5000            // Optional: custom timeout in ms (default: 10000)
});
```

**Examples:**
```javascript
// Type into input by ID
await kc.KCType({ locator: 'id', value: 'username', text: 'admin' });

// Type into CSS selector
await kc.KCType({ locator: 'css', value: '#password', text: 'secret123' });

// Type with custom timeout
await kc.KCType({ 
  locator: 'name', 
  value: 'email', 
  text: 'user@example.com',
  timeout: 15000 
});
```

---

### KCWait

**Named Parameters:**
```javascript
await kc.KCWait({ 
  locator: 'id',                    // Required: 'id', 'css', 'xpath', etc.
  value: 'productTitle',            // Required: element identifier or text
  timeout: 30000,                   // Optional: custom timeout (default: 10000)
  waitUntilType: 'Appeared',        // Optional: 'Appeared', 'Disappeared', 'Stale'
  waitUntilStale: false,            // Optional: alias for waitUntilType: 'Stale'
  contains: true                    // Optional: partial text match
});
```

**Examples:**
```javascript
// Wait for element to appear
await kc.KCWait({ locator: 'id', value: 'productTitle' });

// Wait for spinner to disappear
await kc.KCWait({ 
  locator: 'css', 
  value: '.spinner', 
  waitUntilType: 'Disappeared',
  timeout: 20000 
});

// Wait for element to become stale (re-rendered)
await kc.KCWait({ 
  locator: 'span', 
  value: 'Saving...', 
  waitUntilStale: true 
});

// Wait with long timeout
await kc.KCWait({ 
  locator: 'css', 
  value: 'div.s-main-slot', 
  timeout: 30000 
});
```

---

## 💡 VS Code Snippets

### Main Snippets (Named Parameters)

| Trigger | Expands To | Description |
|---------|------------|-------------|
| `kcclick` | `await kc.KCClick({ locator: 'id', value: '' });` | Click element |
| `kctype` | `await kc.KCType({ locator: 'id', value: '', text: '' });` | Type text |
| `kcwait` | `await kc.KCWait({ locator: 'id', value: '' });` | Wait for element |
| `kcgoto` | `await kc.KCGoTo('');` | Navigate to URL |

### Special Use Cases

| Trigger | Expands To | Description |
|---------|------------|-------------|
| `kcwaitdisappear` | `await kc.KCWait({ locator: 'css', value: '', waitUntilType: 'Disappeared' });` | Wait for disappear |
| `kcclicktimeout` | `await kc.KCClick({ locator: 'id', value: '', timeout: 5000 });` | Click with timeout |
| `kctypetimeout` | `await kc.KCType({ locator: 'id', value: '', text: '', timeout: 5000 });` | Type with timeout |
| `kctry` | `try { await kc.KCClick({...}); } catch { ... }` | Try-catch for optional elements |

### Old Syntax (Still Supported)

| Trigger | Expands To | Description |
|---------|------------|-------------|
| `kcclickold` | `await kc.KCClick('id', '');` | Click (old syntax) |
| `kctypeold` | `await kc.KCType('id', '', '');` | Type (old syntax) |
| `kcwaitold` | `await kc.KCWait('id', '');` | Wait (old syntax) |

### Test Structure Snippets

| Trigger | Expands To | Description |
|---------|------------|-------------|
| `kcdescribe` | Full Mocha describe block with setup/teardown | Complete test structure |
| `kcit` | `it('...', async () => { });` | Test case block |
| `kcexpect` | `expect(...).to.equal(...);` | Chai assertion |

### Driver Management

| Trigger | Expands To | Description |
|---------|------------|-------------|
| `kcbuild` | `const kc = await KCDriver.build();` | Build driver instance |
| `kcbuildheaded` | `const kc = await KCDriver.build({ headed: true });` | Build headed mode |
| `kcquit` | `await kc.KCQuit();` | Close browser |

### Utility Snippets

| Trigger | Expands To | Description |
|---------|------------|-------------|
| `kcfindvisible` | `const el = await kc.KCFindVisible(By.id(''));` | Find visible element |
| `kcwaitclickable` | `const el = await kc.KCWaitClickable(By.id(''));` | Wait clickable |
| `kcgettext` | `const text = await element.getText();` | Get element text |
| `kcscreenshot` | Take and save screenshot | Save screenshot |
| `kclog` | `console.log('[TEST] ');` | Log test step |

---

## 🎨 How to Use Snippets

### Step-by-Step

1. **Start typing** the snippet trigger (e.g., `kcclick`)
2. **Press Tab or Enter** to expand the snippet
3. **Choose from dropdown** for locator types (id, css, xpath, etc.)
4. **Press Tab** to jump between placeholders
5. **Fill in values** for each parameter

### Example Flow

```
Type: kcclick + Tab
      ↓
await kc.KCClick({ locator: '|id|', value: '' });
                            ↑ (dropdown appears)
      ↓ (select 'id' and press Tab)
await kc.KCClick({ locator: 'id', value: '|cursor here|' });
                                          ↑ (type your value)
      ↓ (press Tab again for options)
await kc.KCClick({ locator: 'id', value: 'loginBtn'|cursor here| });
```

### Dropdown Choices

Snippets include smart dropdowns for common locator types:

- **kcclick**: id, css, xpath, button, span, a
- **kctype**: id, css, xpath, name
- **kcwait**: id, css, xpath, button, span, h1

---

## 📊 Migration Guide

### When to Use Named Parameters

✅ **Use named parameters when:**
- Writing new tests
- Code readability is important
- You need to pass options (timeout, contains, etc.)
- Working with a team (self-documenting code)

⚠️ **Old syntax is fine for:**
- Existing tests (no need to refactor)
- Quick one-off scripts
- Simple cases without options

### Migration Examples

**Before:**
```javascript
await kc.KCClick("id", "submit");
await kc.KCType("css", "#username", "admin");
await kc.KCWait("id", "loading", { timeout: 5000 });
```

**After:**
```javascript
await kc.KCClick({ locator: 'id', value: 'submit' });
await kc.KCType({ locator: 'css', value: '#username', text: 'admin' });
await kc.KCWait({ locator: 'id', value: 'loading', timeout: 5000 });
```

---

## 🧪 Real-World Examples

### Example 1: Login Flow (from signOn.js)

```javascript
module.exports = async function signOn(kc) {
  await kc.KCGoTo(`${env.baseUrl}/login`);

  // Clear and self-documenting
  await kc.KCType({ locator: 'css', value: '#username', text: env.username });
  await kc.KCType({ locator: 'css', value: '#password', text: env.password });
  await kc.KCClick({ locator: 'button', value: 'Login' });
};
```

### Example 2: Amazon Search (from navigation.test.js)

```javascript
// Wait for search box, type search term, click search button
await kc.KCWait({ locator: 'id', value: 'twotabsearchtextbox' });
await kc.KCType({ 
  locator: 'id', 
  value: 'twotabsearchtextbox', 
  text: SEARCH_TEXT 
});
await kc.KCClick({ locator: 'id', value: 'nav-search-submit-button' });

// Wait for results with custom timeout
await kc.KCWait({ 
  locator: 'css', 
  value: 'div.s-main-slot', 
  timeout: 30000 
});
```

### Example 3: Handling Optional Elements

```javascript
// Try to accept cookie consent banner (optional)
try {
  await kc.KCClick({ 
    locator: 'id', 
    value: 'sp-cc-accept', 
    timeout: 5000 
  });
  console.log('[TEST] Cookie consent accepted');
} catch {
  console.log('[TEST] No cookie banner (continuing)');
}
```

### Example 4: Waiting for Spinners

```javascript
// Wait for spinner to disappear before continuing
await kc.KCWait({ 
  locator: 'css', 
  value: '.loading-spinner', 
  waitUntilType: 'Disappeared',
  timeout: 20000 
});
```

---

## 🔍 Locator Types Reference

| Locator Type | Example Value | Use Case |
|--------------|---------------|----------|
| `id` | `'loginBtn'` | Elements with unique IDs |
| `css` | `'#submit'`, `'.btn-primary'` | CSS selectors |
| `xpath` | `'//div[@role="button"]'` | Complex DOM queries |
| `name` | `'username'` | Form input names |
| `button` | `'Login'` | Button visible text |
| `span` | `'Hello, world'` | Span visible text |
| `a` | `'Click here'` | Link visible text |
| `h1` | `'Dashboard'` | Heading visible text |
| `className` | `'submit-button'` | CSS class names |
| `linkText` | `'Sign Up'` | Exact link text |
| `partialLinkText` | `'Sign'` | Partial link text |

---

## 💻 Snippet Configuration File

Snippets are defined in `.vscode/kc-selenium.code-snippets`. You can:

- **View all snippets**: Open the file in VS Code
- **Customize snippets**: Edit the file to add your own
- **Share with team**: Commit the file to your repo

---

## ❓ FAQ

### Can I mix old and new syntax?

Yes! Both syntaxes work in the same file:

```javascript
await kc.KCClick("id", "oldWay");  // Still works
await kc.KCClick({ locator: 'id', value: 'newWay' });  // Also works
```

### Do I need to update existing tests?

No! The old syntax is fully supported. Update when:
- You're already modifying the test
- You want better readability
- You're adding new tests

### Which syntax should I use?

**New syntax** is recommended for:
- New code
- Team projects (better clarity)
- When using options

**Old syntax** is fine for:
- Existing code that works
- Personal scripts
- Simple cases

### How do I disable snippets?

Delete or rename `.vscode/kc-selenium.code-snippets`

---

## 🎓 Best Practices

1. **Use named parameters for new tests** - More readable and maintainable
2. **Use snippets to speed up coding** - Type `kcclick` instead of full syntax
3. **Add comments for complex logic** - Even with named params
4. **Use timeout option for slow elements** - Makes waits explicit
5. **Group related actions** - Use comments to separate test steps

---

## 📚 Additional Resources

- **KCDriver.js** - Full implementation with JSDoc comments
- **test/amazon/navigation.test.js** - Real-world example using named params
- **src/flows/signOn.js** - Login flow example
- **VS Code Snippets Docs** - [code.visualstudio.com/docs/editor/userdefinedsnippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

---

**Happy Testing! 🚀**
