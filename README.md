# Reservation Management System

A web application for managing reservation. It allows users to log in based on their role, view reservations, create new requests, and assign technicians using a simulated backend powered by `json-server`.

## Technologies

* Frontend: Vite, JavaScript, HTML, and CSS
* HTTP Client: Axios
* Icons: Lucide
* Simulated Backend: json-server
* Local Persistence: JSON files

## Project Structure

```txt
reservation-management-system/
├── backend/
│   ├── auth/
│   │   └── auth-db.json
│   ├── data/
│   │   └── data-db.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── views/
│   ├── style/
│   └── package.json
└── README.md
```

## Requirements

* Node.js
* npm

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Inside the `frontend` folder, create a `.env` file with the following content:

```env
VITE_AUTH_API_URL=http://localhost:3000
VITE_DATA_API_URL=http://localhost:3002
VITE_CONTENT_TYPE=application/json
VITE_TIMEOUT=5000
```

## Running the Application

You must start three separate processes in different terminal windows.

Authentication server:

```bash
cd backend
npm run start
```

Data server:

```bash
cd backend
npm run start2
```

Frontend:

```bash
cd frontend
npm run dev
```

Then open the URL displayed by Vite, typically:

```txt
http://localhost:5173
```

## Test Users

| Role       | Email                                     | Password |
| ---------- | ----------------------------------------- | -------- |
| Admin      | [felipe@test.com](mailto:felipe@test.com) | 123      |
| Client     | [mateo@test.com](mailto:mateo@test.com)   | 123      |


## Main Routes

| Route               | View             |
| ------------------- | ---------------- |
| `/`                 | Login            |
| `/dashboard/admin`  | Admin Dashboard  |
| `/dashboard/client` | Client Dashboard |

## Scripts

Backend:

```bash
npm run start
npm run start2
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Features

* Role-based authentication
* Session persistence using `localStorage`
* Logout functionality
* Inactivity timeout
* Reservation listing for administrators
* Reservation listing by client
* Reservation creation
* Reservation deletion

## Role permitions

Admin:


User:

## Development Notes

* The backend is simulated. Data is stored directly in JSON files.
* To allow the frontend to read the API URLs, the environment variables must be defined in `frontend/.env`.
* If you are using PowerShell and `npm` is blocked by execution policies, you can run the commands using `npm.cmd`.
