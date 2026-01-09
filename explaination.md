# Explaination (Architecture + Execution Flow)

This document explains **how the system works end-to-end** (backend + frontend), the **execution flow**, and what each app/module is responsible for.

---

## 1) High-level architecture

### Components

- **Django backend** (API server)
  - Authentication via JWT
  - Role-based permissions
  - CMS content CRUD (Categories + Posts)
  - AI helper endpoints (draft/improve/summarize/SEO)

- **React frontend** (UI)
  - Calls backend via `/api/*`
  - Stores JWT tokens locally
  - Automatically refreshes access tokens
  - Provides editor UI + AI tools panel

### Runtime flow

1) User opens React app (browser)
2) React checks local storage for tokens
3) If tokens exist, React calls `/api/users/me/`
4) UI renders pages based on auth + role
5) Content pages call posts/categories APIs
6) Editor calls AI endpoints for content assistance

---

## 2) Backend: Django project wiring

### Settings

File: [backend/cms/settings.py](backend/cms/settings.py)

Key responsibilities:
- Installs apps: `users`, `articles`, `ai_engine`
- Configures REST Framework + JWT
- Enables CORS for React dev server
- Enables filtering/search/ordering
- Enables API schema/docs (Swagger)

### Root URLs

File: [backend/cms/urls.py](backend/cms/urls.py)

Routes:
- `/api/users/…` → [backend/users/urls.py](backend/users/urls.py)
- `/api/articles/…` → [backend/articles/urls.py](backend/articles/urls.py)
- `/api/ai/…` → [backend/ai_engine/urls.py](backend/ai_engine/urls.py)
- `/api/schema/` + `/api/docs/` → Swagger/OpenAPI

---

## 3) Backend: Users app (auth + roles)

### Data model

File: [backend/users/models.py](backend/users/models.py)

- Custom `User` extends `AbstractUser`
- Adds `role`: `admin`, `editor`, `author`
- Email is unique

### Key endpoints

URL config: [backend/users/urls.py](backend/users/urls.py)

- `POST /api/users/register/` (self-register → always `author`)
- `POST /api/users/token/` (login with username or email)
- `POST /api/users/token/refresh/`
- `GET /api/users/me/`
- `GET /api/users/admin/users/` (admin)
- `PATCH /api/users/admin/users/<id>/role/` (admin)

---

## 4) Backend: Articles app (Categories + Posts)

Models: [backend/articles/models.py](backend/articles/models.py)

- `Category` (name/slug)
- `Post` (title/content/status, author, optional category)

Serialization: [backend/articles/serializers.py](backend/articles/serializers.py)

- `PostSerializer` supports `category_id` for writes and embeds `category` for reads.

Permissions: [backend/articles/permissions.py](backend/articles/permissions.py)

- Admin/Editor can manage all posts
- Author can only manage own posts

---

## 5) Backend: AI Engine

Services: [backend/ai_engine/services.py](backend/ai_engine/services.py)

- Uses OpenAI if `OPENAI_API_KEY` is set
- Falls back to safe deterministic generation if not set

Endpoints: [backend/ai_engine/urls.py](backend/ai_engine/urls.py)

- `POST /api/ai/generate/`
- `POST /api/ai/improve/`
- `POST /api/ai/summarize/`
- `POST /api/ai/seo-score/`

---

## 6) Frontend: React flow

Routing: [frontend/src/App.jsx](frontend/src/App.jsx)

Auth state: [frontend/src/store/authStore.js](frontend/src/store/authStore.js)

API client: [frontend/src/api/client.js](frontend/src/api/client.js)

- Attaches JWT access token
- Refreshes automatically on 401

Editor page: [frontend/src/pages/PostEditorPage.jsx](frontend/src/pages/PostEditorPage.jsx)

- Saves posts through `/api/articles/posts/<id>/`
- Calls AI endpoints and writes results into content
