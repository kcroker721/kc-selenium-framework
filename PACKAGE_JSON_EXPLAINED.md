# Package.json Scripts - In-Depth Explanation

## 🤔 Your Question
"Why do we have `test:junit` and `test:html` instead of folder-based names like `test:ambulatory`?"

**Answer:** These scripts are named after **OUTPUT FORMATS** (how test results are reported), NOT folder names!

---

## 📦 Current Scripts Breakdown

### Script 1: `test`
```json
"test": "mocha \"test/**/*.test.js\""
```

**What it does:**
- Runs **ALL** test files in the `test/` folder
- `test/**/*.test.js` means: "Find any file ending in `.test.js` in any subfolder"
- Default Mocha reporter (terminal output)

**Files it runs:**
- ✅ `test/ui/amazonNav.test.js`
- ✅ `test/ui/sampleLogin.test.js`

**Usage:**
```bash
npm test
```

---

### Script 2: `test:junit`
```json
"test:junit": "mocha \"test/**/*.test.js\" --grep \"\\[AMAZON\\]\" --reporter mocha-junit-reporter --reporter-options mochaFile=reports/junit.xml,quiet=true 2>&1 | grep -v 'deprecation\\|npm WARN'"
```

**What it does - PART BY PART:**

#### 1. `mocha "test/**/*.test.js"`
- Runs all test files

#### 2. `--grep "\\[AMAZON\\]"`
- **FILTERS** tests to only run ones with `[AMAZON]` in the describe block
- This is a **text filter**, not a folder filter!
- In your `amazonNav.test.js`: `describe('[AMAZON] Amazon navigation smoke', ...)`

#### 3. `--reporter mocha-junit-reporter`
- Changes output format to **JUnit XML** (used by Jenkins/CI tools)
- JUnit format looks like:
  ```xml
  <testsuite name="tests" tests="3" failures="0">
    <testcase name="logs in successfully" time="1.5"/>
  </testsuite>
  ```

#### 4. `--reporter-options mochaFile=reports/junit.xml,quiet=true`
- **CREATES A FILE:** `reports/junit.xml` (this is where "junit" comes from!)
- `quiet=true` = suppress console noise

#### 5. `2>&1 | grep -v 'deprecation\\|npm WARN'`
- Filters out deprecation warnings

**Output:** Creates `reports/junit.xml` file

**Usage:**
```bash
npm run test:junit
```

---

### Script 3: `test:html`
```json
"test:html": "mocha \"test/**/*.test.js\" --grep \"\\[AMAZON\\]\" --reporter mochawesome --reporter-options reportDir=reports,reportFilename=kc-report,quiet=true"
```

**What it does - PART BY PART:**

#### 1-2. (Same as junit)
- Runs all tests, filters for `[AMAZON]`

#### 3. `--reporter mochawesome`
- Changes output format to **HTML** (beautiful web page report)
- Mochawesome creates interactive HTML reports with charts

#### 4. `--reporter-options reportDir=reports,reportFilename=kc-report`
- **CREATES FILES:** 
  - `reports/kc-report.html` (this is where "html" comes from!)
  - `reports/kc-report.json`
  - `reports/assets/` (CSS, JS for the HTML)

**Output:** Creates beautiful HTML report at `reports/kc-report.html`

**Usage:**
```bash
npm run test:html
```

---

## 🏢 Work Setup vs. This Setup

### **Your Work Setup (Folder-Based):**
```json
{
  "scripts": {
    "test:ambulatory": "mocha \"test/ambulatory/**/*.test.js\"",
    "test:inpatient": "mocha \"test/inpatient/**/*.test.js\"",
    "test:emergency": "mocha \"test/emergency/**/*.test.js\""
  }
}
```

**Purpose:** Run tests from **specific folders** (domain-based organization)

**Folder Structure:**
```
test/
├── ambulatory/
│   └── scheduling.test.js
├── inpatient/
│   └── admission.test.js
└── emergency/
    └── triage.test.js
```

**How it works:**
- `npm run test:ambulatory` → runs ONLY ambulatory tests
- Name comes from the **folder name**

---

### **This Setup (Reporter-Based):**
```json
{
  "scripts": {
    "test": "mocha \"test/**/*.test.js\"",
    "test:junit": "mocha ... --reporter mocha-junit-reporter",
    "test:html": "mocha ... --reporter mochawesome"
  }
}
```

**Purpose:** Run tests with **different output formats** (same tests, different reports)

