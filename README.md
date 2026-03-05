# Eye Center — API

Laravel REST API for managing contact lens orders, customer notifications, and clinic operations.

---

## Stack

- **PHP 8.3** / Laravel 11
- **PostgreSQL 16** (migrated from SQLite)
- **Docker** (PHP-FPM + Nginx + PostgreSQL)
- **JWT** authentication (`tymon/jwt-auth`)
- **Laravel Queues** (database driver) for async notifications
- **WhatsApp** via Evolution API (`MessageService`)
- **Email** via Laravel Mailer

---

## Getting Started

### 1. Copy and configure environment

```bash
cp .env.example .env
```

Fill in the required values:

```env
DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=eye_center
DB_USERNAME=eye_center
DB_PASSWORD=your_password

MESSAGE_SERVICE_URL=http://your-evolution-api:8081
MESSAGE_SERVICE_API_KEY=your_api_key
MESSAGE_SERVICE_INSTANCE=Eye Center
```

### 2. Start containers

```bash
docker-compose up -d
```

### 3. Run migrations

```bash
docker-compose exec app php artisan migrate
```

### 4. Seed the first admin user

Registration is admin-only. Create the first user via Tinker:

```bash
docker-compose exec app php artisan tinker
```

```php
\App\Models\User::create([
    'name'     => 'Admin',
    'email'    => 'admin@eyecenter.com',
    'password' => bcrypt('your_password'),
    'roles'    => ['admin'],
]);
```

### 5. Start the queue worker

```bash
docker-compose exec app php artisan queue:work
```

For production, use Supervisor to keep the worker alive:

```ini
[program:eye-center-worker]
command=php /var/www/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
```

---

## Authentication

All endpoints except `POST /login` require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Auth endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/login` | Public | Login and receive JWT token |
| POST | `/api/register` | Admin | Create a new user |
| GET | `/api/user` | Authenticated | Get current user |
| POST | `/api/logout` | Authenticated | Invalidate token |

---

## API Endpoints

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/order` | Authenticated | List orders (paginated) |
| POST | `/api/order` | Authenticated | Create order |
| GET | `/api/order/{id}` | Authenticated | Get order |
| PUT/PATCH | `/api/order/{id}` | Authenticated | Update order |
| DELETE | `/api/order/{id}` | **Admin** | Delete order |

Query params for listing: `?page=1&perPage=15`

### Lenses

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/lens` | Authenticated | List lenses |
| GET | `/api/lens/{id}` | Authenticated | Get lens |
| POST | `/api/lens` | **Admin** | Create lens |
| PUT/PATCH | `/api/lens/{id}` | **Admin** | Update lens |
| DELETE | `/api/lens/{id}` | **Admin** | Delete lens |
| POST | `/api/lens/bulkCreate` | **Admin** | Import from Excel |

### Terms

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/terms` | Authenticated | List terms |
| GET | `/api/terms/{id}` | Authenticated | Get term |
| POST | `/api/terms` | **Admin** | Create term |
| PUT/PATCH | `/api/terms/{id}` | **Admin** | Update term |
| DELETE | `/api/terms/{id}` | **Admin** | Delete term |

---

## Notifications

When an order is created, two async jobs are dispatched to the queue:

- **`SendOrderConfirmationJob`** — sends a welcome email and a WhatsApp message with lens care instructions. Sets `order_confirmation = true`.
- **`SendOrderExpiryNotificationJob`** — triggered immediately if the term expires in 2 days, or daily by the scheduler. Sends an expiry reminder email and WhatsApp message. Sets `order_remember = true`.
- **`SendBirthdayWishJob`** — dispatched daily by the scheduler to customers whose birthday matches today.

All jobs retry up to **3 times** with a **30-second backoff** on failure.

### Scheduled commands

| Command | Schedule | Description |
|---------|----------|-------------|
| `orders:send-daily-email` | Daily at 23:00 | Dispatches expiry notifications for orders due today |
| `users:send-birthday-wishes` | Daily at 09:00 | Dispatches birthday wish emails |

---

## Excel Bulk Import

`POST /api/lens/bulkCreate` accepts an Excel file (`.xlsx`, `.xls`, `.csv`, max 5 MB).

Expected sheet layout:

| Column A | Column B | Column C |
|----------|----------|----------|
| Lens name | Term label | Days to expire |
| Lens name | Term label | Days to expire |
| ... (up to 300 rows for lenses, 30 for terms) | | |

> **Warning:** This operation clears the existing `lenses` and `terms` tables before importing. All active orders referencing those records will lose their foreign key references if `onDelete` cascade is set.

---

## Architecture

```
app/
├── Http/
│   ├── Controllers/        # Thin controllers — validate input, delegate to services/jobs
│   ├── Middleware/
│   │   ├── JwtMiddleware   # Validates JWT token
│   │   └── AdminMiddleware # Checks roles contains 'admin'
│   └── Requests/           # FormRequest validation for all store/update operations
├── Jobs/
│   ├── SendOrderConfirmationJob
│   ├── SendOrderExpiryNotificationJob
│   └── SendBirthdayWishJob
├── Services/
│   ├── MessageService            # WhatsApp transport layer (Evolution API)
│   └── OrderNotificationService  # Dispatches notification jobs
├── Mail/
│   ├── OrderCreatedMail
│   ├── ExpireDateTerms
│   └── BirthdayWishMail
└── Console/Commands/
    ├── SendOrderExpireDateMail
    └── SendBirthdayWishes
```

---

## Database Migration (SQLite → PostgreSQL)

To migrate existing SQLite data to the PostgreSQL instance:

```bash
# 1. Start PostgreSQL and run migrations
docker-compose up -d database
docker-compose exec app php artisan migrate

# 2. Run pgloader
pgloader sqlite:///path/to/database.sqlite \
         postgresql://eye_center:password@localhost:5432/eye_center \
         -- include no drop, create no tables, create no indexes, reset no sequences \
         -- excluding table names matching 'migrations'
```

---

## Security

- JWT authentication on all non-public routes
- Role-based access control — admin role required for all write operations on lenses/terms, user registration, and order deletion
- All inputs validated through `FormRequest` classes — `$request->all()` is never passed directly to Eloquent
- Excel cell values sanitized against formula injection (`=`, `+`, `-`, `@`, `|`, `%`)
- File uploads validated by MIME type and size
- `MESSAGE_SERVICE_API_KEY` has no insecure default — app will fail loudly if the key is missing
