# Changelog

## [Unreleased] — 2026-03-05

### Refactor — Notification system

Extracted all email and WhatsApp notification logic out of controllers and console commands into dedicated, reusable layers.

**New files**
- `app/Services/OrderNotificationService.php` — central dispatcher; calls the right job for each event
- `app/Jobs/SendOrderConfirmationJob.php` — sends welcome email + WhatsApp on order creation, sets `order_confirmation = true`
- `app/Jobs/SendOrderExpiryNotificationJob.php` — sends expiry email + WhatsApp reminder, sets `order_remember = true`
- `app/Jobs/SendBirthdayWishJob.php` — sends birthday wish email

**Changed files**
- `app/Services/MessageService.php` — now reads config from `config/services.php` instead of `env()` directly; extracted a private `post()` helper to avoid duplicating HTTP logic; added `sendMedia()` and `sendAudio()` methods; `instance` name moved to config
- `app/Http/Controllers/OrderController.php` — removed inline `sendMessage()` / `sendMessageRemember()` private methods; now delegates to `OrderNotificationService` via constructor injection
- `app/Console/Commands/SendOrderExpireDateMail.php` — removed inline `sendMessage()` method; now delegates to `OrderNotificationService`
- `app/Console/Commands/SendBirthdayWishes.php` — now dispatches `SendBirthdayWishJob` instead of sending mail inline; fixed `Mail::send()` missing `to()` bug
- `config/services.php` — added `message_service` block (`url`, `api_key`, `instance`)
- `.env.example` — added `MESSAGE_SERVICE_URL`, `MESSAGE_SERVICE_API_KEY`, `MESSAGE_SERVICE_INSTANCE`

---

### Migration — SQLite to PostgreSQL

Replaced the SQLite database with PostgreSQL 16.

**Changed files**
- `docker-compose.yml` — replaced `mysql:8.0` service with `postgres:16`; updated healthcheck
- `app.dockerfile` — replaced `pdo_mysql` extension with `pdo_pgsql`; added `libpq-dev` system dependency
- `.env.example` — updated `DB_CONNECTION`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` for PostgreSQL
- `database/migrations/2025_03_31_045157_order.php` — fixed `->default('false')` → `->default(false)` on both boolean columns (`order_confirmation`, `order_remember`); SQLite accepted strings silently but PostgreSQL enforces strict boolean types
- `app/Services/OrderNotificationService.php` — fixed `= 'true'` → `= true` on boolean field assignments
- `app/Console/Commands/SendOrderExpireDateMail.php` — fixed `where('order_remember', 'false')` → `where('order_remember', false)`

---

### Refactor — Queue-based notifications

All notifications are now dispatched asynchronously via Laravel queues instead of being sent synchronously inside the HTTP request cycle.

**Why:** Sending emails and WhatsApp messages synchronously blocked the HTTP response and caused timeouts if the external API was slow or down.

**Changed files**
- `app/Services/OrderNotificationService.php` — methods now call `Job::dispatch()` instead of sending directly
- `app/Console/Commands/SendBirthdayWishes.php` — dispatches `SendBirthdayWishJob` per order
- `app/Console/Commands/SendOrderExpireDateMail.php` — output message updated from "sent" to "queued"

All 3 jobs implement `ShouldQueue` with `$tries = 3` and `$backoff = 30` seconds.

---

### Security — Vulnerability fixes

Full security audit was performed. The following issues were found and fixed.

#### Critical

| Issue | Fix |
|-------|-----|
| Excel upload accepted any file type | Added `mimes:xlsx,xls,csv\|max:5120` validation to `bulkCreate` |
| Excel cells with `=`, `+`, `-`, `@` could inject spreadsheet formulas | All cell values are now sanitized with `ltrim($value, '=+-@\|%')` before being saved |

#### High

| Issue | Fix |
|-------|-----|
| All controllers used `$request->all()` directly in `create()` / `update()` — mass assignment with no validation | Created `FormRequest` classes for every store/update operation; controllers now use `$request->validated()` |
| Any authenticated user could read, update or delete any resource — no authorization checks | Added `AdminMiddleware`; write/delete operations on lenses, terms, and order deletion are now admin-only |

#### Medium

| Issue | Fix |
|-------|-----|
| `POST /register` was a public endpoint — anyone could create accounts | Moved `register` route inside the `AdminMiddleware` group |
| `MESSAGE_SERVICE_API_KEY` had a hardcoded fallback `'mude-me'` | Removed fallback; app will throw a configuration error if the key is missing |
| `Mail::send(new ...)` was called without `Mail::to()` in two commands — emails had no recipient | Fixed to `Mail::to($email)->send(new ...)` |

#### Low

| Issue | Fix |
|-------|-----|
| Typo `customer_bithdate` in `SendBirthdayWishes` — birthday emails never fired | Fixed to `customer_birthdate` |
| `$this->instance` interpolated directly into URLs without encoding | All 4 URL segments now use `rawurlencode($this->instance)` |

**New files**
- `app/Http/Middleware/AdminMiddleware.php` — checks `in_array('admin', $user->roles)`
- `app/Http/Requests/StoreOrderRequest.php`
- `app/Http/Requests/UpdateOrderRequest.php`
- `app/Http/Requests/StoreLensRequest.php`
- `app/Http/Requests/UpdateLensRequest.php`
- `app/Http/Requests/StoreTermsRequest.php`
- `app/Http/Requests/UpdateTermsRequest.php`

**Changed files**
- `bootstrap/app.php` — registered `jwt` and `admin` middleware aliases
- `routes/api.php` — restructured into public, authenticated, and admin groups
- `config/services.php` — removed insecure default API key fallback
