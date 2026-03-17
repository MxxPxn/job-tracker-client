# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                     # Dev server at http://localhost:3001
npm test -- --watchAll=false  # Run all tests once
npm test                      # Run tests in interactive watch mode
npm run build                 # Production build to /build
```

## Architecture

**Create React App** (React 19, JavaScript). Backend API runs at `http://localhost:3000` — set via `REACT_APP_API_URL` in `.env`.

**Tech Stack:** React 19, React Router v7, Axios, Jest + React Testing Library.

**Layered Structure:**
```
src/api/client.js         → Axios instance with auth + 401 interceptors
src/context/AuthContext.js → JWT token state (localStorage-backed)
src/components/           → ProtectedRoute, PublicRoute guards
src/pages/                → LoginPage, RegisterPage, JobsPage, CreateJobPage, EditJobPage
```

**Auth Flow:** JWT token stored in `localStorage`. `AuthContext` initializes synchronously via `useState(() => localStorage.getItem('token'))`. `ProtectedRoute` redirects to `/login` if no token. `PublicRoute` redirects to `/jobs` if token exists.

**API Client (`src/api/client.js`):**
- Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: catches 401s on non-auth routes → clears token + redirects to `/login`. Auth routes (`/auth/*`) pass 401 through so login/register can display error messages.

**Routes:**
| Path | Guard | Page |
|---|---|---|
| `/login` | PublicRoute | LoginPage |
| `/register` | PublicRoute | RegisterPage |
| `/jobs` | ProtectedRoute | JobsPage |
| `/jobs/create` | ProtectedRoute | CreateJobPage |
| `/jobs/:id/edit` | ProtectedRoute | EditJobPage |

**API Response Shapes:**
- Auth: `{ success: true, token: "..." }` — token at top level, not nested in `data`
- Jobs: `{ success: true, data: [...] , pagination: { total, page, totalPages, limit } }`

**Key Patterns:**
- `JOBS_PER_PAGE = 10` constant defined outside `JobsPage` component
- Job status values: `applied`, `interview`, `offer`, `rejected`
- `JobsPage` re-fetches when `statusFilter` or `currentPage` changes via `useEffect([statusFilter, currentPage])`

**Testing:** Jest + React Testing Library. Tests require Jest config workarounds in `package.json` for React Router v7 and Axios ESM compatibility with CRA's older test runner. `TextEncoder` polyfill added in `src/setupTests.js`.
- `AuthContext.test.js` — login/logout/localStorage persistence
- `Login.test.js` — form rendering, successful login, error display

# Mentorship Instructions

"Act as a Senior Backend Architect and Mentor. My goal is to become a professional backend engineer, so I need you to focus on teaching, not just doing.

Our Interaction Rules:

  1.  No Spoiling: Never give me a full block of code immediately. Start by explaining the high-level logic and the 'Why' behind the solution.

  2.  Socratic Method: If I make a mistake, ask me a guiding question to help me find the error myself before you correct it.

  3.  Architecture First: For every feature, discuss the database schema, API design (REST/GraphQL), and security implications (authentication, validation) before we write code.

   4. Standard Practices: Always enforce industry standards (clean code, SOLID principles, DRY, and proper error handling).

   5. Review Mode: When I finish a task, provide a 'Senior Review' where you point out one thing I did well and two things I could optimize for scale or security."
