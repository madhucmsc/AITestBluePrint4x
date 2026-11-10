# Plan — Salesforce Login Automation Framework (Selenium + Java + Maven + TestNG)

## Source & Requirements

Prompt source: `Chapter_02_Prompt_Eng/01_RICE_Pot_Template.md` (RICE-POT filled example).

The RICE-POT prompt asks for an **enterprise-grade Selenium + Java + Maven + TestNG**
framework that automates and verifies **login.salesforce.com** with valid and invalid
test cases, using:

- **Mandatory** Page Object Model with PageFactory, `@FindBy`, constructor init,
  reusable action methods.
- **Mandatory** XPath-only locators — no CSS selectors, no `id`/`name`/other direct
  attributes as the sole strategy where it can be avoided (robust relative XPath).
- **Critical** TestNG annotations (`@Test`, `@BeforeTest`, `@AfterTest`) with
  setup/teardown.
- **Critical** Robust exception handling in the POM and test scripts (try–catch /
  explicit signatures), never swallowing errors silently.
- **No** `Thread.sleep()` anywhere; rely on `WebDriverWait` / implicit waits.
- **Output** runnable code only, no filler explanations, consistent structure.
- Credentials and URLs come from external/property sources (user supplies valid and
  invalid login credentials for external/staging URLs).

## Goal

Restore and complete the existing framework under `RICE_POT_Framework/` so it is
runnable, compiles with Maven, and covers both valid and invalid login paths for the
Salesforce login page — with the framework files reviewed and improved against the
RICE-POT "enterprise standards" constraints, plus the missing project glue restored.

## Repository Context (State Before This Work)

- `RICE_POT_Framework/` already contains initial-commit source:
  - `pom.xml` — Selenium 4.11.0, WebDriverManager 5.5.1, TestNG 7.8.0, slf4j-simple,
    Java 11, surefire wired to `testng.xml`.
  - `company/base/BaseTest.java` — `@BeforeTest` / `@AfterTest` driver lifecycle,
    implicit wait 10s, explicit `WebDriverWait` 20s, loads `baseUrl` from a system
    property with a `login.salesforce.com` default.
  - `company/pages/LoginPage.java` — PageFactory login POM with XPath locators.
  - `company/utils/DriverFactory.java` — WebDriverManager + Chrome, `ThreadLocal`.
  - `src/test/java/com/company/tests/ValidLoginTest.java` — valid credential test.
  - `src/test/java/com/company/tests/InvalidLoginTest.java` — invalid credential test.
- **Deleted / missing from the working tree** (present in initial commit, unstaged
  deletions):
  - `testng.xml` — the TestNG suite XML referenced by surefire.
  - `README.md` — repo overview / run instructions.
  - `Chapter_02_Prompt_Eng/04_Plan_Framework.md` — the framework plan placeholder.
- The working tree also has unrelated modified files (`.commandcode/taste/taste.md`,
  `.github/skills/testplan- generator/*`) — **leave untouched**.

## Plan

### Step 1 — Review existing framework code against RICE-POT constraints

- Read each existing source file under `RICE_POT_Framework/`.
- Identify deviations from the prompt:
  - Any CSS / non-XPath locators.
  - Any `Thread.sleep`, over-broad empty catches, or swallowing exceptions.
  - Test structure that does not clearly separate valid vs invalid cases or does not
    assert expected results.
  - POM actions that are not reusable or not robustly waited on.
- Capture a short gap list (no code changes yet).

### Step 2 — Refactor / harden the framework code (only what the gaps require)

- `company/pages/LoginPage.java`
  - Keep PageFactory + `@FindBy` + constructor `PageFactory.initElements(driver, this)`.
  - Ensure all locators are **XPath-only** and robust against layout shifts:
    username / password / login button / remember-me / error message.
  - Replace brittle mega-XPath where present with readable, precise XPath.
  - Add reusable action methods: `enterUsername`, `enterPassword`,
    `toggleRememberMe`, `clickLogin`, and a composed `login(...)` returning success.
  - Structured `try–catch` in each action; wrap failures with meaningful context
    (never empty catch that hides real issues).
  - Use explicit `WebDriverWait` (no `Thread.sleep`).
