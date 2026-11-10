# Salesforce Playwright Automation

End-to-end Playwright (TypeScript) flow that ports the Tricentis Tosca test case:

> Login to Salesforce → create a new **Person Account** → verify the Account details →
> log a call → create a follow-up task (due = today + 3 days) → log out.

## Structure

```
Salesforce_Playwright_Automation/
├─ playwright.config.ts        # Chrome channel, timeouts, tracing/screenshots on failure
├─ src/
│  ├─ config/env.ts            # reads .env (URL, credentials, headless)
│  ├─ utils/dateUtils.ts       # date +3 days, MM/DD/YYYY, regex escaping
│  └─ pages/                   # Page Objects
│     ├─ LoginPage.ts
│     ├─ HomePage.ts           # App Launcher, profile + Log Out
│     ├─ AccountsPage.ts       # New + Person Account record type
│     └─ AccountRecordPage.ts  # field entry, save, verify, Log a Call, follow-up task
├─ tests/
│  └─ salesforce-person-account.spec.ts   # one test.step per Tosca step
├─ plan.md                     # design notes + Tosca→code mapping
├─ .env.example                # copy to .env
└─ .env                        # real credentials (git-ignored)
```

## Setup

```bash
cd Salesforce_Playwright_Automation
npm install --include=dev          # devDependencies are required
npx playwright install chromium    # bundled browser, no admin needed
cp .env.example .env               # then fill in SF_USERNAME / SF_PASSWORD
```

> To drive a real, system-installed **Google Chrome** instead, install it
> (`npx playwright install chrome`, may need an elevated shell) and use
> `npm run test:chrome`. Otherwise the default `chromium` project runs a
> Chrome build bundled by Playwright.

`.env` keys:

```
SF_BASE_URL=https://<org>.lightning.force.com/one/one.app
SF_USERNAME=<salesforce-username>
SF_PASSWORD=<salesforce-password>
HEADLESS=true
```

## Run

```bash
npm test                 # headless (bundled Chromium)
npm run test:headed      # headed, watch it run
npm run test:chrome      # headed, real Google Chrome (needs `playwright install chrome`)
npm run report           # open the HTML report
npm run typecheck        # tsc --noEmit
```

## Notes

- Two projects are defined: `chromium` (bundled, default) and `Google Chrome`
  (`channel: 'chrome'`, real installed Chrome). Both run the same spec.
- **First run needs MFA**: run `npm run test:headed`, enter the SMS code in the browser,
  and the session is cached to `.auth/salesforce.json`; later runs reuse it (headless OK).
  Supply `SF_VERIFICATION_CODE` to skip manual entry.
- Credentials live only in `.env` (git-ignored); `.env.example` carries placeholders.
- Lightning selectors are role/label based with fallbacks. If an org-specific locator
  drifts, update the single Page Object that owns it.
- Org-specific behaviours discovered and handled: App Launcher flakiness (direct-URL
  fallback), `*`-prefixed required labels, DD/MM/YYYY date entry, and the follow-up task's
  Status/Priority/Comments living only on the full Task record page (see `plan.md`).
- Traces, screenshots and video are captured on failure under `test-results/`.
