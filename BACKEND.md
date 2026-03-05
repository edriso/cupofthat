# Backend Integration Guide

This document describes how to connect Cup of That to a real backend API.

## Quick Start

1. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` to point to your backend and disable mocks:
   ```
   VITE_API_URL=http://localhost:8080/api
   VITE_USE_MOCKS=false
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

The Vite dev server proxies `/api` requests to your backend to avoid CORS issues during development.

## How It Works

The app uses an `api` service (`src/services/api.js`) built on axios with:

- **Base URL** from `VITE_API_URL` environment variable
- **Auth token** automatically injected via request interceptor (Bearer token from localStorage)
- **401 handling** via response interceptor (clears token and redirects to login)

Every Pinia store checks the `VITE_USE_MOCKS` flag. When `true` (default), stores return mock data from `src/mock/data.js`. When `false`, stores make real HTTP requests.

## Expected API Endpoints

Your backend should implement these REST endpoints. All authenticated routes expect an `Authorization: Bearer <token>` header.

### Authentication (public)

| Method | Endpoint             | Request Body                                                    | Response                        |
|--------|----------------------|-----------------------------------------------------------------|---------------------------------|
| POST   | `/api/register`      | `{ name, username, email, password, password_confirmation }`    | `{ token, user }`              |
| POST   | `/api/login`         | `{ email, password }`                                           | `{ token, user }`              |
| POST   | `/api/verify-email`  | `{ email, verification_code }`                                  | `{ message }`                  |
| POST   | `/api/resend-code`   | `{ email }`                                                     | `{ message }`                  |
| POST   | `/api/forgot-password` | `{ email }`                                                   | `{ message }`                  |
| POST   | `/api/reset-password`  | `{ email, verification_code, password, password_confirmation }` | `{ message }`                |

### User (authenticated)

| Method | Endpoint             | Request Body | Response                  |
|--------|----------------------|--------------|---------------------------|
| GET    | `/api/me`            | -            | `{ user }`                |
| POST   | `/api/logout`        | -            | `{ message }`             |

### Profile (authenticated)

| Method | Endpoint                    | Request Body                                                   | Response       |
|--------|-----------------------------|----------------------------------------------------------------|----------------|
| PUT    | `/api/profile`              | `{ firstname, lastname, craft, bio, birthday, socials, calendar_start, calendar_display }` | `{ message }` |
| PUT    | `/api/profile/email`        | `{ email, new_email, password }`                               | `{ message }`  |
| PUT    | `/api/profile/username`     | `{ username }`                                                 | `{ message }`  |
| PUT    | `/api/profile/password`     | `{ old_password, password, password_confirmation }`            | `{ message }`  |
| POST   | `/api/profile/profile-picture` | FormData with `image` file                                  | `{ message }` (image URL) |
| POST   | `/api/profile/profile-cover`   | FormData with `image` file                                  | `{ message }` (image URL) |

### Posts (authenticated)

| Method | Endpoint                   | Request Body                          | Response                  |
|--------|----------------------------|---------------------------------------|---------------------------|
| GET    | `/api/posts`               | -                                     | `{ posts: [...] }`        |
| GET    | `/api/posts/:id`           | -                                     | `{ post }`                |
| POST   | `/api/posts`               | FormData: `content`, `tag`, `image`   | `{ message }` or `{ post }` |
| POST   | `/api/posts/:id`           | FormData: `content`, `tag`, `image`   | `{ post }`                |
| POST   | `/api/posts/:id/like`      | -                                     | `{ message }`             |
| POST   | `/api/posts/:id/dislike`   | -                                     | `{ message }`             |
| POST   | `/api/posts/:id/report`    | -                                     | `{ message }`             |

### Users (authenticated)

| Method | Endpoint                      | Request Body | Response           |
|--------|-------------------------------|--------------|--------------------|
| GET    | `/api/users/:username`        | -            | `{ user }`         |
| GET    | `/api/users/:username/posts`  | -            | `{ posts: [...] }` |
| GET    | `/api/users/search?q=`        | -            | `{ users: [...] }` |
| POST   | `/api/users/:username/follow`   | -          | `{ message }`      |
| POST   | `/api/users/:username/unfollow` | -          | `{ message }`      |
| POST   | `/api/users/:username/block`    | -          | `{ message }`      |
| POST   | `/api/users/:username/unblock`  | -          | `{ message }`      |

### Calendar & Badge (authenticated)

| Method | Endpoint        | Response                                    |
|--------|-----------------|---------------------------------------------|
| GET    | `/api/calendar` | `{ data: [{ date, count }, ...] }`          |
| GET    | `/api/badge`    | `{ data: { name, description, icon } }`     |

### Feedback (authenticated)

| Method | Endpoint         | Request Body          | Response       |
|--------|------------------|-----------------------|----------------|
| POST   | `/api/feedback`  | `{ content, email }`  | `{ message }`  |

## User Object Shape

The backend should return user objects matching this structure:

```json
{
  "id": 1,
  "firstname": "Jane",
  "lastname": "Doe",
  "username": "janedoe",
  "craft": "Designer",
  "bio": "Coffee enthusiast.",
  "email": "jane@example.com",
  "birthday": "1995-06-15",
  "images": [
    { "type": "user_profiles", "image": "https://..." },
    { "type": "user_covers", "image": "https://..." }
  ],
  "postsCount": 5,
  "activeDays": 42,
  "followers": [{ "id": 2, "username": "johndoe", "name": "John Doe" }],
  "following": [{ "id": 2, "username": "johndoe", "name": "John Doe" }],
  "blocklist": [{ "id": 3, "username": "blocked", "name": "Blocked User" }],
  "calendar_start": 1,
  "calendar_display": "month",
  "is_verified": true,
  "last_post_date": "2026-03-05",
  "socials": { "website": "https://example.com" }
}
```

## Post Object Shape

```json
{
  "id": 1,
  "content": "Post text content",
  "tag": "design",
  "image": "https://...",
  "owner": { "id": 1, "username": "janedoe", "firstname": "Jane", "lastname": "Doe", "images": [...] },
  "created_at": "2026-03-05T10:30:00Z",
  "liked": false,
  "likesCount": 12
}
```

## Error Responses

The frontend expects errors in this format:

```json
{
  "message": "Human-readable error message"
}
```

Return appropriate HTTP status codes: `422` for validation errors, `401` for unauthorized, `404` for not found.

## CORS

For production, configure your backend to allow requests from your frontend origin. During development, the Vite proxy handles this automatically.