- `company/base/BaseTest.java`
  - Keep `@BeforeTest` (driver + waits + URL) and `@AfterTest` (clean quit) with
    exception-safe teardown.
  - Read URL / credentials from system properties with safe defaults.
- `company/utils/DriverFactory.java`
  - Keep local Chrome via WebDriverManager + `ThreadLocal` for parallel-safe runs.
- `src/test/java/com/company/tests/ValidLoginTest.java` and
  `InvalidLoginTest.java`
  - Keep one test class per case per the prompt.
  - Assert the intended outcome explicitly (success navigates off login page; invalid
    login stays and shows the Salesforce error message).
  - Wrap test body with structured exception handling.
- Preserve package structure and existing naming conventions.

### Step 3 — Restore the missing TestNG suite and config

- Restore `testng.xml` (deleted from working tree) at the repo root, wiring both test
  classes under one suite, with parameters for `baseUrl`, `username`, `password`,
  `invalidUsername`, `invalidPassword`.

### Step 4 — Verify compile + run (local Chrome)

- Run `mvn test-compile` (or `mvn test -DskipTests` style check) to confirm everything
  compiles with the existing pom (Java 11, Selenium 4, TestNG 7.8).
- If a local Chrome + credentials are available, run the suite; otherwise stop at a
  successful compile and provide the run command.

### Step 5 — Write / update repo docs

- Restore `README.md` at repo root with:
  - Project purpose and structure.
  - Framework stack (Java, Selenium, Maven, TestNG, WebDriverManager).
  - How to run: `mvn test -Dusername=... -Dpassword=... -DinvalidUsername=... -DinvalidPassword=...`
  - Note that credentials are supplied externally; `baseUrl` defaults to
    `https://login.salesforce.com/?locale=in`.
- Keep the completed plan in `Chapter_02_Prompt_Eng/04_Plan_Framework.md`.

### Step 6 — Commit (project convention)

- Commit the new/changed work under the framework scope (per repo convention: commits
  grouped by project subfolder) and push to the GitHub remote (my repo).
- Suggested message: `Add Salesforce login Selenium framework plan and restore suite/docs`.
- Do not bundle unrelated working-tree changes (`.commandcode/taste`, `.github/skills`).

## Test Scenarios to Automate

| ID | Scenario | Input | Expected |
|----|----------|-------|----------|
| L1 | Valid login | Valid username + valid password | Navigates away from login page (success) |
| L2 | Invalid login | Invalid username + invalid password | Stays on login page, error message visible |
| L3 | (POM coverage) Remember-me toggle | Valid/any creds, toggle state | Checkbox state toggles without error |

Optional extension (only if needed): empty-field validation, wrong-password-only, or
username-only cases as additional `@Test` methods — but the prompt explicitly asks for
**2 scripts** (valid + invalid), so keep the core suite to those two test classes.

## Risks & Assumptions

- Assumption: run locally on Chrome via WebDriverManager (per decision).
- Credentials are NOT committed; they are passed at runtime via `-D` system properties.
- Salesforce may present a verification challenge (CAPTCHA / "Verify Your Identity")
  for valid-credential runs from new locations; the invalid-login path is the reliable
  assertion on shared environments. The POM's error/verification locator should be
  tolerant enough to treat the presence of a verification/error state as "did not
  fully log in" when asserting on the invalid case.
- Live Salesforce DOM changes over time; XPath locators may need periodic updates.
- Deleted files (`testng.xml`, `README.md`) are restored as part of this plan.

## Deliverables

- `Chapter_02_Prompt_Eng/04_Plan_Framework.md` (this plan).
- Refactored/hardened source under `RICE_POT_Framework/` (POM, BaseTest,
  DriverFactory, 2 TestNG tests) satisfying the RICE-POT constraints.
- Restored `testng.xml` suite file.
- Restored `README.md` with framework usage.
- Commit + push per repo convention.
