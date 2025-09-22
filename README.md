# Todo App (Django + React + Vite)

A simple full‑stack Todo application with a Django REST Framework backend and a React (Vite) frontend.

## Stack
- Backend: Django, Django REST Framework, Postgres
- Frontend: React, Vite
- Dev: Docker Compose (Postgres, Django, React)

## Directory Structure
- `backend/`: Django project (API)
- `frontend/`: React app (Vite)

## Prerequisites
- Docker and Docker Compose

## Quick Start (Docker)
1. Build and start all services:
   ```bash
   docker compose -f ./docker-compose.yaml up -d --build
   ```
2. Open the app:
   - Frontend: `http://localhost:5173`
   - API root: `http://localhost:8000/api`

3. Stop services:
   ```bash
   docker compose -f ./docker-compose.yaml down
   ```

## Running Locally Without Docker
### Backend (Django)
1. Create venv and install deps:
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure database (defaults assume Postgres via Docker). For local SQLite dev, set in `backend/todo/settings.py` or export appropriate env vars for Postgres.
3. Apply migrations and run server:
   ```bash
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```

### Environment variables

Create minimal `.env` files (copy from the examples):

Backend (`backend/.env`)

```
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DB_ENGINE=django.db.backends.postgresql
DB_NAME=todo
DB_USER=root
DB_PASSWORD=123456
DB_HOST=db
DB_PORT=5432
```

Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Frontend (Vite)
1. Install deps and run dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173`.

## API Overview
Base URL: `http://localhost:8000/api`

- `GET /tasks` — List tasks (supports `?completed=true|false`). Response is paginated if DRF pagination is enabled.
- `POST /tasks` — Create task `{ title: string }`.
- `PATCH /tasks/<id>` — Update task (e.g., `{ is_completed: true }`).
- `DELETE /tasks/<id>` — Delete a task.
- `GET /tasks/not-completed-count` — Returns number of tasks not completed (integer).
- `POST /tasks/complete-all` — Mark all tasks complete/incomplete. Body: `{ is_completed: true|false }`.
- `DELETE /tasks/completed` — Delete all completed tasks. Returns 204.

Notes:
- Router is created with `trailing_slash=False`, so URLs do not end with a slash.
- Tests assume list responses may be paginated (`{ results: [...] }`) or plain lists.


## Common Commands
### Docker
```bash
# Build & start
docker compose -f ./docker-compose.yaml up -d --build

# View logs
docker compose -f ./docker-compose.yaml logs -f

# Stop
docker compose -f ./docker-compose.yaml down
```

### Backend Tests
```bash
# Inside Docker
docker compose -f ./docker-compose.yaml exec todo python manage.py test
```

### Area of improvements:

## Frontend Improvements:

Add loading and error states for API calls.
Use React Router for better navigation (e.g., filter via URL).
Improve accessibility (ARIA attributes, keyboard navigation).
Add unit and integration tests for react project.
Use PropTypes or TypeScript for type safety.

## Backend Improvements:
Add authentication (e.g., JWT, OAuth).


## License
MIT (for demo purposes).
