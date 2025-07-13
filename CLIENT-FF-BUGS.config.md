Let's break down your issues and next steps:

---

## 1. **NS_ERROR_FAILURE on Initial Page Load (Firefox, TanStack QueryClient)**

- **What it means:**
  `NS_ERROR_FAILURE` is a generic Firefox error, often related to network, storage, or browser APIs.
  The stack trace points to `@tanstack/react-query-persist-client` and `PersistQueryClientProvider`.

- **Possible causes:**
  - **IndexedDB/LocalStorage** is not available, blocked, or failing in Firefox (sometimes due to privacy settings, incognito mode, or extensions).
  - The persist client is trying to restore state and fails.
  - The error is not fatal in Chrome, but Firefox is stricter.

- **What to try:**
  1. **Check Firefox privacy settings:**
     - Go to `about:preferences#privacy` and ensure "Cookies and Site Data" and "History" are not set to "Never remember".
     - Try in a regular window (not private/incognito).
  2. **Clear site data:**
     - Open DevTools → Storage → Clear all site data for localhost.
  3. **Check for extensions:**
     - Disable privacy/ad-blocking extensions and retry.
  4. **Update TanStack Query and persist client:**
     - Make sure you are using the latest versions.
  5. **Add error handling to the persist client:**
     - Wrap the `PersistQueryClientProvider` in an error boundary or add a try/catch to the storage logic if possible.

---

## 2. **Error Boundary on Button Click (with more errors in console)**

- **What it means:**
  Clicking a button triggers a React error boundary, indicating an unhandled exception in your component tree.

- **What to check:**
  1. **Look at the error message and stack trace:**
     - The screenshot shows the error is in `AdminTotalDialog.utils.tsx` (for the admin dialog), but your current page is `MainPage.tsx`.
     - Are you sure the error is not from a modal/dialog that opens on button click?
  2. **Check for state or context issues:**
     - If you use context providers (like OrdersProvider, SessionProvider, QueryClientProvider), make sure they are not returning `undefined` or throwing.
  3. **Check for missing/undefined data:**
     - If your button click handler expects certain data (e.g., a session, order, or config), make sure it exists.
  4. **Check for async issues:**
     - If you use TanStack Query, make sure queries are not in an error state or returning undefined.

---

## 3. **General Debugging Steps**

- **Reproduce in Chrome:**
  - If the error does NOT occur in Chrome, it's likely a browser API or storage issue.
- **Add try/catch and error boundaries:**
  - Wrap your main providers and button handlers in try/catch to log more details.
- **Check for browser-specific code:**
  - Are you using any browser APIs (e.g., localStorage, IndexedDB, Notification) directly?
- **Update dependencies:**
  - Make sure all your packages are up to date, especially TanStack Query and its persist plugins.

---

## 4. **What to Do Next**

- **For the NS_ERROR_FAILURE:**
  - Try the privacy/storage steps above.
  - If you use `PersistQueryClientProvider`, try disabling it temporarily to see if the error goes away.
  - Add a fallback or error handler to the persist client.

- **For the error boundary on click:**
  - Check the stack trace for the exact error message and line.
  - Add logging to your button click handler and any context providers.
  - Make sure all required data is present before rendering or acting.

---

## 5. **If You Want Deeper Help**

- Please copy the **full error message** and **stack trace** from the console (not just the screenshot).
- Let me know if you use any custom storage logic or browser APIs in your providers.
- If you can, try running with all persistence disabled and see if the error persists.

---

**Summary Table:**

| Issue                | Most Likely Cause                | What to Try First                |
|----------------------|----------------------------------|----------------------------------|
| NS_ERROR_FAILURE     | Storage/IndexedDB/Privacy        | Check privacy settings, clear data, update deps |
| Error on click       | Unhandled exception in handler   | Check stack trace, add logging, check context/data |

---

Let me know if you want to try disabling the persist client, or if you can share the full error message for the button click!
