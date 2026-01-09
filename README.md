# AI Powered CMS (Django + React)

A role-based Content Management System with a modern React UI and AI-assisted writing tools.

- **Backend**: Django + DRF + JWT auth
- **Frontend**: Vite + React + Tailwind
- **AI helpers**: Draft generation, improvement, summarization, SEO scoring

---

## 1) Project layout

- Backend lives in [backend/](backend/)
- Frontend lives in [frontend/](frontend/)

Key backend apps:
- [backend/users/](backend/users/) — auth, roles, admin endpoints
- [backend/articles/](backend/articles/) — categories + posts CRUD
- [backend/ai_engine/](backend/ai_engine/) — AI helper APIs

---

## 2) Prerequisites

- Python 3.12+
- Node.js 18+ (recommended 20+)

---

## 3) Backend setup (Windows)

### 3.1 Create / activate venv

From the repo root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3.2 Install dependencies

```powershell
pip install -r requirements.txt
```

Optional heavier AI dependencies (only if you want local NLP libraries):

```powershell
pip install -r requirements-ai.txt
```

### 3.3 Environment variables

Backend loads env vars from [backend/.env](backend/.env).

Minimum required:
- `SECRET_KEY`
- `DEBUG=True` (for local dev)

Optional:
- `ALLOWED_HOSTS=localhost,127.0.0.1`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`
- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=gpt-4o-mini`

### 3.4 Run migrations

```powershell
python manage.py migrate
```

### 3.5 Create an admin user

```powershell
python manage.py createsuperuser
```

Recommended: after creation, set the `role` to `admin` in the Django admin UI.

### 3.6 Start backend server

```powershell
python manage.py runserver 127.0.0.1:8000
```

Backend will be available at:
- API docs: `http://127.0.0.1:8000/api/docs/`
- Admin: `http://127.0.0.1:8000/admin/`

---

## 4) Frontend setup (React)

### 4.1 Install dependencies

```powershell
cd frontend
npm install
```

### 4.2 Start frontend dev server

```powershell
npm run dev
```

Notes:
- This app is a **Vite** app. `npm start` also works because we added an alias to the same command.
- The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000` (configured in [frontend/vite.config.js](frontend/vite.config.js)).

Frontend will be available at:
- `http://localhost:5173/`

---

## 5) End-to-end usage checklist

1) Start backend (`python manage.py runserver 127.0.0.1:8000`)
2) Start frontend (`npm run dev`)
3) Register a new user (Register page)
   - For security, self-registration always creates an `author`
4) Login
5) Create categories (Admin/Editor only)
6) Create a post → open Editor
7) Use AI tools in the right panel (Generate / Improve / SEO / Summarize)

---

## 6) Common troubleshooting

### Tailwind "Unknown at rule @tailwind" warnings

This is an editor-lint warning (not a build error). It is already suppressed in workspace settings:
- [.vscode/settings.json](.vscode/settings.json)

### API 401 Unauthorized

- You must login and send `Authorization: Bearer <access>`
- The frontend does this automatically via Axios interceptors

### CORS issues

- Make sure `CORS_ALLOWED_ORIGINS` includes your frontend origin in [backend/.env](backend/.env)

---

## 7) Deeper technical explanation

See:
- [explaination.md](explaination.md)
