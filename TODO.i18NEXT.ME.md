# 👨🏻‍💻 ME - TODOs for i18n TRAMSLATIONS

📅 Dec 19, 2025

GPT future suggestions:

- namespsace versioning
- versioning rollback
- server caching
- cache per locale
- aligning i18next + inlang roles cleanly
-

- i18next paackage
  - move json files outside of src/ into data/ (??) translations/ (better)
  - translations/ has folders app, admin, ui... even product
  - src/ just for utils, types, scehmas, configs, scripts (db + other), etc..

- make `products` db VIEW ?? aggregate all entities into single readable view

---

# 🤖 GPT

## 🟢 Your server logic is GOOD

This part is solid:

- Dot-key expansion ✅
- Namespace filtering ✅
- JSON translations column ✅
- SQLite-safe design ✅

You **do not** need to:

- Pre-fetch translations
- Inject them manually
- Re-init i18next after load

Let HttpBackend do its job.

---

## ✅ Final checklist (do these in order)

1. ❌ Remove `ui` and `time` from `resources`
2. ✅ Keep only `translation` preloaded
3. ✅ Ensure `/api/i18n/:namespace` is actually mounted
4. 🔄 Reload page
5. 👀 Watch Network tab
6. 🎉 Watch server logs light up

---

If you want, next we can:

- Add **hot reload after CMS save**
- Add **server-side caching**
- Add **namespace versioning**
- Or wire this cleanly into `packages/i18n`

You’re *very* close — this is a configuration trap, not an architectural flaw.