**Folder Structure:**
```
test/
└── ui/
    ├── amazonNav.test.js
    └── sampleLogin.test.js
```

**How it works:**
- `npm run test:junit` → runs tests, outputs JUnit XML
- `npm run test:html` → runs tests, outputs HTML report
- Name comes from the **reporter type**

---

## 🔍 Key Differences

| Aspect | Work Setup | This Setup |
|--------|-----------|------------|
| **Name Based On** | Folder name | Reporter format |
| **Filters By** | File path | Tag in test name |
| **Purpose** | Organize by domain | Generate different reports |
| **Example** | `test:ambulatory` | `test:junit` |
| **Output** | Same format, different tests | Different formats, same tests |

---

## 📊 Visual Flow

### **This Setup:**
```
npm run test:junit
     ↓
Finds: test/**/*.test.js (ALL test files)
     ↓
Filters: --grep "\[AMAZON\]" (only [AMAZON] tagged tests)
     ↓
Runs: amazonNav.test.js (has [AMAZON] tag)
     ↓
Outputs: reports/junit.xml (JUnit format)
```

```
npm run test:html
     ↓
Finds: test/**/*.test.js (ALL test files)
     ↓
Filters: --grep "\[AMAZON\]" (only [AMAZON] tagged tests)
     ↓
Runs: amazonNav.test.js (has [AMAZON] tag)
     ↓
Outputs: reports/kc-report.html (HTML format)
```

---

## 🎯 Why Not Folder-Based Here?

Your project currently only has:
```
test/ui/
├── amazonNav.test.js    [AMAZON] tag
└── sampleLogin.test.js  [SMOKE] tag
```

**Two ways to organize:**

### **Option A: Tag-Based (Current)**
- Tests marked with `[AMAZON]`, `[SMOKE]` tags
- One folder, filter by tag
- Good for: Small projects, cross-cutting concerns

### **Option B: Folder-Based (Like Work)**
```
test/
├── amazon/
│   └── navigation.test.js
└── smoke/
    └── login.test.js
```

Scripts would be:
```json
"test:amazon": "mocha \"test/amazon/**/*.test.js\"",
"test:smoke": "mocha \"test/smoke/**/*.test.js\""
```

---

## 🚀 Converting to Work-Style (If You Want)

### **Step 1: Reorganize Folders**
```bash
mkdir -p test/amazon test/smoke
mv test/ui/amazonNav.test.js test/amazon/navigation.test.js
mv test/ui/sampleLogin.test.js test/smoke/login.test.js
rmdir test/ui
```

### **Step 2: Update package.json**
```json
{
  "scripts": {
    "test": "mocha \"test/**/*.test.js\"",
    "test:amazon": "mocha \"test/amazon/**/*.test.js\"",
    "test:smoke": "mocha \"test/smoke/**/*.test.js\"",
    "test:amazon:junit": "mocha \"test/amazon/**/*.test.js\" --reporter mocha-junit-reporter --reporter-options mochaFile=reports/junit.xml",
    "test:amazon:html": "mocha \"test/amazon/**/*.test.js\" --reporter mochawesome --reporter-options reportDir=reports,reportFilename=amazon-report"
  }
}
```

### **Step 3: Remove tags from tests**
```javascript
// Before
describe('[AMAZON] Amazon navigation smoke', ...)

// After (folder handles organization)
describe('Amazon navigation smoke', ...)
```

---

## 💡 Which Approach Is Better?

### **Tag-Based (Current):**
✅ Flexible - tests can have multiple tags: `[SMOKE][AMAZON]`  
✅ Simpler structure - fewer folders  
✅ Tests can span multiple categories  
❌ Tags must be maintained manually  
❌ Can't easily see organization in file tree  

### **Folder-Based (Work):**
✅ Visual organization in file explorer  
✅ Clear domain boundaries  
✅ Easier to find tests by category  
❌ Test can only be in one folder  
❌ More folders to manage  

**Recommendation:** For small projects → Tags. For large projects → Folders.

---

## 🎓 Summary

**Your scripts are NOT about folders. They're about:**

1. **`test`** → Run all tests, default output
2. **`test:junit`** → Run [AMAZON] tests, create **XML file** (for Jenkins)
3. **`test:html`** → Run [AMAZON] tests, create **HTML report** (for humans)

The `:junit` and `:html` suffixes refer to the **report format**, not folder names!

At work, `:ambulatory` refers to the **test folder**, not report format.

Both approaches are valid - just different organizing strategies! 🎯
