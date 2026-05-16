# Job Tracker Client

React frontend for the Job Tracker API.

## Tech Stack

- **Framework:** React 19 (Create React App)
- **Routing:** React Router v7
- **HTTP:** Axios with automatic token refresh interceptor
- **Styling:** Tailwind CSS

## Getting Started

```bash
npm install
npm start
```

Create a `.env` file in the project root:

```
REACT_APP_API_URL=http://localhost:3000/api
```

For production, point this at the live API: `https://job-application-tracker-g2m8.onrender.com/api`

## Pages & Routes

| Route | Page | Auth |
|---|---|---|
| `/login` | Login | Public only |
| `/register` | Register | Public only |
| `/jobs` | Job list | Protected |
| `/jobs/create` | Create job | Protected |
| `/jobs/:id/edit` | Edit job | Protected |

`/` redirects to `/jobs`. Unknown routes also redirect to `/jobs`.

## Auth Architecture

Access tokens are stored in memory (not localStorage) via `src/api/client.js`. The Axios instance automatically:
- Attaches the access token to every request as `Authorization: Bearer`
- Sends the `httpOnly` refresh cookie with every request (`withCredentials: true`)
- On a 401, silently refreshes the access token and retries the failed request
- Queues concurrent requests that arrive during a refresh to avoid multiple refresh calls

`AuthContext` manages login/logout state and calls `setAccessToken` to update the in-memory token.

## Testing

```bash
npm test
```
