# Tickets Management System

## Description

A Single Page Application (SPA) for managing technical support tickets. The system supports three user roles — **Admin**, **Technician**, and **Client** — each with specific permissions over ticket creation, editing, assignment, and deletion. Authentication and data are served by two independent `json-server` instances.

---

## Technologies Used

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Vanilla JavaScript (ES Modules)     |
| Build tool | Vite 8                              |
| Styling    | Bootstrap 5 (CDN)                   |
| HTTP       | Axios                               |
| Backend    | json-server (two instances)         |
| Storage    | localStorage (session persistence)  |

---

## Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## How to Run

### 1. Start both json-server services

Open two separate terminals:

```bash
# Terminal 1 — Authentication service (port 3000)
cd backend
npx json-server --watch auth/auth-db.json --port 3000

# Terminal 2 — Data service (port 3002)
cd backend
npx json-server --watch data/data-db.json --port 3002
```

Or use the npm scripts:

```bash
cd backend
npm start        # auth on port 3000
npm run start2   # data on port 3002
```

### 2. Start the frontend

```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## Default Credentials

| Role    | Email             | Password |
|---------|-------------------|----------|
| Admin   | felipe@test.com   | 123      |
| Tech    | luis@test.com     | 123      |
| Client  | mateo@test.com    | 123      |

New clients can register through the registration form.

---

## Project Structure

```
tickets-management-system/
├── backend/
│   ├── auth/
│   │   └── auth-db.json         # Users (admin, tech, client)
│   ├── data/
│   │   └── data-db.json         # Tickets
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.js              # Entry point, event listeners, router init
    │   ├── middleware/
    │   │   └── guards.js        # authGuard, roleGuard
    │   ├── router/
    │   │   └── router.js        # Hash-based SPA router
    │   ├── services/
    │   │   └── ticketService.js # All ticket CRUD API calls
    │   ├── store/
    │   │   ├── auth.js          # Login/register API helpers
    │   │   └── session.js       # localStorage session + inactivity timer
    │   ├── utils/
    │   │   └── https.js         # Axios instances (authApi, dataApi)
    │   └── views/
    │       ├── dashboard/
    │       │   ├── dashboard.html/js
    │       │   └── roles/
    │       │       ├── admin.js    # Full CRUD + tech assignment
    │       │       ├── tecnico.js  # Own tickets + status change
    │       │       └── cliente.js  # Own tickets, edit if no tech assigned
    │       ├── denied/          # Access denied page
    │       ├── login/           # Login form
    │       └── register/        # Registration form (clients only)
    ├── .env                     # API URLs and config
    └── index.html
```

---

## Role Behavior

### Admin
- View **all** tickets in the system
- Create, edit, and delete any ticket
- Assign any technician to a ticket
- Change ticket status to **"Assigned"** only after a technician is selected

### Technician (tech)
- Create tickets (auto-assigned as responsible technician)
- View and edit only their own tickets
- Change status: In Progress, Assigned, Solved
- Cannot assign other technicians

### Client (client)
- Create tickets (no technician selection — admin assigns later)
- View their own tickets
- Edit a ticket **only if no technician has been assigned yet** (or if status is closed)
- Cannot assign technicians or change status

---

## Route Protection

- `authGuard`: redirects unauthenticated users to `/login`; redirects logged-in users away from public routes
- `roleGuard`: shows the "Access Denied" page if the user's role is not in the route's allowed list
- Session auto-expires after **5 minutes of inactivity** (resets on any click or keypress)

---

## Technical Decisions

- **Hash-based routing** (`window.location.hash`) avoids server-side configuration for SPA navigation.
- **Two separate json-server instances** keep authentication data isolated from business data.
- **Module-level state** in role views (`ticketsList`, `currentEditId`) avoids redundant API calls on every re-render.
- **Bootstrap 5 via CDN** provides a responsive UI without adding to the bundle size.
- **`?raw` HTML imports** (Vite feature) allow HTML templates to live in separate `.html` files while being injected via `innerHTML`.

---

## Team

- Felipe Beltran (felipe-bel07)
