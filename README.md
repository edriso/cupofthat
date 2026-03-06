# Cup of That

A social platform where users share one post per day about what they're working on, learning, or enjoying.

Built with Vue 3, Pinia, Vue Router, and Tailwind CSS 4.

## Features

- Daily posting with text, images, and tags
- User profiles with cover photos and bios
- Block/unblock users
- Activity calendar tracking post streaks
- Post likes and reporting
- Email verification and password reset
- Settings for profile, account, and preferences

## Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` with mock data by default.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |
| `VITE_USE_MOCKS` | `true` | Set to `false` to use a real backend |

## Project Structure

```
src/
  components/    # Reusable Vue components
  composables/   # Vue composables (hooks)
  helpers/       # Config and constants
  mock/          # Mock data for development
  models/        # Data models with request builders
  services/      # API service (axios instance)
  stores/        # Pinia stores
  views/         # Page components
```

## Backend Integration

The app ships with mock data enabled by default. To connect a real backend, see [BACKEND.md](./BACKEND.md) for the full API specification including all endpoints, request/response shapes, and data models.

## Build

```bash
npm run build
npm run preview
```
