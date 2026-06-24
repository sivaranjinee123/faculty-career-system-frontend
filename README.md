# Faculty Career Advancement System — Frontend

A React dashboard for the Faculty Career Advancement System — built to learn modern frontend architecture (routing, global state, role-based UI) alongside a Spring Boot backend.

## What This Project Does

Provides separate, role-aware experiences for two user types from a single login:

- **Faculty** manage achievements, upload supporting certificates, submit promotion applications, track status, and request an AI-generated eligibility evaluation.
- **Admin** review submitted applications alongside the actual achievement evidence (not just the faculty's claims), then approve or reject with comments.

The sidebar, dashboard stats, and available actions all adapt automatically based on the logged-in user's role.

## Tech Stack

- **React** + **Vite**
- **React Router** (nested routes with a persistent sidebar layout via `<Outlet />`)
- **React Context** for global auth state
- **Axios** with request interceptors for automatic JWT attachment
- **Tailwind CSS**
- **react-hot-toast** for notifications
- **lucide-react** for icons

## Key Features

- **JWT-based auth** with token persisted in `localStorage`, auto-attached to every request via an Axios interceptor
- **Role-based sidebar and dashboard** — Faculty and Admin see structurally different navigation and content from the same layout component
- **Nested routing** with a shared sidebar shell (`<DashboardLayout />`) wrapping per-page content via `<Outlet />`
- **Full CRUD UI** for achievements, including inline edit/delete
- **File upload** with drag-free native file input styling, and secure blob-based downloads (since the download endpoint requires JWT, plain `<a href>` links don't work — files are fetched via Axios and converted to a downloadable blob client-side)
- **AI evaluation card** — triggers an LLM-backed eligibility assessment on demand
- **Admin evidence panel** — expandable per-application view showing the faculty's actual achievements and uploaded certificates, so admins can verify claims before approving

## Project Structure

```
src/
├── pages/        # Route-level components (Dashboard, Achievements, Applications, Profile, Admin)
├── components/    # Reusable UI (modals, sidebar layout, cards)
├── context/       # AuthContext — global user/auth state
└── services/      # Axios-based API call functions, one file per backend resource
```

## Running Locally

**Prerequisites:** Node.js, the backend running at `http://localhost:8080`

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Live Demo

Live app: _coming soon_
Related repo: [faculty-career-system-backend](#)

## What I'd Improve Next

- Loading skeletons instead of spinners
- Mobile-responsive sidebar (currently fixed-width)
- Resubmission flow after a rejected application

## Notes

This is a solo learning project built to deeply understand full-stack engineering — JWT auth flows, role-based access control, and React state management — rather than to serve real institutional users.
