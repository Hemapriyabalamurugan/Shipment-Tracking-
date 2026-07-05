# Auth Service — ShipTrack Pro

Authentication & User Management microservice for the ShipTrack Pro logistics platform.

## Features

- **User Registration** — Email/password with BCrypt hashing
- **JWT Authentication** — Access tokens (15 min) + Refresh tokens (7 days), HMAC-SHA256
- **Google OAuth2 Login** — Auto-creates account on first login
- **Password Reset** — Token-based reset flow via email
- **Role-Based Access Control (RBAC)** — 5 roles with `@PreAuthorize`:
  - `CUSTOMER` — Own profile and shipments
  - `BUSINESS_CLIENT` — Own shipments + reports
  - `LOGISTICS_OPERATOR` — Shipment status + tracking
  - `SUPPORT_AGENT` — All shipments + user management
  - `ADMINISTRATOR` — Full access
- **Profile Management** — Update name, phone, image
- **Account Settings** — Change password with current-password verification
- **Activity Logging** — Tracks login, logout, password changes with IP & user-agent

## Tech Stack

| Component | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.3.0 |
| Security | Spring Security 6 |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| JWT | JJWT 0.12.6 |
| OAuth2 | Spring Security OAuth2 Client |
| Email | Spring Boot Starter Mail |
| Build | Maven |

## Running Locally

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL (or use Docker Compose)

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `shiptrack` | Database name |
| `DB_USERNAME` | `postgres` | DB username |
| `DB_PASSWORD` | `postgres` | DB password |
| `JWT_SECRET` | (built-in default) | Base64-encoded HMAC-SHA256 signing key |
| `GOOGLE_CLIENT_ID` | `placeholder` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | `placeholder` | Google OAuth2 client secret |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server |
| `MAIL_USERNAME` | — | SMTP username |
| `MAIL_PASSWORD` | — | SMTP password |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Allowed frontend origins |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL (for password reset links) |

### Build & Run

```bash
cd auth-service

# Compile
mvn clean compile

# Run tests
mvn test

# Start the service (port 8081)
mvn spring-boot:run
```

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login → JWT tokens |
| `POST` | `/auth/forgot-password` | Request password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |

### Current User (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/auth/me` | Get current user profile |

### User Management (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/profile` | Get profile |
| `PUT` | `/users/profile` | Update profile |
| `PUT` | `/users/settings` | Change password |
| `GET` | `/users/activity` | Activity log (paginated) |

### RBAC Demo (Role-restricted)

| Method | Endpoint | Required Role |
|---|---|---|
| `GET` | `/users/admin/dashboard` | `ADMINISTRATOR` |
| `GET` | `/users/support/tickets` | `SUPPORT_AGENT`, `ADMINISTRATOR` |
| `GET` | `/users/logistics/operations` | `LOGISTICS_OPERATOR`, `SUPPORT_AGENT`, `ADMINISTRATOR` |

## Example Requests

### Register
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (with JWT)
```bash
curl -X GET http://localhost:8081/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```
