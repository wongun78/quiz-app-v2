# client — React 19 Frontend

SPA for the Quiz platform. React 19 + TypeScript 5.9 + Vite (rolldown) + Tailwind CSS 4 + shadcn/ui.

---

## Stack

|              |                                                      |
| ------------ | ---------------------------------------------------- |
| Framework    | React 19.2, TypeScript 5.9                           |
| Build        | Vite (rolldown) 7.2                                  |
| Routing      | React Router 7.10                                    |
| Server state | TanStack Query v5                                    |
| Client state | Zustand 5, React Context (Auth, Theme)               |
| Forms        | React Hook Form 7.69 + Zod 4.3                       |
| HTTP         | Axios 1.13 + async-mutex (token refresh)             |
| UI           | Tailwind CSS 4.1, shadcn/ui (Radix UI), Lucide React |
| Testing      | Vitest 4, @testing-library/react 16                  |

---

## Run locally

**Requires:** Backend running at `http://localhost:8080`.

```bash
npm install
npm run dev       # http://localhost:5173
```

Environment (`.env`):

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

`.env.production` is committed with a placeholder — actual URL is baked in at Docker build time by CI (see `VITE_API_BASE_URL` build-arg).

---

## Scripts

```bash
npm run dev        # dev server (HMR)
npm run build      # tsc + vite build → dist/
npm run preview    # serve dist/ locally
npm run lint       # ESLint
npm run test       # Vitest (watch)
npm run test:run   # Vitest (single run, CI)
npm run test:ui    # Vitest UI
```

---

## Docker

Multi-stage build: Node 20 for build → Nginx for serve.

```bash
docker build \
  --platform linux/amd64 \
  --build-arg VITE_API_BASE_URL=https://your-backend.run.app/api/v1 \
  -t quiz-frontend .
```

`VITE_API_BASE_URL` must be passed at build time — Vite bundles it statically into JavaScript.

---

## Source structure

```
src/
├── App.tsx              Routes + global providers
├── components/
│   ├── admin/           User/Quiz/Question/Role management tables
│   ├── auth/            ProtectedRoute, Authorize
│   ├── home/            Hero, quiz section
│   ├── layout/          Navbar, Sidebar, Footer, layouts
│   ├── quiz/            QuizCard, skeletons
│   ├── shared/          ConfirmDialog, SectionHeading, etc.
│   └── ui/              shadcn/ui primitives (button, input, table, ...)
├── config/
│   ├── axios.config.ts  Axios instance + interceptors (token refresh)
│   ├── constants.ts     API paths, pagination defaults
│   └── env.ts           VITE_API_BASE_URL validation
├── contexts/
│   ├── AuthContext.tsx   User session, login/logout
│   └── ThemeContext.tsx  Light/dark theme
├── hooks/               useQuiz, useQuestions, useUsers, useRole, usePermission
├── pages/               One folder per route (admin/, auth/, exam/, quizzes/, ...)
├── services/api/        Typed API functions (axios calls)
├── types/               backend.d.ts, role.ts, axios.d.ts
└── validations/         Zod schemas (auth, quiz, admin)
```

---

## Key design decisions

**VITE_API_BASE_URL baked at build-time:** Vite inlines env vars into the JS bundle. Changing the backend URL requires a new Docker image. CI always fetches the live backend URL from Cloud Run before building.

**Token refresh mutex:** `async-mutex` prevents multiple parallel requests all trying to refresh the token simultaneously — only the first one refreshes, the rest wait.

**TanStack Query:** All server data lives in Query cache (auto stale/refetch). Mutations call `queryClient.invalidateQueries` to trigger refetch.

**Protected routes:** `ProtectedRoute` checks `AuthContext`. `Authorize` checks role — unauthorized users get redirected, not an error page.
