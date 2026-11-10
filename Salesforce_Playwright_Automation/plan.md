# Plan — Salesforce Lightning Person Account (Playwright)

Port of the Tricentis Tosca test case "Login, create Person Account, verify details,
log a call, create a follow-up task, log out" into a Playwright + TypeScript flow.

## Why Playwright (and not Selenium like `RICE_POT_Framework`)

- Playwright bundles its own browsers, ships auto-waiting locators, and has first-class
  tracing/screenshots/video on failure — a better fit for the fast-changing Lightning DOM.
- TypeScript gives the same typed, page-object style already used by the Java/Selenium
  `RICE_POT_Framework`, so the mental model carries over.

## Approach

1. **Config over code** — URL, credentials and headless mode come from `.env`
   (`src/config/env.ts`). No secrets in source; `.env` is git-ignored and `.env.example`
   documents the keys.
2. **Page Object Model** — one class per screen (`LoginPage`, `HomePage`, `AccountsPage`,
   `AccountRecordPage`) so selectors live in one place.
3. **Resilient Lightning locators** — role/label/placeholder based (`getByRole`,
   `getByLabel`) with fallbacks, plus a `picklist()` helper that transparently handles both
   native `<select>` and LWC `lightning-combobox`.
4. **One spec, one `test.step` per Tosca step** — the test body reads as the test case,
   so failures map straight back to the Tosca step that broke.
5. **Dynamic due date** — `currentDatePlusDays(3)` formatted `MM/DD/YYYY` for the follow-up
   task, verified back on the record timeline.

## Tosca step → implementation map

| Tosca step | Playwright |
|---|---|
| 1. Launch Chrome | `project` uses `channel: 'chrome'` |
| 2. Navigate to Lightning URL | `LoginPage.goto(env.baseUrl)` |
| 3-5. Username/password/Log In | `LoginPage.login()` (handles 1-step and 2-step login) |
| 6. Verify Lightning loaded | `HomePage.expectLoaded()` (waits for App Launcher) |
| 7. App Launcher → Accounts | `HomePage.openApp('Accounts', '/lightning/o/Account/list')` |
| 8. New → Person Account → Next | `AccountsPage.clickNew()` + `selectPersonAccountRecordType()` |
| 9. Enter account details | `AccountRecordPage.fillText/selectPicklist` |
| 10. Save | `AccountRecordPage.save()` |
| 11. Verify created | `AccountRecordPage.expectRecordLoaded()` |
| 12. Verify saved values | `AccountRecordPage.expectFieldValue()` per field |
| 13-20. Log a Call + verify | `AccountRecordPage.logCallAndCreateFollowUp()` + `expectCallLogged()` |
| 18-19. Follow-up due date + save | `AccountRecordPage.saveFollowUpTask()` |
| 21-26. Open task, set Subject/Status/Priority/Comments | `openFollowUpTask()` + `setFollowUpTaskDetails()` |
| 27. Verify follow-up task values | `AccountRecordPage.expectTaskDetails()` |
| 23-25. Log out + verify | `HomePage.logout()` then assert login field returns |

## Assumptions / notes (verified against the live org)

- **Identity verification (MFA)**: the org enforces SMS OTP. The first run must be headed and
  the code entered manually (`SF_VERIFICATION_CODE` can supply it instead). On success the
  session is saved to `.auth/salesforce.json` and reused — later runs skip login/MFA.
- **App Launcher**: the waffle search input re-renders/flakes; `openApp()` waits for the shell
  to settle and falls back to direct navigation (`/lightning/o/Account/list`).
- **Record type picker** is not a `dialog` role — it's detected via the `Next` button; the
  Person Account radio is selected through its `<label>` (styled input intercepts clicks).
- **Field matching**: required labels carry a `*` prefix (e.g. `*Last Name`) and numeric
  fields are `spinbutton`s, so `fillText` matches `^\*?\s*Label$` rather than exact text.
- **Date format**: the due date field takes **DD/MM/YYYY** (hint `Format: 31/12/2024`) while
  the record page *displays* MM/DD/YYYY; verification accepts either ordering.
- **Follow-up task**: the Activity "New Task" / "Create Follow-Up Task" composer only exposes
  Subject/Due Date/Assigned To/Name/Related To — **Status, Priority and Comments are not on
  that layout**. So the call + follow-up are created from the Log a Call composer (which links
  Name/Related To automatically), then the task is opened from the timeline link and the extra
  fields are set via the record page's **inline edit** ("Edit Status" opens the whole section).
  The task link href is `/lightning/r/00T…/view` (no `/Task/` segment), so it's resolved by the
  timeline entry, not the URL. Salesforce requires **Subject** on that edit form, so it's set
  there too (`Call`).
- **Verification** asserts against the record Details tab / activity timeline text, and the
  task record page for the follow-up fields.

## Run

See `README.md`. Short version: `npm install --include=dev` →
`npx playwright install chromium` → `npm run test:headed` (first run, for MFA) →
`npm test` afterwards. The `Google Chrome` project (`npm run test:chrome`) targets a real
system Chrome when one is installed.
